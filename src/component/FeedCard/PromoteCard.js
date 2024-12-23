import React, {
    memo,
    useState,
    useEffect,
    useRef
} from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text
} from 'react-native';
import {
    Card,
    Avatar,
    Divider,
} from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/th';
// import NativeAdView, {
//     CallToActionView,
//     IconView,
//     HeadlineView,
//     TaglineView,
//     AdvertiserView,
//     AdBadge,
//     NativeMediaView
// } from 'react-native-admob-native-ads';

import RenderHTML from '../RenderHTML';
import FollowButton from '../FollowButton';
import FOLLOW_MUTATION from '../../graphql/mutations/follow';
import UNFOLLOW_MUTATION from '../../graphql/mutations/unfollow';
import { DEFAULT_AVATAR } from '../../utils/constants';
import { iOSColors, iOSUIKitTall } from 'react-native-typography';
import FeedCardHeader from './FeedCardHeader';

moment.locale('th');

function PromoteCard(props) {
    const nativeAdViewRef = useRef();

    useEffect(() => {
        nativeAdViewRef.current?.loadAd();
    }, []);

    // if (props.isAdmob) return <PromoteCard />
    if(props.isAdmob) return <View></View>
    return (
      <Card style={{ marginTop: 5 }}>
        <Divider />
        <Card.Title title={props.title} />
        <FeedCardHeader
          author={props.shop ? props.shop : props.product}
          title={props.title}
          createdAt={props.createdAt}
          navigation={props.navigation}
          myId={props.shop ? props.shop?.id : props.product?.id}
        />
        <Divider />
        <View style={{ padding: 10 }}>
            <RenderHTML html={props.text ? props.text : "<p></p>"} />
        </View>
        <Divider />
      </Card>
    )

    // return (
    //     <NativeAdView
    //         style={styles.root}
    //         ref={nativeAdViewRef}
    //         adUnitID="ca-app-pub-3940256099942544/2247696110"
    //         onAdLoaded={() => console.log('promoteload')}
    //     >
    //         <View
    //             style={styles.root}
    //         >
    //             <View style={styles.header}>
    //                 <HeadlineView
    //                     style={[iOSUIKitTall.subheadEmphasized, styles.title]}
    //                 />
    //                 <Divider style={{ margin: 5 }} />
    //                 <View style={[styles.row, styles.authorView]}>
    //                     <View style={[styles.row, { justifyContent: 'space-between' }]}>
    //                         <IconView
    //                             style={styles.avatar}
    //                         />
    //                         <View>
    //                             <AdvertiserView
    //                                 style={{ marginLeft: 16 }}
    //                             />
    //                             <View style={styles.promoteTag}>
    //                                 <Text style={[
    //                                     iOSUIKitTall.caption2,
    //                                     { color: iOSColors.orange }
    //                                     ]}>
    //                                     ผู้สนับสนุนหลัก
    //                                 </Text>
    //                             </View>
    //                         </View>
    //                         <View style={{ alignSelf: 'flex-end', backgroundColor: 'red' }}>
    //                             <CallToActionView
    //                                 style={styles.CTAButton}
    //                                 textStyle={iOSUIKitTall.bodyWhite}
    //                             />
    //                         </View>
    //                     </View>
    //                 </View>
    //             </View>
    //             <Divider />
    //             <View>
    //                 <TaglineView
    //                     style={[iOSUIKitTall.body, { paddingHorizontal: 10 }]}
    //                 />
    //                 <NativeMediaView
    //                     style={{ width: "100%", height: 250 }}
    //                 />
    //             </View>
    //         </View>
    //     </NativeAdView>
    // )
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        alignSelf: 'center',
        paddingBottom: 6,
        backgroundColor: iOSColors.white,
        marginTop: 5
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 6
    },
    title: {
        lineHeight: 22,
        minHeight: 25
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    authorView: {
        justifyContent: 'space-between',
    },
    promoteTag: {
        borderRadius: 5,
        marginLeft: 10,
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderColor: iOSColors.orange,
        borderWidth: 1,
        width: 93
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    CTAButton: {
        height: 45,
        width: 80,
        marginHorizontal: 12,
        backgroundColor: iOSColors.orange,
        alignSelf: 'stretch',
        borderRadius: 25,
        elevation: 10,
    }
});

export default memo(PromoteCard);

