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
    const sponsor = props.shop? props.shop 
                    : props.product ? props.product
                    : null;

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
        <TouchableRipple 
            onPress={() => props.navigation? 
                props.navigation.navigate('Shop', { id: sponsor? sponsor.id : null })
                :
                null
            } 
            >
            <View>
                <Card.Title
                    style={styles.root}
                    title="title"
                    // title={sponsor? sponsor.name : null}
                    // subtitle={props.text}
                    subtitle="subtitle"
                    subtitleStyle={materialTall.body1}
                    left={(p) => <Image 
                        style={styles.image} 
                        source={sponsor
                            ? props.image 
                            : require('../../assets/pic/rose-blue-flower-rose-blooms-67636.jpeg')} />}
                    leftStyle={styles.leftStyle}
                    rightStyle={styles.rightStyle}
                    />    
                <View style={styles.bottomView}>
                    <View style={styles.sponsorTag}>
                        <Text style={[
                            iOSUIKitTall.caption2,
                            { color: iOSColors.red }
                            ]}>
                            ผู้สนับสนุนคอลัมน์
                        </Text>
                    </View>
                    <Text style={[iOSUIKitTall.caption2, styles.sponsorName]}>
                        {sponsor.itemName}hello
                    </Text>
                </View>
            </View>
        </TouchableRipple>
        
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: "flex-start", 
        paddingLeft: 10,
        paddingBottom: 15,
        backgroundColor: 'white'
    },
    image: {
        height: 80,
        width: 120,
        marginRight: 5,
        borderRadius: 5,
        overflow: 'hidden'
    },
    sponsorTag: {
        borderRadius: 5,
        marginLeft: 10,
        marginTop: 2,
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderColor: iOSColors.red,
        borderWidth: 1
    },
    leftStyle: {
        marginRight: 85, 
        marginTop: 25, 
        marginBottom: 10
    },
    rightStyle: {
        position: 'absolute', 
        top: 58, 
        left: 115
    },
    sponsorView: {
        marginLeft: 20,
         flexDirection: 'row'
    },
    bottomView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sponsorName: {
        marginLeft: 25,
        color: iOSColors.gray
    }
})

export default memo(Sponsor);

/*
    return (
        <Card.Title
          style={{ marginVertical: 2, alignItems: "flex-start", paddingLeft: 10 }}
          rightStyle={{ height: 40 }}
          titleStyle={{}}
          title="adasfasgfasfasfasfasf"
          subtitle={props.text}
          subtitleStyle={materialTall.body1}
          left={(p) => <Image style={styles.image} source={require('../../assets/pic/rose-blue-flower-rose-blooms-67636.jpeg')} />}
          leftStyle={{marginRight: 85, marginTop: 20}}
          rightStyle={{position: 'absolute', top: 60, right: 5}}
          right={() => {
              return(
                    <View style={styles.followedButton}>
                        <Text style={styles.followText}>ผู้สนับสนุนคอลัมน์</Text>
                    </View>
              )
          } }
        />    
    )
}

const styles = StyleSheet.create({
    image: {
        height: 90,
        width: 120,
        marginRight: 5,
        borderRadius: 5,
        overflow: 'hidden'
    },
    followedButton: {
        borderRadius: 5,
        marginLeft: 20,
        marginTop: 2,
        paddingHorizontal: 10,
        paddingVertical: 1,
        backgroundColor: iOSColors.red
    },
})

*/