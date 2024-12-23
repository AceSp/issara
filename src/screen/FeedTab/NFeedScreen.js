import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  FlatList,
} from 'react-native';

import { useQuery, useMutation } from '@apollo/client';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_NEWS_POSTS_QUERY from '../../graphql/queries/getNewsPosts';
import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import Loading from '../../component/Loading';
import POST_STAT_SUBSCRIPTION from '../../graphql/subscriptions/postStat';
import GET_ME_QUERY from '../../graphql/queries/getMe';
import { getMeData } from '../../utils/store';
import PostBox from './Component/PostBox';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const NewsFeedScreen = (props) => {
  const { 
    loading: me_loading, 
    error: me_error, 
    data: me_data, 
    subscribeToMore: me_subScribeToMore 
  } = useQuery(GET_ME_QUERY);
  const { loading, error, data, fetchMore, refetch, networkStatus  } = useQuery(GET_NEWS_POSTS_QUERY);

  const [viewPost, {data: view_data, loading: view_loading}] = useMutation(VIEW_POST_MUTATION);

  const [ me, setMe ] = useState({});
  const [ noMoreData, setNoMoreData ] = useState(false);

  async function getMe() {
    const meData = JSON.parse(await getMeData());
    setMe(meData);
  }
/* ***********collapsible tab broken now fix later***********
  const { scrollUp, scrollDown } = React.useContext(ScrollContext);

  let prevOffset = 0

  function checkScroll(e) {
    
    const currentOffset = e.nativeEvent.contentOffset.y
    if((currentOffset - prevOffset) > 50 ) {
      scrollDown();
    } else if((currentOffset - prevOffset) < 100) {
      scrollUp();
    }
    console.log(currentOffset);
    prevOffset = currentOffset;
  }*/

  //const _animatedValue = new Animated.Value(0);

  const flatlistRef = useRef();

  useEffect(() => {

    getMe();

  /* props.navigation.setParams({animatedValue: _animatedValue.interpolate({
      inputRange: [0, 80],
      outputRange: [0, -80],
      extrapolate: 'clamp'
    })
  });*/

    me_subScribeToMore({
      document: POST_STAT_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              if(!subscriptionData.data) {
                return prev;
              }

              const newData = subscriptionData.data.postStat
    
              return Object.assign({}, prev, {
                me: {
                  ...newData
                }
              });
   
              }     
            
    })
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToIndex({ offset: 0 });
    });

    return unsubscribe;
  }, [props.navigation]);

  function loadMore() {

    if(noMoreData) {
      return loadAgain();
    }

    fetchMore({
      variables: { 
        cursor: data.getNewsPosts.pageInfo.endCursor
       },
       updateQuery: (previousResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.getNewsPosts.posts;
        const pageInfo = fetchMoreResult.getNewsPosts.pageInfo;
    
        return newPosts.length
          ? {
              // Put the new.posts at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              getNewsPosts: {
                __typename: previousResult.getNewsPosts.__typename,
                posts: [...previousResult.getNewsPosts.posts, ...newPosts],
                pageInfo
              }
            }
          : previousResult;
      }
    });  
}

  function loadAgain() {

    if(!noMoreData) {
      setNoMoreData(true);
      fetchMore({
        variables: { 
          cursor: null,
          restart: true
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.getNewsPosts.posts;
          const pageInfo = fetchMoreResult.getNewsPosts.pageInfo;
      
          return newPosts.length
            ? {
                // Put the new.posts at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                getNewsPosts: {
                  __typename: previousResult.getNewsPosts.__typename,
                  posts: [...previousResult.getNewsPosts.posts, ...newPosts],
                  pageInfo
                }
              }
            : previousResult;
        }
      }); 
    }

    fetchMore({
      variables: { 
        cursor: data.getNewsPosts.pageInfo.endCursor,
        restart: true
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.getNewsPosts.posts;
        const pageInfo = fetchMoreResult.getNewsPosts.pageInfo;
    
        return newPosts.length
          ? {
              // Put the new.posts at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              getNewsPosts: {
                __typename: previousResult.getNewsPosts.__typename,
                posts: [...previousResult.getNewsPosts.posts, ...newPosts],
                pageInfo
              }
            }
          : previousResult;
      }
    });  
  }

  function getKey(item) {
    if(!noMoreData) {
      return item.postInfo.id
    }
    return item.postInfo.id.toString() 
    + new Date().getTime().toString() 
    + (Math.floor(Math.random() 
    * Math.floor(new Date()
          .getTime())))
          .toString();  
  }

function reload() {
  for(const p of data.getNewsPosts.posts) {
    viewPost({variables: { id: p.postInfo.id }} );
  }
  if(!view_loading) {
    refetch();
  }
}

  if (loading) return <Loading />
  if (error) return <View style={styles.Root}>
        <Text>`Error! ${error.message}`</Text>
      </View>

  const _renderItem = ({ item }) => <FeedCard {...item} navigation={props.navigation} userHaveCoin={me_data.getMe.userHaveCoin} />
  return (
    <View style={styles.Root}>
        <FlatList
              ListHeaderComponent={
                <PostBox 
                  avatar={me.avatar}
                  navigation={props.navigation}
                  iconName="newspaper-o"
                  titleText="ข่าว"
                  iconType= "font-awesome"
                />
              }
              contentContainerStyle={{ alignSelf: 'stretch' }}
              data={data.getNewsPosts.posts}
              keyExtractor={(item) => getKey(item)}
              renderItem={_renderItem}
              onEndReachedThreshold={0.9}
              onEndReached={() => data.getNewsPosts.pageInfo.hasNextPage? loadMore() : loadAgain()}
              removeClippedSubviews={true}
              refreshing={networkStatus === 4}
              onRefresh={() => reload()}
              ref={flatlistRef}
              //onScrollEndDrag={(e) => checkScroll(e)}
              //onScroll={ Animated.event([{nativeEvent: {contentOffset: {y: _animatedValue}}}]) }
              scrollEventThrottle={16}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    Root: {
        display: 'flex',
        flex: 1,
        backgroundColor: "#f2f2f2",
        justifyContent: "center"
    },
})

export default NewsFeedScreen;