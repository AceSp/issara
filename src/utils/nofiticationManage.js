import { PermissionsAndroid, Platform, Alert } from 'react-native';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: 'Notification Permission',
          message:
            'This app needs permission to show notifications so you can stay updated.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted.');
      } else {
        console.log('Notification permission denied.');
        Alert.alert(
          'Permission Required',
          'Please enable notification permissions in settings to receive updates.'
        );
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    console.log('Notification permission not required for this platform/version.');
  }
};


export const checkNotificationPermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );

    return hasPermission;
  }
  return true; // Permissions not required for other platforms or versions
};
