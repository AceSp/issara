import React, { 
  useEffect, 
  useRef,
  useContext
} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Animated
} from 'react-native';
import {
  Icon
} from 'react-native-elements';

import { useQuery } from '@apollo/client';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_GROUP_POSTS_QUERY from '../../graphql/queries/getGroupPosts';
import GET_GROUP_QUERY from '../../graphql/queries/getGroup';
import Loading from '../../component/Loading';
import ME_SUBSCRIPTION from '../../graphql/subscriptions/me';
import ME_QUERY from '../../graphql/queries/me';
import GroupHeader from './Component/GroupHeader';
import { store } from '../../utils/store';

const GroupRoomScreen = (props) => {
  const { state: { me } } = useContext(store);

  const { group } = props.route.params;

  const { 
    loading: group_loading, 
    error: group_error, 
    data: group_data 
  } = useQuery(
    GET_GROUP_QUERY,
    {
      variables: { _id: group._id }
    }
    );

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_GROUP_POSTS_QUERY,
    {
      variables: { group: group._id }
    }
    );

  const flatlistRef = useRef();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
    });

    return unsubscribe;
  }, [props.navigation]);

  function loadMore() {

    if(noMoreData) {
      return loadAgain();
    }

      fetchMore({
        variables: {cursor: data.getPosts.pageInfo.endCursor},
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

  if (loading || group_loading) return <Loading />
  if(!data.getGroupPosts) return(
    <View style={styles.Root}>
      <GroupHeader 
      avatar={me.avatar}
      navigation={props.navigation}
      iconName="group"
      titleText="กลุ่ม"
      myId={me._id}
      group={group_data.getGroup}
      groupArr={me.group}
      />
    </View>
  )
  if (error) return <View style={styles.Root}>
      <Text>`Error! ${error.message}`</Text>
    </View>
  if (group_error) return <View style={styles.Root}>
        <Text>`Error! ${group_error.message}`</Text>
      </View>

  const _renderItem = ({ item }) => <FeedCard {...item} navigation={props.navigation} userHaveCoin={me.userHaveCoin} />
  return (
    <View style={styles.Root}>    
        <FlatList
             ListHeaderComponent={
              <GroupHeader
                avatar={me.avatar}
                navigation={props.navigation}
                iconName="group"
                titleText="กลุ่ม"
                myId={me._id}
                group={group_data.getGroup}
                groupArr={me.group}
              />
             }
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={data.getGroupPosts.posts}
             keyExtractor={item => item.postInfo._id}
             renderItem={_renderItem}
             onEndReachedThreshold={0.9}
             onEndReached={() => data.getGroupPosts.pageInfo.hasNextPage? loadMore() : null}
             removeClippedSubviews={true}
             refreshing={networkStatus === 4}
             onRefresh={() => refetch()}
             ref={flatlistRef}
             //onScrollEndDrag={(e) => checkScroll(e)}
             //onScroll={ Animated.event([{nativeEvent: {contentOffset: {y: _animatedValue}}}]) }
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

export default GroupRoomScreen;