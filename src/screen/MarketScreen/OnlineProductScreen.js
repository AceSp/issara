import React from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import { useQuery } from '@apollo/client';

import GET_USER_PRODUCTS_QUERY from '../../graphql/queries/getUserProducts';
import Loading from '../../component/Loading';
import ProductCard from './Component/ProductCard';

const OnlineProductScreen = (props) => {

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_USER_PRODUCTS_QUERY);

  function loadMore() {
      fetchMore({
        variables: { 
          cursor: data.getUserProducts.pageInfo.endCursor
          //categoryArr: category
         },
         updateQuery: (previousResult, { fetchMoreResult }) => {
          const newProducts = fetchMoreResult.getUserProducts.products;
          const pageInfo = fetchMoreResult.getUserProducts.pageInfo;

          return newProducts.length
            ? {
                // Put the new.products at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                getUserProducts: {
                  __typename: previousResult.getUserProducts.__typename,
                  products: [...previousResult.getUserProducts.products, ...newProducts],
                  pageInfo
                }
              }
            : previousResult;
        }
      });  
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) =>  <ProductCard {...item} navigation={props.navigation} />

  return (
    <View style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
        //backgroundColor: 'white'
    }}>
        <FlatList
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={data.getUserProducts.products}
             keyExtractor={item => item.id}
             getItemLayout={(data, index) => (
              {length: 200, offset: 200 * index, index}
            )}
             renderItem={_renderItem}
             onEndReachedThreshold={0.9}
             onEndReached={() =>data.getUserProducts.pageInfo.hasNextPage? loadMore() : null}
             removeClippedSubviews={true}
             refreshing={networkStatus === 4}
             onRefresh={() => refetch()}
        />
    </View>
    
        
  )
}

export default OnlineProductScreen;