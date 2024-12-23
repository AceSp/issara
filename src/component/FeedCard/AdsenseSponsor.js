import React,
{
  memo,
  useEffect,
  useRef
} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text
} from 'react-native';
import {
  Card,
  Divider,
  Avatar,
} from 'react-native-paper';
import NativeAdView, {
  CallToActionView,
  IconView,
  HeadlineView,
  TaglineView,
  AdvertiserView,
  AdBadge,
} from 'react-native-admob-native-ads';
import { 
  iOSColors,
  iOSUIKit,
  iOSUIKitTall
} from 'react-native-typography';

const { height, width } = Dimensions.get('screen');

function AdsenseSponsor(props) {
    const nativeAdViewRef = useRef();

    useEffect(() => {
      nativeAdViewRef.current?.loadAd();
    }, []);

    return (
      <NativeAdView 
        style={{
          width: "100%",
          alignSelf: 'center',
          height: 125,
        }}
        ref={nativeAdViewRef}
        enableTestMode={true}
        adUnitID="ca-app-pub-3940256099942544/2247696110"
      >
        <View
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <View
            style={{
              height: 100,
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <IconView
              style={styles.image}
            />
            <View
              style={{
                width: "65%",
                maxWidth: "65%",
                paddingHorizontal: 6,
                alignSelf: 'flex-start',
                marginTop: 10
              }}
            >
              <HeadlineView
                numberOfLines={2}
                style={[iOSUIKitTall.subheadEmphasized, styles.lineHeight]}
              />
              <TaglineView
                numberOfLines={2}
                style={[iOSUIKitTall.footnote, styles.lineHeight]}
              />

            </View>
          </View>
          <View style={styles.bottomView}>
            <View style={styles.sponsorTag}>
                <Text style={[
                    iOSUIKitTall.caption2,
                    { color: iOSColors.orange }
                    ]}>
                    ผู้สนับสนุนคอลัมน์
                </Text>
            </View>
            <AdvertiserView
              style={[iOSUIKitTall.caption2, styles.sponsorName]}
            />
          </View>

        </View>
      </NativeAdView>
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
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderColor: iOSColors.orange,
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
    },
    lineHeight: {
      lineHeight: 20
    }
  })

  export default memo(AdsenseSponsor);


