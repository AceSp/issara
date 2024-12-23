/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import 'react-native-gesture-handler';
import React, {
  useEffect,
  useMemo,
  useContext
} from 'react';
import {
  DefaultTheme,
  PaperProvider,
  Text,
} from 'react-native-paper';
import {
  useLazyQuery,
  useMutation,
} from '@apollo/client';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import CookieManager from '@react-native-cookies/cookies';
import { enableScreens } from 'react-native-screens';
// import {
//   requestPurchase,
//   useIAP,
//   flushFailedPurchasesCachedAsPendingAndroid,
// } from 'react-native-iap';

import { colors } from './src/utils/constants';
import { 
  store,
  setAccessToken, 
  storage 
} from './src/utils/store';
import {
  client,
  HOST,
  HTTP_URL
} from "./src/utils/apollo-client";
import { MainStack, AuthStack } from './src/utils/navigation';
import FullScreenLoading from './src/screen/FullScreenLoading';
import { AuthContext } from './src/utils/context';
import { iOSColors } from 'react-native-typography';
import RemotePushController from './src/utils/RemotePushController';
import ME_SUBSCRIPTION from './src/graphql/subscriptions/meSub';
import GET_ME_QUERY from './src/graphql/queries/getMe';
import INCREASE_COIN_MUTATION from './src/graphql/mutations/increaseCoin'
import { linking } from './src/utils/linking';

const REFRESH_TOKEN = 'REFRESH_TOKEN';
const ME_DATA = 'ME_DATA';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: iOSColors.orange,
    accent: iOSColors.black,
  },
};

enableScreens();

// ['log', 'warn'].forEach(function(method) {
//   var old = console[method];
//   console[method] = function() {
//     var stack = (new Error()).stack.split(/\n/);
//     // Chrome includes a single "Error" line, FF doesn't.
//     if (stack[0].indexOf('Error') === 0) {
//       stack = stack.slice(1);
//     }
//     var args = [].slice.apply(arguments).concat([stack[1].trim()]);
//     return old.apply(console, args);
//   };
// });

