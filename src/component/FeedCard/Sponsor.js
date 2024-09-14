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

function Sponsor(props) {
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
  emptyCard: {
    width: '100%',
    height: 400,
    borderRadius: 50,
    backgroundColor: 'transparent',
    marginTop: 20,
  },
})

export default memo(Sponsor);
