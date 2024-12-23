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
import GET_POST_QUERY from '../../graphql/queries/getUserPosts';
import GET_LIKED_POST_QUERY from '../../graphql/queries/getLikedPosts';
import GET_SAVED_POST_QUERY from '../../graphql/queries/getSavedPosts';
import VideoPreviewItem from './Component/VideoPreviewItem';
import { useQuery } from '@apollo/client';
import Loading from '../../component/Loading';
import { store } from '../../utils/store';

export default function UserProfileScreen(props) {

  const param = props.route.params;

  const { state: { me } } = useContext(store);

  const [uploadProgress, setUploadProgress] = useState(-1);
  const [currentToggleValue, setCurrentToggleValue] = useState(0);

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

  const { 
    loading, 
    error, 
    data, 
    fetchMore, 
    refetch, 
    networkStatus 
  } = useQuery(GET_POST_QUERY, {
    variables: { limit: 27 }
  });
  const { 
    loading: liked_loading, 
    error: liked_error, 
    data: liked_data, 
    fetchMore: liked_fetchMore, 
    refetch: liked_refetch, 
    networkStatus: liked_networkStatus 
  } = useQuery(GET_LIKED_POST_QUERY, {
    variables: { limit: 27 }
  });
  const { 
    loading: saved_loading, 
    error: saved_error, 
    data: saved_data, 
    fetchMore: saved_fetchMore, 
    refetch: saved_refetch, 
    networkStatus: saved_networkStatus 
  } = useQuery(GET_SAVED_POST_QUERY, {
    variables: { limit: 27 }
  });

  useEffect(() => {
    if(!param.userId)
        props.navigation.setParams({
            userId: me.id,
        });
  }, [param.userId]);

  const onToggleChange = (value) => {
    setCurrentToggleValue(value);
  };

  const getCurrentData = () => {
    switch (currentToggleValue) {
      case 0:
        return data.getUserPosts.posts;
      case 1:
        return saved_data.getSavedPosts.posts;
      case 2:
        return liked_data.getLikedPosts.posts;
      default:
        return [];
    }
  };


  function loadMoreUserPosts() {
    fetchMore({
      variables: {
        cursor: data.getUserPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.getUserPosts.posts;
        const pageInfo = fetchMoreResult.getUserPosts.pageInfo;
        return newPosts.length
            ? {
                getUserPosts: {
                    __typename: previousResult.getUserPosts.__typename,
                    posts: [...previousResult.getUserPosts.posts, ...newPosts],
                    pageInfo,
                }
            }
            : previousResult;
      }
    });
  }

  function loadMoreSavedPosts() {
    saved_fetchMore({
      variables: {
        cursor: saved_data.getSavedPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.getSavedPosts.posts;
        const pageInfo = fetchMoreResult.getSavedPosts.pageInfo;
        return newPosts.length
            ? {
                getSavedPosts: {
                    __typename: previousResult.getSavedPosts.__typename,
                    posts: [...previousResult.getSavedPosts.posts, ...newPosts],
                    pageInfo,
                }
            }
            : previousResult;
      }
    });
  }

  function loadMoreLikedPosts() {
    liked_fetchMore({
      variables: {
        cursor: liked_data.getLikedPosts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newPosts = fetchMoreResult.getLikedPosts.posts;
        const pageInfo = fetchMoreResult.getLikedPosts.pageInfo;
        return newPosts.length
            ? {
                getLikedPosts: {
                    __typename: previousResult.getLikedPosts.__typename,
                    posts: [...previousResult.getLikedPosts.posts, ...newPosts],
                    pageInfo,
                }
            }
            : previousResult;
      }
    });
  }

  const _renderItem = ({ item, index }) => <VideoPreviewItem
    index={index}
    item={item}
    navigation={props.navigation} />

  if (loading || user_loading || liked_loading || saved_loading) return (
      <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}>
          <Loading />
      </View>
  )
  if (error || user_error || liked_error || saved_error) return <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}><Text>`Error! ${error?.message || user_error?.message || liked_error?.message || saved_error?.message}`</Text></View>
  if (!loading && !user_loading && !data.getUserPosts.posts) {
      return (
          <ScrollView>
              <UserHeader
                  userData={user_data.getUser}
                  navigation={props.navigation}
                  me_following={me.following}
                  currentToggleValue={currentToggleValue}
                  onToggleChange={onToggleChange}
              />
              <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                  <Text>ยังไม่มีโพสต์</Text>
              </View>
          </ScrollView>

      )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f1f6f8' }} >
        <FlatList
            ListHeaderComponent={
              <UserHeader
                  userData={user_data.getUser}
                  navigation={props.navigation}
                  currentToggleValue={currentToggleValue}
                  onToggleChange={onToggleChange}
              />}
            contentContainerStyle={{ alignSelf: 'stretch' }}
            data={getCurrentData()}
            keyExtractor={item => item.postInfo.id}
            renderItem={_renderItem}
            numColumns={3}
            onEndReachedThreshold={0.9}
            onEndReached={() => {
              if (currentToggleValue === 0 && data.getUserPosts.pageInfo.hasNextPage) 
                loadMoreUserPosts()
              else if (currentToggleValue === 1 && saved_data.getSavedPosts.pageInfo.hasNextPage) 
                loadMoreSavedPosts()
              else if (currentToggleValue === 2 && liked_data.getLikedPosts.pageInfo.hasNextPage) 
                loadMoreLikedPosts()
            }}
            // onEndReached={null}     
            removeClippedSubviews={true}
            refreshing={networkStatus === 4}
            onRefresh={() => {
              switch(currentToggleValue) {
                case 0:
                  refetch()
                  break;
                case 1:
                  saved_refetch()
                  break;
                case 2:
                  liked_refetch()
                  break;
              }
            }}
        />
    </View>
  )
}

