import React, { 
    Component, 
    useContext, 
    useEffect,
    useState
} from 'react';
import {
    ScrollView,
    FlatList,
    View,
    Text
} from 'react-native';
import UserHeader from './Component/UserHeader';
// import BackgroundUpload from 'react-native-background-upload';

import GET_USER_QUERY from '../../graphql/queries/getUser';
import GET_POST_QUERY from '../../graphql/queries/getPosts';
import VideoPreviewItem from './Component/VideoPreviewItem';
import { useQuery } from '@apollo/client';
import Loading from '../../component/Loading';
import { store } from '../../utils/store';

export default function UserProfileScreen(props) {

  const param = props.route.params;

  const { state: { me } } = useContext(store);

  const [uploadProgress, setUploadProgress] = useState(-1);

  const {
      loading: user_loading,
      error: user_error,
      data: user_data
  } = useQuery(
      GET_USER_QUERY,
      {
          variables: { userId: param.userId }
      }
  );

  // const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
  //     GET_USER_POST_QUERY,
  //     {
  //         variables: { userId: param.userId }
  //     }
  // );
  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_POST_QUERY);

  // useEffect(() => {
  //     console.log('start')
  //     if (param?.uploadIdArr) {

  //         if (param?.uploadIdArr.length === 0) {
  //             post(param?.postText);
  //         }

  //         let progresses = [];
  //         let uploadFinished = 0;
  //         for (let [index, uploadId] of param?.uploadIdArr.entries()) {
  //             progresses.push(0);
  //             BackgroundUpload.addListener('progress', uploadId, (data) => {
  //                 // console.log(`Progress: ${data.progress}%`)
  //                 progresses[index] = data.progress;
  //                 setUploadProgress(Math.min(...progresses));
  //             })
  //             BackgroundUpload.addListener('error', uploadId, (data) => {
  //                 console.log(`Error: ${data.error}%`)
  //             })
  //             BackgroundUpload.addListener('cancelled', uploadId, (data) => {
  //                 console.log(`Cancelled!`)
  //             })
  //             BackgroundUpload.addListener('completed', uploadId, (data) => {
  //                 // data includes responseCode: number and responseBody: Object
  //                 uploadFinished++;
  //                 if (uploadFinished === param?.uploadIdArr.length) {
  //                     post(param?.postText);
  //                     setUploadProgress(-1);
  //                 }
  //                 console.log('Completed!');
  //             });
  //         }
  //     }
  // }, [param]);

  function loadMore() {
      fetchMore({
          variables: {
            id: param.userId,
            cursor: data.getPosts.pageInfo.endCursor
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
                          pageInfo
                      }
                  }
                  : previousResult;
          }
      });
  }

  const _renderItem = ({ item }) => <VideoPreviewItem
      item={item}
      navigation={props.navigation} />

  if (loading || user_loading) return (
      <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}>
          <Loading />
      </View>
  )
  if (error) return <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}><Text>`Error! ${error.message}`</Text></View>
  if (user_error) return <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}><Text>`Error! ${user_error.message}`</Text></View>
  if (!loading && !user_loading && !data.getPosts.posts) {
      return (
          <ScrollView>
              <UserHeader
                  userData={user_data.getUser}
                  navigation={props.navigation}
                  me_following={me.following}
              />
              <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                  <Text>ยังไม่มีโพสต์</Text>
              </View>
          </ScrollView>

      )
  }

  console.log("--------userProfileScreen------------")
  console.log(data.getPosts)
  return (
    <View style={{ flex: 1, backgroundColor: '#f1f6f8' }} >
        <FlatList
            ListHeaderComponent={
              <UserHeader
                  userData={user_data.getUser}
                  navigation={props.navigation}
              />}
            contentContainerStyle={{ alignSelf: 'stretch' }}
            data={data.getPosts.posts}
            keyExtractor={item => item.postInfo.id}
            renderItem={_renderItem}
            numColumns={3}
            onEndReachedThreshold={0.9}
            // onEndReached={() => data.getPosts.pageInfo.hasNextPage ? loadMore() : null}     
            onEndReached={null}     
            removeClippedSubviews={true}
            refreshing={networkStatus === 4}
            onRefresh={() => refetch()}
        />
    </View>
  )
}

