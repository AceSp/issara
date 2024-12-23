import React,
{
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SectionList
} from 'react-native';
import { useQuery, useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';
// import BackgroundUpload from 'react-native-background-upload';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_POSTS_QUERY from '../../graphql/queries/getPosts';
// import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import CREATE_POST_MUTATION from '../../graphql/mutations/createPost';
import {
  store,
  getShowQuestion
} from '../../utils/store';
import NewFeedHeader from './Component/NewFeedHeader';
import NewFeedTopTab from './Component/NewFeedTopTab';
import { Button } from 'react-native-paper';
import Loading from '../../component/Loading';
import PlaceholderFeed from '../../component/FeedCard/PlaceholderFeed';
import PromoteCard from '../../component/FeedCard/PromoteCard';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const NewFeedScreen = (props) => {
  const { state: { me } } = useContext(store);

  const postParam = props.route.params;

  const [posts, setPosts] = useState([]);
  const [testData, setTestData] = useState({});

  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadError, setUploadError] = useState(false);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_POSTS_QUERY);

  // const [viewPost, { data: view_data, loading: view_loading }] = useMutation(VIEW_POST_MUTATION);
  const [createPost, { createpost_data }] = useMutation(CREATE_POST_MUTATION);

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
  //   setTestData(data);
  //   if(!data) return;
  //   if(data.getPosts.posts.length === 1) {
  //     return setPosts(data.getPosts.posts.concat(posts));
  //   }
  //   const newPosts = data.getPosts.promote 
  //     ? data.getPosts.posts.concat(data.getPosts.promote) 
  //     : data.getPosts.posts

  //   setPosts(posts.concat(newPosts))
  // }, [data?.getPosts.posts[0].postInfo.id])

  useEffect(() => {
    const checkFirstTime = async () => {
      const show = getShowQuestion();
      if(show) props.navigation.navigate('Question');
    }
    checkFirstTime();
  }, []);

  useEffect(() => {
    if (!flatlistRef?.current?.scrollToOffset) return;
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
    });
    return unsubscribe;
  }, [props.navigation]);

  // useEffect(() => {
  //   if (postParam?.uploadIdArr) {
  //     if (postParam?.uploadIdArr.length === 0) {
  //       post(postParam?.postText);
  //     }
  //     let progresses = [];
  //     let uploadFinished = 0;
  //     for (let [index, uploadId] of postParam?.uploadIdArr.entries()) {
  //       progresses.push(0);
  //       BackgroundUpload.addListener('progress', uploadId, (data) => {
  //         progresses[index] = data.progress;
  //         setUploadProgress(Math.min(...progresses));
  //       });
  //       BackgroundUpload.addListener('error', uploadId, (data) => {
  //         setUploadError(true);
  //         console.log(`Error: ${data.error}%`);
  //       });
  //       BackgroundUpload.addListener('cancelled', uploadId, (data) => {
  //         console.log(`Cancelled!`);
  //       });
  //       BackgroundUpload.addListener('completed', uploadId, (data) => {
  //         // data includes responseCode: number and responseBody: Object
  //         uploadFinished++;
  //         if (uploadFinished === postParam?.uploadIdArr.length) {
  //           console.log("--------NewfeedScreen")
  //           console.log(postParam)
  //           post({
  //             text: postParam?.postText,
  //             title: postParam?.postTitle,
  //             tag: postParam?.tag
  //           });
  //           setUploadProgress(-1);
  //         }
  //         console.log('Completed!');
  //       });
  //     }
  //   }
  // }, [postParam]);

  function loadMore() {
    fetchMore({
      variables: {
        cursor: data.getPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return fetchMoreResult.getPosts.sections.length
          ? {
            // Put the new.posts at the end of the list and update `pageInfo`
            // so we have the new `endCursor` and `hasNextPage` values
            getPosts: {
              __typename: previousResult.getPosts.__typename,
              // posts: [...previousResult.getPosts.posts, ...newPosts],
              pageInfo: fetchMoreResult.getPosts.pageInfo,
              sections: previousResult.getPosts.sections.concat(fetchMoreResult.getPosts.sections)
            }
          }
          : previousResult;
      }
    });
  }

  function post({
      text,
      title,
      tag,
      uploadIdArr
  }) {
      createPost({
          variables: {
              text,
              title,
              tag: [tag]
          },
          update: (store, { data: { createPost } }) => {
            const storedData = store.readQuery({
                query: GET_POSTS_QUERY
            });

            const data = JSON.parse(JSON.stringify(storedData));
            if (!data.getPosts.sections.find(
              item => item.data.find(p => p.postInfo.id === createPost.postInfo.id))) {
                data.getPosts.sections[0].data.unshift(createPost);
                store.writeQuery({
                    query: GET_POSTS_QUERY,
                    data: {
                      getPosts: {
                        __typename: 'GetPosts',
                        pageInfo: data.getPosts.pageInfo,
                        sections: data.getPosts.sections,
                      }
                    }
                })
            }
          }
      })
  };

  const _getKey = (item) => {
    if(item?.postInfo) return item.postInfo.id;
    return item?.id + Date.now();
  }

  const _renderItem = useCallback(
    ({ item, index }) => <FeedCard
      {...item}
      index={index}
      navigation={props.navigation}
      me={me}
    />, []
  )

  // const _renderSectionHeader = useCallback(
  //   ({ section }) => <PromoteCard
  //     {...section.promote}
  //     navigation={props.navigation}
  //   />
  // )
  const _renderSectionHeader = useCallback(
    ({ section }) => <Text>Promote</Text>
  )

  // if (loading) return <PlaceholderFeed />
  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  return (
    <View style={styles.Root}>
      <SectionList
        ListHeaderComponent={
          <View>
            <NewFeedHeader
              avatar={me?.avatar}
              navigation={props.navigation}
              uploadProgress={uploadProgress}
              uploadError={uploadError}
              setUploadError={setUploadError}
              setUploadProgress={setUploadProgress}
              screen="NewFeed"
            />
          </View>
        }
        contentContainerStyle={{ alignSelf: 'stretch' }}
        sections={data.getPosts.sections}
        renderItem={_renderItem}
        renderSectionFooter={_renderSectionHeader}
        keyExtractor={item => item.postInfo.id}
        onEndReached={data.getPosts.pageInfo.hasNextPage? loadMore() : null}
        removeClippedSubviews={true}
        refreshing={networkStatus === 4}
        onRefresh={refetch}
        // horizontal
        // pagingEnabled
        ref={flatlistRef}
      />
      {/* <FlatList
        ListHeaderComponent={
          <View>
            <NewFeedHeader
              avatar={me?.avatar}
              navigation={props.navigation}
              uploadProgress={uploadProgress}
              screen="NewFeed"
            />
          </View>
        }
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={data.getPosts.sections[0].data}
        renderItem={_renderItem}
        keyExtractor={item => _getKey(item)}
        // onEndReachedThreshold={0.5}
        // onEndReached={data.getPosts.pageInfo.hasNextPage? loadMore() : null}
        removeClippedSubviews={true}
        refreshing={networkStatus === 4}
        onRefresh={refetch}
        ref={flatlistRef}
      //onScrollEndDrag={(e) => checkScroll(e)}
      //onScroll={ Animated.event([{nativeEvent: {contentOffset: {y: _animatedValue}}}]) }
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: iOSColors.lightGray,
    justifyContent: 'center'
  }
})

export default NewFeedScreen;