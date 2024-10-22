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
  const [currentToggleValue, setCurrentToggleValue] = useState('left');

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
  } = useQuery(GET_POST_QUERY);
  const { 
    loading: liked_loading, 
    error: liked_error, 
    data: liked_data, 
    fetchMore: liked_fetchMore, 
    refetch: liked_refetch, 
    networkStatus: liked_networkStatus 
  } = useQuery(GET_LIKED_POST_QUERY);
  const { 
    loading: saved_loading, 
    error: saved_error, 
    data: saved_data, 
    fetchMore: saved_fetchMore, 
    refetch: saved_refetch, 
    networkStatus: saved_networkStatus 
  } = useQuery(GET_SAVED_POST_QUERY);

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
      case 'left':
        return data.getUserPosts.posts;
      case 'center':
        return saved_data.getSavedPosts.posts;
      case 'right':
        return liked_data.getLikedPosts.posts;
      default:
        return [];
    }
  };

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
            onEndReached={() => data.getUserPosts.pageInfo.hasNextPage ? loadMore() : null}     
            // onEndReached={null}     
            removeClippedSubviews={true}
            refreshing={networkStatus === 4}
            onRefresh={() => refetch()}
        />
    </View>
  )
}

