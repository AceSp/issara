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
    // if(props.isAdmob) return (
    //   <NativeAdView 
    //     style={{
    //       width: "100%",
    //       alignSelf: 'center',
    //       height: 125,
    //     }}
    //     ref={nativeAdViewRef}
    //     enableTestMode={true}
    //     adUnitID="ca-app-pub-3940256099942544/2247696110"
    //   >
    //     <View
    //       style={{
    //         height: "100%",
    //         width: "100%",
    //       }}
    //     >
    //       <View
    //         style={{
    //           height: 100,
    //           width: "100%",
    //           flexDirection: "row",
    //           justifyContent: "flex-start",
    //           alignItems: "center",
    //           paddingHorizontal: 10,
    //         }}
    //       >
    //         <IconView
    //           style={styles.image}
    //         />
    //         <View
    //           style={{
    //             width: "65%",
    //             maxWidth: "65%",
    //             paddingHorizontal: 6,
    //             alignSelf: 'flex-start',
    //             marginTop: 10
    //           }}
    //         >
    //           <HeadlineView
    //             numberOfLines={2}
    //             style={[iOSUIKitTall.subheadEmphasized, styles.lineHeight]}
    //           />
    //           <TaglineView
    //             numberOfLines={2}
    //             style={[iOSUIKitTall.footnote, styles.lineHeight]}
    //           />

    //         </View>
    //       </View>
    //       <View style={styles.bottomView}>
    //         <View style={styles.sponsorTag}>
    //             <Text style={[
    //                 iOSUIKitTall.caption2,
    //                 { color: iOSColors.red }
    //                 ]}>
    //                 ผู้สนับสนุนคอลัมน์
    //             </Text>
    //         </View>
    //         <AdvertiserView
    //           style={[iOSUIKitTall.caption2, styles.sponsorName]}
    //         />
    //       </View>

    //     </View>
    //   </NativeAdView>
    // )
    return (
      <View style={styles.emptyCard}></View>
    )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
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
