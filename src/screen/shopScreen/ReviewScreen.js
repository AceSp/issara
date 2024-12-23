import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Animated,
  LayoutAnimation
} from 'react-native';
import {
  FAB,
  Provider,
  Portal
} from 'react-native-paper';
import {
  Icon
} from 'react-native-elements';
import { useQuery, useMutation } from '@apollo/client';

import GET_REVIEWS_QUERY from '../../graphql/queries/getReviews';
import Loading from '../../component/Loading';
import ReviewCard from './component/ReviewCard';

const ReviewScreen = (props) => {

  const { shopId } = props.route.params;

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_REVIEWS_QUERY,
    {
      variables: {
          shopId: shopId
      }
    }
    );
 
  function loadMore() {
      fetchMore({
        variables: { 
          cursor: data.getReviews.pageInfo.endCursor
          //categoryArr: category
         },
         updateQuery: (previousResult, { fetchMoreResult }) => {
          const newReviews = fetchMoreResult.getReviews.reviews;
          const pageInfo = fetchMoreResult.getReviews.pageInfo;

          return newReviews.length
            ? {
                getReviews: {
                  __typename: previousResult.getReviews.__typename,
                  reviews: [...previousResult.getReviews.reviews, ...newReviews],
                  pageInfo
                }
              }
            : previousResult;
        }
      });  
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) =>  <ReviewCard {...item} navigation={props.navigation} />

  return (
    <View style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
        //backgroundColor: 'white'
    }}>
        <FlatList
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={data.getReviews.reviews}
             keyExtractor={item => item.Id}
             renderItem={_renderItem}
             onEndReachedThreshold={0.9}
             onEndReached={() =>data.getReviews.pageInfo.hasNextPage? loadMore() : null}
             removeClippedSubviews={true}
        />
    </View>
    
        
  )
}

export default ReviewScreen;
