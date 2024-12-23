import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Animated
} from 'react-native';

import { useQuery } from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import Loading from '../../component/Loading';;
import GET_NOTIFICATION_QUERY from '../../graphql/queries/getNotifications';
import NOTIFICATION_SUBSCRIPTION from '../../graphql/subscriptions/notificationSub';
import NotificationItem from './notification/NotificationItem';
import { useApnBadge } from '../../utils/BadgeProvider';


const NotificationScreen = (props) => {

  const { badge } = useApnBadge();

  const { loading, error, data, subscribeToMore } = useQuery(GET_NOTIFICATION_QUERY);

  const flatlistRef = useRef();

  useEffect(() => {
    //if(data) {
    subscribeToMore({
      document: NOTIFICATION_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log("---------notificationSub-----------")
        console.log(subscriptionData);
        if (!subscriptionData.data) {
          return prev;
        }
        const newData = subscriptionData.data.notificationSub;
        console.log(subscriptionData)
        return { getNotification: [newData, ...prev.getNotification] };

      }
    })
    //}
  }, [subscribeToMore])

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
    });

    return unsubscribe;
  }, [props.navigation]);

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const noti = [
    {
      text: 'woradech phayaksiri ได้เชิญคุณเข้าร่วมกลุ่ม hsdfsdhfksfdhsfkashdfasf',
      createdAt: new Date(),
      unseen: true
    }
  ]

  const _renderItem = ({ item }) => <NotificationItem {...item} />

  return (
    <View style={styles.Root}>
      <FlatList
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={noti}
        // data={data.getNotification}
        keyExtractor={item => item.text}
        renderItem={_renderItem}
        removeClippedSubviews={true}
        ref={flatlistRef}
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

export default NotificationScreen;