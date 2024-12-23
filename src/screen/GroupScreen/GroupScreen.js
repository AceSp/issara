import React, { 
  useEffect, 
  useRef,
  useContext
} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet
} from 'react-native';

import { useQuery, useMutation } from '@apollo/client';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_FOLLOWING_POST_QUERY from '../../graphql/queries/getFollowingPosts';
import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import Loading from '../../component/Loading';
import { getShowPostData, getPostCategoryData } from '../../utils/store';
import GroupBox from './Component/GroupBox';
import { store } from '../../utils/store';

const GroupScreen = (props) => {
  const { state: { me } } = useContext(store);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_FOLLOWING_POST_QUERY, {
    variables: {
      following: me.followingUser
    }
  });

  const flatlistRef = useRef();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
    });

    return unsubscribe;
  }, [props.navigation]);

  function loadMore() {
    fetchMore({
      variables: {
        following: me.followingUser,
        cursor: data.getFollowingPosts.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return fetchMoreResult.getPosts.sections.length
          ? {
            // Put the new.posts at the end of the list and update `pageInfo`
            // so we have the new `endCursor` and `hasNextPage` values
            getPosts: {
              __typename: previousResult.getFollowingPosts.__typename,
              // posts: [...previousResult.getPosts.posts, ...newPosts],
              pageInfo: fetchMoreResult.getFollowingPosts.pageInfo,
              sections: previousResult.getFollowingPosts.sections.concat(fetchMoreResult.getFollowingPosts.sections)
            }
          }
          : previousResult;
      }
    });
  }

  if (loading) return <Loading />
  if (error) return <View styles={styles.Root}>
      <Text>`Error! ${error.message}`</Text>
    </View>

  const _renderItem = ({ item }) => <FeedCard {...item} navigation={props.navigation} userHaveCoin={me.userHaveCoin} />
  return (
    <View style={styles.Root}>
        <SectionList
          ListHeaderComponent={
            <GroupBox
              avatar={me.avatar}
              navigation={props.navigation}
              iconName="cast-connected"
              titleText="การติดตาม"
              following={me.followingUser}
            />
          }
          contentContainerStyle={{ alignSelf: 'stretch' }}
          sections={data.getFollowingPosts.sections}
          renderItem={_renderItem}
          keyExtractor={item => item.postInfo.id}
          onEndReachedThreshold={0.5}
          onEndReached={data.getFollowingPosts.pageInfo.hasNextPage? loadMore() : null}
          removeClippedSubviews={true}
          refreshing={networkStatus === 4}
          onRefresh={refetch}
          ref={flatlistRef}
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

export default GroupScreen;