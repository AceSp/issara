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

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_MY_SHOP_QUERY from '../../graphql/queries/getMyShop';
import Loading from '../../component/Loading';
import { getMeData, getShowPostData, getPostCategoryData } from '../../utils/store';
import ShopCard from './component/ShopCard';
import AuthorItem from '../../component/AuthorItem';

const MyShopScreen = (props) => {

  const {
    loading,
    error,
    data,
  } = useQuery(GET_MY_SHOP_QUERY);

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) => <AuthorItem {...item} navigation={props.navigation} />

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#f2f2f2',
      //backgroundColor: 'white'
    }}>
      <FlatList
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={data.getMyShop}
        keyExtractor={item => item.id}
        getItemLayout={(data, index) => (
          { length: 200, offset: 200 * index, index }
        )}
        renderItem={_renderItem}
        //  onEndReachedThreshold={0.9}
        //  onEndReached={() =>data.getMyShop.pageInfo.hasNextPage? loadMore() : null}
        removeClippedSubviews={true}
        // refreshing={networkStatus === 4}
        // onRefresh={() => refetch()}
      />
    </View>


  )
}

export default MyShopScreen;