import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import {
  Button
} from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client';
// import BackgroundUpload from 'react-native-background-upload';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_NEWS_POSTS_QUERY from '../../graphql/queries/getNewsPosts';
import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import CREATE_POST_MUTATION from '../../graphql/mutations/createPost';
import Loading from '../../component/Loading';
import {
  getShowNewsData,
  getNewsCategoryData,
  store
} from '../../utils/store';
import NewFeedHeader from './Component/NewFeedHeader';
import NewsFeedTopTab from './Component/NewsFeedTopTab';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const NewsFeedScreen = (props) => {
  const { state: { me } } = useContext(store);

  const [showNewPost, setShowNewPost] = useState(false);
  const [category, setCategory] = useState([]);

  const [uploadProgress, setUploadProgress] = useState(-1);

  const postParam = props.route.params;

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_NEWS_POSTS_QUERY,
    {
      variables: {
        getNewPosts: showNewPost,
        categoryArr: category
      }
    }
  );

  const [viewPost, { data: view_data, loading: view_loading }] = useMutation(VIEW_POST_MUTATION);
  const [createPost, { createpost_data }] = useMutation(CREATE_POST_MUTATION);

  async function getShow() {
    const showData = getShowNewsData();
    if (showData) setShowNewPost(showData);
  }

  async function getCate() {
    const categoryData = JSON.parse(await getNewsCategoryData());
    if (categoryData) setCategory(categoryData);
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

  // useEffect(() => {
  //   console.log('start')
  //   if (postParam?.uploadIdArr) {

  //     if (postParam?.uploadIdArr.length === 0) {
  //       post(postParam?.postText);
  //     }

  //     let progresses = [];
  //     let uploadFinished = 0;
  //     for (let [index, uploadId] of postParam?.uploadIdArr.entries()) {
  //       progresses.push(0);
  //       BackgroundUpload.addListener('progress', uploadId, (data) => {
  //         // console.log(`Progress: ${data.progress}%`)
  //         progresses[index] = data.progress;
  //         setUploadProgress(Math.min(...progresses));
  //       })
  //       BackgroundUpload.addListener('error', uploadId, (data) => {
  //         console.log(`Error: ${data.error}%`)
  //       })
  //       BackgroundUpload.addListener('cancelled', uploadId, (data) => {
  //         console.log(`Cancelled!`)
  //       })
  //       BackgroundUpload.addListener('completed', uploadId, (data) => {
  //         // data includes responseCode: number and responseBody: Object
  //         uploadFinished++;
  //         if (uploadFinished === postParam?.uploadIdArr.length) {
  //           post(postParam?.postText);
  //           setUploadProgress(-1);
  //         }
  //         console.log('Completed!');
  //       });
  //     }
  //   }
  // }, [postParam]);

  useEffect(() => {

    getShow();
    getCate();

    /* props.navigation.setParams({animatedValue: _animatedValue.interpolate({
        inputRange: [0, 80],
        outputRange: [0, -80],
        extrapolate: 'clamp'
      })
    });*/
  }, []);

  useEffect(() => {
    if (!flatlistRef?.current?.scrollToOffset) return;
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
    });

    return unsubscribe;
  }, [props.navigation]);

  function post(text) {
    createPost({
      variables: {
        text: text,
        category: postParam?.postCategory,
        mediaName: postParam?.mediaName
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createPost: {
          __typename: 'Post',
          relation: {
            __typename: 'Relation',
            id: Math.round(Math.random() * -1000000).toString(),
            isLiked: false,
            isCoined: null,
            isViewed: null,
            isSaved: null,
            userCoinCount: null
          },
          postInfo: {
            __typename: 'PostInfo',
            id: Math.round(Math.random() * -1000000).toString(),
            text: text,
            title: null,
            likeCount: 0,
            coinCount: 0,
            commentCount: 0,
            createdAt: new Date(),
            category: null,
            author: {
              __typename: 'User',
              id: Math.round(Math.random() * -1000000).toString(),
              itemName: me.itemName,
              avatar: me.avatar,
              meFollowed: false,
            }
          },
          sponsor: {},
        }
      },
      update: (store, { data: { createPost } }) => {
        const storedData = store.readQuery({
          query: GET_NEWS_POSTS_QUERY,
          variables: {
            getNewPosts: showNewPost,
            categoryArr: category,
          }
        });

        const data = JSON.parse(JSON.stringify(storedData));
        if (!data.getNewsPosts.posts) {
          store.writeQuery({
            query: GET_NEWS_POSTS_QUERY,
            variables: {
              getNewPosts: showNewPost,
              categoryArr: category,
            },
            data: {
              getNewsPosts: {
                __typename: 'GetPosts',
                pageInfo: { ...data.getNewsPosts.pageInfo },
                posts: [
                  {
                    __typename: 'Post',
                    postInfo: { ...createPost.postInfo },
                    relation: { ...createPost.userRelation }
                  },
                ]

              }
            }
          });
        }

        if (!data.getNewsPosts.posts
          .find(p => {
            return p.postInfo.id === createPost.postInfo.id
          })) {
          store.writeQuery({
            query: GET_NEWS_POSTS_QUERY,
            variables: {
              getNewPosts: showNewPost,
              categoryArr: category,
            },
            data: {
              getNewsPosts: {
                __typename: 'GetPosts',
                pageInfo: { ...data.getNewsPosts.pageInfo },
                posts: [
                  {
                    __typename: 'Post',
                    postInfo: { ...createPost.postInfo },
                    relation: { ...createPost.relation }
                  },
                  ...data.getNewsPosts.posts
                ]

              }
            }
          });
        }
      }
    })
  }

  function loadMore() {
    fetchMore({
      variables: {
        cursor: data.getNewsPosts.pageInfo.endCursor,
        getNewPosts: showNewPost,
        //categoryArr: category
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

  function reload() {
    for (const p of data.getNewsPosts.posts) {
      viewPost({ variables: { id: p.postInfo.id } });
    }
    if (!view_loading) {
      refetch();
    }
  }

  function getKey(item) {
    return item.postInfo.id.toString()
      + new Date().getTime().toString()
      + (Math.floor(Math.random()
        * Math.floor(new Date()
          .getTime())))
        .toString();
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) => <FeedCard
    {...item}
    navigation={props.navigation}
    userHaveCoin={me.userHaveCoin}
    myId={me.id}
  />
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#f2f2f2',
      justifyContent: 'center'
    }}>
      <FlatList
        ListHeaderComponent={
          <View>
            <NewsFeedTopTab navigation={props.navigation} />
            <NewFeedHeader
              avatar={me.avatar}
              navigation={props.navigation}
              uploadProgress={uploadProgress}
              screen="News"
            />
            <Button
              onPress={() => props.navigation.navigate('NewsCategory',
                {
                  setShowNewfeed: setShowNewPost,
                  showNew: showNewPost,
                  setCate: setCategory,
                  categ: category
                }
              )}
              mode="contained"
            >
              เลือกหมวดหมู่ที่คุณสนใจ
            </Button>
          </View>
        }
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={data.getNewsPosts.posts}
        keyExtractor={item => getKey(item)}
        renderItem={_renderItem}
        onEndReachedThreshold={0.9}
        onEndReached={loadMore()}
        removeClippedSubviews={true}
        refreshing={networkStatus === 4}
        onRefresh={() => reload()}
        ref={flatlistRef}
      //onScrollEndDrag={(e) => checkScroll(e)}
      //onScroll={ Animated.event([{nativeEvent: {contentOffset: {y: _animatedValue}}}]) }
      />
    </View>


  )
}

export default NewsFeedScreen;