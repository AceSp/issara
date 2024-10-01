import React, { 
  useEffect, 
  useState, 
  useRef, 
  useContext, 
  useCallback 
} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import FeedCard from '../component/FeedCard/FeedCard';
import GET_USER_POSTS_QUERY from '../graphql/queries/getPosts';
import { store } from '../utils/store';
import Loading from '../component/Loading';
import { BOTTOM_TAB_HEIGHT } from '../utils/constants'

const { height, width } = Dimensions.get('window');

const UserVideoScreen = (props) => {
  const param = props.route.params;
  const { postId } = param;
  const { state: { me } } = useContext(store);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_USER_POSTS_QUERY,
    {
        variables: { userId: param.userId }
    }
  );

  const flatlistRef = useRef();

  useEffect(() => {
    if (data && postId) {
      const index = data.getPosts.posts.findIndex(post => post.postInfo.id === postId);
      if (index !== -1) {
        flatlistRef.current.scrollToIndex({ index, animated: true });
      }
    }
  }, [data, postId]);

  function loadMore() {
    fetchMore({
      variables: {
        cursor: data.getPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        // Update logic here
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
    if (viewableItems.length > 0) {
      setCurrentlyPlaying(viewableItems[0].index);
      setIsPaused(false);
    }
  }, []);


  const renderItem = useCallback(({ item, index }) => (
    <FeedCard
      postInfo={item.postInfo}
      relation={item.relation}
      sponsor={item.sponsor}
      index={index}
      paused={index !== currentlyPlaying || isPaused}
      onPress={togglePause}
      navigation={props.navigation}
    />
  ), [currentlyPlaying, isPaused, togglePause, props.navigation]);

  if (loading) return <Loading />;
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>;
  console.log("----------UserVideoScreen----------")
  console.log(data.getPosts)

  return (
    <View style={styles.Root}>
      <FlatList
        horizontal={true}
        data={data.getPosts.posts}
        renderItem={renderItem}
        keyExtractor={item => item.postInfo.id}
        onEndReached={data.getPosts.pageInfo.hasNextPage ? loadMore : null}
        removeClippedSubviews={true}
        refreshing={networkStatus === 4}
        onRefresh={refetch}
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
});

export default UserVideoScreen;
