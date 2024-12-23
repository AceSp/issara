import React,
{
  useEffect,
  useState,
  useContext,
  useCallback,
  useLayoutEffect
} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
} from 'react-native';
import { useLazyQuery } from '@apollo/client';
import { materialTall } from 'react-native-typography';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_POSTS_QUERY from '../../graphql/queries/getPosts';
// import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import {
  store,
} from '../../utils/store';
import Loading from '../../component/Loading';
import PromoteCard from '../../component/FeedCard/PromoteCard';
import { iOSColors } from 'react-native-typography';
import SearchHeader from './SearchHeader';

const SearchScreen = (props) => {
  const { state: { me } } = useContext(store);

  const [searchText, setSearchText] = useState('');

  const [
    getPosts, 
    { 
      loading, 
      error, 
      data, 
      fetchMore, 
      refetch, 
      networkStatus 
    }
  ] = useLazyQuery(GET_POSTS_QUERY);

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

  function search() {
    getPosts({
      variables: {
        searchTerm: searchText,
      }
    })
  }

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

  const _renderSectionHeader = useCallback(
    ({ section }) => <PromoteCard
      {...section.promote}
      navigation={props.navigation}
    />
  )


  const renderBody = () => {
    if (loading) return <Loading />
    if (error) return <View style={styles.body}><Text style={styles.displayText}>`Error! ${error.message}`</Text></View>
    if(!data) return <View style={styles.body}></View>
    if(data.getPosts.sections.length === 0) return <View style={styles.body}><Text style={styles.displayText}>ไม่พบผลการค้นหา</Text></View>
    return (
      <SectionList
        contentContainerStyle={{ alignSelf: 'stretch' }}
        sections={data.getPosts.sections}
        renderItem={_renderItem}
        renderSectionFooter={_renderSectionHeader}
        keyExtractor={item => item.postInfo.id}
        onEndReached={data.getPosts.pageInfo.hasNextPage? loadMore() : null}
        removeClippedSubviews={true}
        refreshing={networkStatus === 4}
        onRefresh={refetch}
      />
    )
  }

  return (
    <View style={styles.Root}>
      <SearchHeader 
        searchText={searchText}
        setSearchText={setSearchText}
        search={search}
        goBack={props.navigation.goBack}
      />
      {renderBody()}
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayText: {
  },
  Root: {
    flex: 1,
    backgroundColor: iOSColors.lightGray,
    justifyContent: 'center',
  },
})

export default SearchScreen;