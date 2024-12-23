import React, { useEffect } from 'react';
import PushNotification from 'react-native-push-notification';
import { useMutation } from '@apollo/client';

import UPDATE_ME_MUTAIION from '../graphql/mutations/updateMe';
import { useApnBadge } from './BadgeProvider';
import { getAccessToken } from './store';


const RemotePushController = () => {

  const [updateMe, {data, loading}] = useMutation(UPDATE_ME_MUTAIION);

  const { setNotification } = useApnBadge();

  useEffect(() => {
    const accesstoken = getAccessToken();

    if(!accesstoken) return;

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function({ token }) {
        updateMe({
          variables: {
            notificationToken: token
          }
        });
      },
// (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('REMOTE NOTIFICATION ==>', notification);
        PushNotification.localNotification({
            autoCancel: true,
            bigText: notification.message,
            subText: notification.message,
            title: notification.title,
            message: notification.message,
            userInfo: notification.data,
            vibrate: true,
            vibration: 300,
            playSound: true,
            soundName: 'default'
          });
      },
      // Android only: GCM or FCM Sender ID
      senderID: '373674619437',
      popInitialNotification: true,
      requestPermissions: true
    })
    
  }, []);
return null
}

export default RemotePushController