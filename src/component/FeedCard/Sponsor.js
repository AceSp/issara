import React, { memo, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image
} from 'react-native';
import {
  Card,
  Text,
  TouchableRipple
} from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/th';
import { 
    materialTall, 
    iOSColors, 
    iOSUIKitTall 
} from 'react-native-typography';
// import AdmobSponsor from './AdmobSponsor';

moment.locale('th');

function Sponsor({
  text,
  shop,
  isAdmob
}) {
  console.log("----------Sponsor--------------------")
  console.log(shop)
  return (
  <View style={styles.container}>
    {/* <Image source={{ uri: shop.avatar }} style={styles.avatar} /> */}
    <Image 
      source={{ uri: 'https://avatars.githubusercontent.com/u/97165289' }} 
      style={styles.avatar} />
    <View style={styles.textContainer}>
      <Text style={styles.itemName}>{shop.itemName}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 120
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 4,
    margin: 10,
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    height: '100%'
  },
  itemName: {
    ...iOSUIKitTall.subheadEmphasized,
    color: iOSColors.white,
  },
  text: {
    ...iOSUIKitTall.footnote,
    color: iOSColors.white,
  },
})

export default memo(Sponsor);
