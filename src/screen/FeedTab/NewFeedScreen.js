import React, { 
  useEffect, 
  useState, 
  useRef, 
  useContext, 
  useCallback 
} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, RefreshControl } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_POSTS_QUERY from '../../graphql/queries/getPosts';
import CREATE_POST_MUTATION from '../../graphql/mutations/createPost';
import { store, getShowQuestion } from '../../utils/store';
import NewFeedHeader from './Component/NewFeedHeader';
import Loading from '../../component/Loading';
import { BOTTOM_TAB_HEIGHT } from '../../utils/constants'
import { useFocusEffect } from '@react-navigation/native';
import HorizontalPullToRefresh from '../../component/HorizontalFlatlist';
import { ActivityIndicator, Surface } from 'react-native-paper';

const { height, width } = Dimensions.get('window');

const NewFeedScreen = (props) => {
  const { state: { me } } = useContext(store);
  const [posts, setPosts] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadError, setUploadError] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_POSTS_QUERY);
  const [createPost, { createpost_data }] = useMutation(CREATE_POST_MUTATION);

  const flatlistRef = useRef();

  useEffect(() => {
    const checkFirstTime = async () => {
      const show = getShowQuestion();
      if(show) props.navigation.navigate('Question');
    }
    checkFirstTime();
  }, []);

  useFocusEffect(useCallback(() => {
    setIsPaused(false);
    return () => {
      setIsPaused(true);
    };
  }, []));

  function loadMore() {
    fetchMore({
      variables: {
        cursor: data.getPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.getPosts.posts;
        const pageInfo = fetchMoreResult.getPosts.pageInfo;

        return newPosts.length
            ? {
                // Put the new.posts at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                getPosts: {
                    __typename: previousResult.getPosts.__typename,
                    posts: [...previousResult.getPosts.posts, ...newPosts],
                    pageInfo,
                    promote: previousResult.getPosts.promote
                }
            }
            : previousResult;
      }
    });
  }

  const togglePause = useCallback((index) => {
    if (index === currentlyPlaying) {
      setIsPaused(prev => !prev);
    } else {
      setCurrentlyPlaying(index);
      setIsPaused(false);
    }
  }, [currentlyPlaying]);

  const getItemLayout = useCallback((data, index) => ({
    length: width,
    offset: width * index,
    index,
  }), []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    const currentIndex = viewableItems.length > 0 ? viewableItems[0].index : null;
    setCurrentlyPlaying(currentIndex);
    setIsPaused(false);
  }, []);

  const keyExtractor = useCallback((item, index) => `${index}`);

  const renderItem = useCallback(({ item, index }) => (
    <FeedCard
      postInfo={item.postInfo}
      relation={item.relation}
      sponsor={item.sponsor}
      index={index}
      paused={index !== currentlyPlaying || isPaused}
      onPress={togglePause}
      shouldUnload={Math.abs(index - currentlyPlaying) > 1}
      // shouldUnload={index !== currentlyPlaying}
      navigation={props.navigation}
    />
  ), [currentlyPlaying, isPaused, togglePause, props.navigation]);


  if (loading) return <Loading />;
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>;

  return (
    <View style={styles.Root}>
      {
        refreshing || loading
        ?
        <Surface style={styles.refreshIndicator}>
          <ActivityIndicator animating={true} color={iOSColors.orange} />
        </Surface>
        : null
      }
      <FlatList
        horizontal={true}
        data={data.getPosts.posts}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={data.getPosts.pageInfo.hasNextPage ? loadMore : null}
        onEndReachedThreshold={1}
        removeClippedSubviews={true}
        onScroll={async (e) => {
          const xOffset = e.nativeEvent.contentOffset.x;
          if(xOffset < 0) {
            setRefreshing(true);
            refetch();
            setTimeout(() => setRefreshing(false), 1000);
          }
        }}
        scrollEventThrottle={100}
        ref={flatlistRef}
        pagingEnabled={true}
        snapToInterval={width}
        getItemLayout={getItemLayout}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={{ paddingBottom: BOTTOM_TAB_HEIGHT }}
        viewabilityConfig={viewabilityConfig}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={3}
        // refreshControl={
        //   <View style={{ transform: [{ rotate: '90deg' }] }}>    
        //     <RefreshControl
        //       refreshing={networkStatus === 4}
        //       onRefresh={refetch}
        //       progressViewOffset={-width}
        //       style={{ transform: [{ rotate: '-90deg' }] }}      
        //       tintColor={iOSColors.white}
        //       colors={[iOSColors.white]}
        //     />
        //   </View>
        // }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: iOSColors.black,
  },
  fullScreenItem: {
    height: height,
    width: width,
  },
  refreshIndicator: {
    position: 'absolute',
    top: 25,
    zIndex: 1,
    alignSelf: 'center',
    borderRadius: 20,
    padding: 8
  }
});

export default NewFeedScreen;
