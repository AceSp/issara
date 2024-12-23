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

import FeedCard from '../component/FeedCard/FeedCard';
import GET_POSTS_QUERY from '../graphql/queries/getPosts';
import CREATE_POST_MUTATION from '../graphql/mutations/createPost';
import {
  store,
  getShowQuestion
} from '../utils/store';
import NewFeedHeader from './FeedTab/Component/NewFeedHeader';
import Loading from '../component/Loading';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const TestScreen = (props) => {
  const { state: { me } } = useContext(store);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_POSTS_QUERY);
  const _renderItem = useCallback(
    ({ item, index }) => <FeedCard
      {...item}
      index={index}
      navigation={props.navigation}
      me={me}
    />, []
  )

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Test Screen</Text>
//       </View>
//   )

  return (
    <View style={styles.Root}>
      <SectionList
        contentContainerStyle={{ alignSelf: 'stretch' }}
        sections={data.getPosts.sections}
        renderItem={_renderItem}
        keyExtractor={item => item.postInfo.id}
        onEndReached={null}
        removeClippedSubviews={true}
        refreshing={networkStatus === 4}
        onRefresh={refetch}
      />
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




export default TestScreen;