export default function App({ navigation }) {
  const { state, dispatch } = useContext(store);

  const [getMe, { loading, error, data, subscribeToMore }] = useLazyQuery(GET_ME_QUERY);
  const [increaseCoin, { data: coin_data }] = useMutation(INCREASE_COIN_MUTATION);

  // const {
  //   connected,
  //   finishTransaction,
  //   currentPurchase,
  //   currentPurchaseError,
  //   getAvailablePurchases,
  //   availablePurchases
  // } = useIAP();

  // useEffect(() => {
  //   const checkCurrentPurchase = async (purchase) => {
  //     try {
  //       await flushFailedPurchasesCachedAsPendingAndroid();
  //       if (purchase) {
  //         const receipt = purchase.transactionReceipt;
  //         if (receipt) {
  //           const idArr = purchase.productId.split('.');
  //           const price = idArr[idArr.length - 1];
  //           const increaseCoinCount = price * 5;
  //           const ackResult = await finishTransaction(purchase, true);
  //           await increaseCoin({
  //             variables: { increaseCoinCount }
  //           });
  //           console.log('ackResult', ackResult);
  //         }
  //       }
        
  //     } catch (error) {
  //       Alert.alert(
  //         "มีความผิดพลาดเกิดขึ้นในการซื้อเหรียญ",
  //         "เกิดความผิดพลาดในการเชื่อมต่อกับเพลย์สโตร์"
  //       )
  //       console.warn('ackErr', error);
  //     }
  //   };

  //   checkCurrentPurchase(currentPurchase);
  // }, [currentPurchase, finishTransaction, currentPurchaseError]);

  // useEffect(() => {
  //   const checkOldPurchase = async () => {
  //     try {
  //       await getAvailablePurchases();
  //       await flushFailedPurchasesCachedAsPendingAndroid();

  //       if(availablePurchases) {
  //         for(let item of availablePurchases) {
  //           const idArr = purchase.productId.split('.');
  //           const price = idArr[idArr.length - 1];
  //           const increaseCoinCount = price * 5;
  //           await increaseCoin({
  //             variables: { increaseCoinCount }
  //           });
  //           await finishTransaction(item, true);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   checkOldPurchase();
  // }, [connected]);

  useEffect(() => {
    async function changeMe() {
      subscribeToMore({
        document: ME_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const newData = subscriptionData.data.me
          dispatch({ type: 'CHANGE_ME', me: newData });
          console.log("--------------App------------")
          console.log(newData)

          return Object.assign({}, prev, {
            me: {
              ...newData
            }
          });
        },
        onError: (err) => {
          console.log("----------App----meSub---onError")
          console.log(err)
        }
      });
      // const branchUniversalObject = await branch.createBranchUniversalObject(
      //   data.getMe.id, 
      //   {
      //     locallyIndex: true,
      //     contentMetadata: { customMetadata: { prop1: 'test', prop2: 'abc' }},
      //     title: 'Cool Content!',
      //     contentDescription: 'Cool Content Description'
      //   },
      // )
      dispatch({ 
        type: 'CHANGE_ME', 
        me: data?.getMe,
        // branchUniversalObject
      });
    }

    if (data) {
      changeMe();
      // branch.setIdentity(data.getMe.id);
    }
  }, [data]);

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let accessToken = null;

      try {
        const [_, cookies] = await Promise.all([
          CookieManager.clearAll(),
          storage.getString(REFRESH_TOKEN)
        ]);
        const res = await fetch(`${HTTP_URL}refresh_token`, {
          method: "POST",
          credentials: "include",
          headers: {
            "cookie": `rt=${cookies}`
          }
        });
        const resJSON = await res.json();
        if (!resJSON.error) {
          accessToken = resJSON.accessToken;
          setAccessToken(accessToken);
          getMe();
        };
        if (!data) getMe();
      } catch (error) {
        console.log(error)
      }
      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: accessToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (newToken/*, newMeData*/) => {
        try {
          console.log("---------App--------signIn")
          const { rt } = await CookieManager.get(HTTP_URL);
          await Promise.all([
            CookieManager.clearAll(),
            //storage.set(ME_DATA, JSON.stringify(newMeData)),
            storage.set(REFRESH_TOKEN, rt.value)
          ]);
          setAccessToken(newToken);
          getMe();
          // branch.setIdentity(data.getMe.id)
        } catch (error) {
          throw error;
        }
        dispatch({ type: 'SIGN_IN', token: newToken });
      },
      signOut: () => {
        storage.delete(ME_DATA);
        storage.delete(REFRESH_TOKEN);
        CookieManager.clearAll();
        // branch.logout();
        dispatch({ type: 'SIGN_OUT' })
      },
      // signUp: async (newToken, newMeData) => {
      //   try {
      //     const { rt } = await CookieManager.get(`http://${HOST}:3000/dev/graphql`);
      //     await Promise.all([
      //       CookieManager.clearAll(),
      //       storage.set(ME_DATA, JSON.stringify(newMeData)),
      //       storage.set(REFRESH_TOKEN, rt.value)
      //     ]);
      //     setAccessToken(newToken);
      //     getMe();
      //     // branch.setIdentity(data.getMe.id)
      //     // const { $canonical_identifier: referrerID } = await branch.getFirstReferringParams();
      //     // if(referrerID) 
      //     //   await increaseCoin({
      //     //     variables: { increaseCoinCount: 1 }
      //     //   });
      //   } catch (error) {
      //     throw error;
      //   }
      //   dispatch({ type: 'SIGN_IN', token: newToken });
      // },
      test: true
    }),
    []
  );

  if (state.isLoading) {
    return <FullScreenLoading />
  }

  return (
      <AuthContext.Provider value={authContext}>
        <PaperProvider theme={theme}>
          <NavigationContainer
            linking={linking}
            fallback={<Text>Loading...</Text>}
          >
            {state.accessToken ? <MainStack /> : <AuthStack />}
            <RemotePushController />
          </NavigationContainer>
        </PaperProvider>
      </AuthContext.Provider>
  )
};


