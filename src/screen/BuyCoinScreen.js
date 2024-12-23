import React, {
  useEffect,
  useContext,
  useState
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
// import {
//   requestPurchase,
//   useIAP,
// } from 'react-native-iap';
import { 
  Button, 
  Divider 
} from 'react-native-paper';
import { Icon } from 'react-native-elements';
import {
  iOSColors, 
  iOSUIKit, 
  iOSUIKitTall
} from 'react-native-typography';

import {
  consumableSkus,
} from '../utils/constants'
import { store } from '../utils/store';

const { height, width } = Dimensions.get('screen');

function BuyCoinScreen() {
  // const {
  //   connected,
  //   products,
  //   getProducts,
  // } = useIAP()

  const { state: { me } } = useContext(store);
  const [coinCount, setCoinCount] = useState(0);

  // useEffect(() => {
  //   getProducts(consumableSkus);
  // }, [connected]);
  // {"availablePurchases": [], "connected": true, "currentPurchase": undefined, "currentPurchaseError": undefined, "finishTransaction": [Function anonymous], "getAvailablePurchases": [Function anonymous], "getProducts": [Function anonymous], "getPurchaseHistories": [Function anonymous], "getSubscriptions": [Function anonymous], "products": [], "promotedProductsIOS": [], "purchaseHistories": [], "subscriptions": []}
  async function purchase() {
    console.log("BuyCoinScreen => purchase");
    // try {
    //   setCoinCount(0);
    //   if (!products) getProducts(consumableSkus);
    //   await requestPurchase(consumableSkus[(coinCount / 50) - 1]);
    // } catch (error) {
    //   if(error.message === "Payment is Cancelled.") return;
    //   console.log(error.message);
    // }
  }

  return (
    <View style={styles.root}>
      <View style={styles.rowView}>
        <Text style={iOSUIKitTall.title3}>    มีอยู่</Text>
        <View style={[styles.circle, styles.userCoin]}>
          <Text style={iOSUIKitTall.title3}>{me?.userHaveCoin}</Text>
        </View>
        <Text style={iOSUIKitTall.title3}>เหรียญ</Text>
      </View>
      <Divider />
      <Text style={[iOSUIKitTall.title3Emphasized, { marginTop: 120 }]}>ซื้อเพิ่ม</Text>
      <View style={styles.rowView}>
        <Icon 
          onPress={() => coinCount > 0? setCoinCount(coinCount - 50) : null} 
          reverse 
          type="material-community" 
          name="minus" 
        />
        <View style={[styles.circle, styles.coin]}>
          <Text style={iOSUIKitTall.title3}>{coinCount}</Text>
          <Text style={iOSUIKitTall.title3}>เหรียญ</Text>
        </View>
        <Icon 
          onPress={() => coinCount < 1000? setCoinCount(coinCount + 50) : null}
          reverse 
          type="material-community" 
          name="plus" 
        />
      </View>
      <View style={styles.rowView}>
        <Text style={iOSUIKitTall.title3}>ราคา</Text>
        <View style={[styles.circle, styles.price]}>
          <Text style={iOSUIKitTall.title3}>{coinCount / 5}</Text>
        </View>
        <Text style={iOSUIKitTall.title3}>บาท</Text>
      </View>
      <Button
        mode="contained"
        onPress={purchase}
        style={styles.button}
        labelStyle={iOSUIKitTall.title3White}
        disabled={coinCount <= 0}
      >
        ซื้อเลย
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: iOSColors.white
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40
  },
  circle: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 20
  },
  userCoin: {
    borderRadius: Math.round( width / 2 ),
    width: width * 0.3,
    height: width * 0.1,
  },
  coin: {
    borderRadius: Math.round( width / 2 ),
    width: width * 0.3,
    height: width * 0.3,
  },
  price: {
    borderRadius: Math.round( width / 2 ),
    width: width * 0.3,
    height: width * 0.1,
  },
  button: {
    marginHorizontal: 10,
    alignSelf: 'stretch',
    position: 'absolute',
    bottom: 50,
    width: width - 20  
  }
})

export default BuyCoinScreen;