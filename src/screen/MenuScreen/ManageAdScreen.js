
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import {
  Icon,
  Avatar,
  Overlay
} from 'react-native-elements';
import {
  List, 
  Card, 
  TouchableRipple,
  Divider
} from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client';
import { materialTall, iOSColors } from 'react-native-typography';

import GET_MY_ADS_QUERY from '../../graphql/queries/getMyAds';
import Sponsor from '../../component/FeedCard/Sponsor';
import FeedCard from '../../component/FeedCard/FeedCard';
import Loading from '../../component/Loading';
import AdCard from '../../component/AdCard';

const ManageAdScreen = (props) => {

  const { loading, error, data, refetch, networkStatus } = useQuery(GET_MY_ADS_QUERY);

  const _renderItem = ({ item }) => <AdCard {...item} navigation={props.navigation} />

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const res = [];
  for(item of data.getMyAds) res.push(item.id);

  return (
      <View style={styles.Root}>
          <FlatList
            contentContainerStyle={{ alignSelf: 'stretch' }}
            data={data.getMyAds}
            keyExtractor={item => item.id}
            renderItem={_renderItem}
            removeClippedSubviews={true}
            refreshing={networkStatus === 4}
            onRefresh={() => refetch()}
          />
      </View>
  )
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: iOSColors.lightGray,
    justifyContent: 'center'
  },
  adView: {
    alignItems: "flex-start", 
    padding: 5,
    paddingLeft: 20,
    backgroundColor: 'white'
  },
  menuRow: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center'
  },
  icon: {
    backgroundColor: iOSColors.lightGray,
    borderRadius: 20,
    padding: 5,
    marginRight: 15
  },
  optionCard: {
    marginVertical: 10,
    padding: 5,
    backgroundColor: iOSColors.orange
  }
})

export default ManageAdScreen;