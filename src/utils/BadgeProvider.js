import React, { useState, useEffect, useRef } from 'react'
import { 
  AppState,
  Platform
} from 'react-native'
import PushNotification from 'react-native-push-notification';
import ME_QUERY from '../graphql/queries/getMe';
import ME_SUBSCRIPTION from '../graphql/subscriptions/meSub';
import { useQuery, useMutation } from '@apollo/client';

// apn badge context to access badge number
export const APNBadgeContext = React.createContext({
  badge: 0,
  setBadge: () => { }
});
export const useApnBadge = () => React.useContext(APNBadgeContext);

export const APNBadgeProvider = (props) => {

  const [badge, _setBadge] = useState(0);
  const badgeRef = useRef(badge);

  const { 
      loading: me_loading, 
      error: me_error, 
      data: me_data, 
      subscribeToMore: me_subscribeToMore 
    } = useQuery(ME_QUERY)

  const setBadge = val => {
    badgeRef.current = val;
    if(Platform === 'ios') PushNotification.setApplicationIconBadgeNumber(val);
    _setBadge(val);
  }

  const handleBadge = (state) => {
    if (state === 'active') {
      if(Platform === 'ios') {
        PushNotification.getApplicationIconBadgeNumber(num => {
          setBadge(num);
        });
      } else {
        setBadge(me_data?.me.badgeCount);
      }  
    }
  }

  useEffect(() => {
      if(me_data) {
        me_subscribeToMore({
          document: ME_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if(!subscriptionData.data) {
                    return prev;
                  }
    
                  const newData = subscriptionData.data.me
        
                  return Object.assign({}, prev, {
                    me: {
                      ...newData
                    }
                  });
      
                  }           
        })
      };
      setBadge(me_data?.me.badgeCount); 
  }, [me_data])

  useEffect(() => {
    if(Platform === 'ios') {
      PushNotification.getApplicationIconBadgeNumber(num => {
        setBadge(num);
      });
    }
    setBadge(me_data?.me.badgeCount);
    AppState.addEventListener('change', handleBadge);
    return () => {
      AppState.removeEventListener('change', handleBadge);
    }
  }, []);

  return (
    <APNBadgeContext.Provider value={{
      badge: badgeRef.current,
      setBadge: setBadge
    }}>
      {props.children}
    </APNBadgeContext.Provider>
  )
}