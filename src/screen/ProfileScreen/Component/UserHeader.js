import React, { 
    useContext, 
    useState, 
    useEffect 
} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';

import {
    Icon
} from 'react-native-elements';
import {
    Avatar,
    Divider,
    ToggleButton
} from 'react-native-paper';
import {
    Button
} from 'react-native-paper';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';
import ReadMore from 'react-native-read-more-text';
import LinearGradient from 'react-native-linear-gradient';
import { useMutation } from '@apollo/client';

import formatNumber from '../../../utils/formatNumber';
import { colors } from '../../../utils/constants';
import FollowButton from '../../../component/FollowButton';
import PostBox from '../../../component/PostBox';
import {
    iOSColors,
    iOSUIKit,
    iOSUIKitTall,
    materialColors
} from 'react-native-typography';
import { store } from '../../../utils/store';
import FOLLOW_MUTATION from '../../../graphql/mutations/follow';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function UserHeader(props) {
    const { state: { me } } = useContext(store);
    const isFollowed = me?.followingUser?.includes(props.userData.id);
    // const isMod = me ? mod?.includes(me.id) : null;
    const [followed, setFollowed] = useState(false);

    const [follow, { data: follow_data }] = useMutation(FOLLOW_MUTATION);

    useEffect(() => {
        if (isFollowed) 
        setFollowed(isFollowed);
    // eslint-disable-next-line
    }, [isFollowed])

    const onFollowPress = () => {
        follow({
            variables: { userId: props.userData.id }
        });
        setFollowed(!followed);
    }

    // useEffect(() => {
    //     setFollow(props.userData.meFollowed);
    // }, [props.userData.meFollowed]);

    // const handleGetDirections = () => {
    //     getDirections({
    //         destination: {
    //             latitude: props.userData.latitude,
    //             longitude: props.userData.longitude
    //         }
    //     })
    // }

    function _renderReadmoreTruncated(handlePress) {
        return (
            <Text style={{ color: iOSColors.red, marginTop: 5 }} onPress={handlePress}>
                Read more
            </Text>
        );
    }

    function _renderReadmoreRevealed(handlePress) {
        return (
            <Text style={{ color: iOSColors.red, marginTop: 5 }} onPress={handlePress}>
                Show less
            </Text>
        );
    }

    console.log("------userHeader-------")
    console.log(me.id)
    console.log(props.userData?.id == me.id)
    return (
        <View style={styles.Root}>
            <View style={styles.Profile}>
                <View style={styles.header}>
                    <Avatar.Image
                        size={80}
                        style={styles.avatar}
                        source={props.userData.avatar ? { uri: props.userData.avatar } : require('../../../assets/pic/profile.jpg')}
                    />
                    <Text style={[iOSUIKitTall.bodyEmphasized, styles.usernameText]}>
                        {props.userData.itemName}
                    </Text>
                    <View style={styles.statHead}>
                        <Text style={[styles.textMetaNumber]}>
                            จำนวนโพสต์  {formatNumber(props.userData.userHavePost)}
                        </Text>
                        <Text style={[styles.textMetaNumber]} >
                            ผู้ติดตาม  {formatNumber(props.userData.followerCount)}
                        </Text>
                    </View>
                    {/* <ReadMore
                        numberOfLines={3}
                        renderTruncatedFooter={_renderReadmoreTruncated}
                        renderRevealedFooter={_renderReadmoreRevealed}
                    >
                    <Text style={[iOSUIKitTall.subheadShort, styles.aboutText]}>
                        แคมเปญ ขั้นตอนออร์แกนิค จ๊อกกี้คอปเตอร์เทเลกราฟโหลยโท่ย ฮิตเหมยโทรโข่งโบว์ ดิกชันนารีบู๊มอยส์เจอไรเซอร์เอาท์ ควิกโปรเจ็คท์เยนฟลุคกาญจน์ ซังเต คอลเล็กชั่นฟาสต์ฟู้ดบาร์บี้ ซากุระดีมานด์เมจิก เทควันโดมั้ยเซอร์โหงวเฮ้งแดนเซอร์ เมคอัพ﻿กรรมาชน อึ๋มโปรดิวเซอร์ห่วย ม็อบเตี๊ยมกาญจน์ แจ๊กเก็ตเบนโลบ๋อย มาร์จินเอ็นทรานซ์ ช็อปปิ้งเอ็นทรานซ์จูเนียร์ออร์แกนฟยอร์ด
                    </Text>
                    </ReadMore> */}
                    {props.userdata?.id == me.id 
                        ? null
                        : <FollowButton
                            followText="ติดตาม"
                            unfollowText="เลิกติดตาม"
                            onPress={onFollowPress}
                            follow={followed}
                            style={styles.topFollowButton}
                            textStyle={styles.followButtonText}
                        />
                    }
                </View>
                <Divider />
                <ToggleButton.Row style={styles.toggleButtonsContainer} onValueChange={value => console.log(value)} value="left">
                    <ToggleButton icon="format-list-bulleted" value="left" />
                    <ToggleButton icon="account" value="center" />
                    <ToggleButton icon="settings" value="right" />
                </ToggleButton.Row>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    toggleButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    avatar: {
        alignSelf: 'center',
    },
    Root: {
        backgroundColor: '#f1f6f8',
        marginBottom: 12
    },
    followButtonText: {
        fontSize: 20
    },
    header: {
        alignItems: 'center',
        padding: 10,
        alignItems: 'stretch',
        alignSelf: 'stretch',
    },
    Profile: {
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.LIGHT_GRAY,
        opacity: 50,
        backgroundColor: 'white'
    },
    statHead: {
        flexDirection: 'row',
        marginTop: 5,
        // justifyContent: 'space-around',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'stretch',
        paddingBottom: 15,
    },
    textMetaNumber: {
        marginHorizontal: 10,
    },
    realNameText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.SECONDARY
    },
    usernameText: {
        flexWrap: 'wrap',
        width: 220,
        fontSize: 24,
        textAlign: 'center',
        alignSelf: 'center',
    },
    about: {
        backgroundColor: 'white',
        marginVertical: 3,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: colors.LIGHT_GRAY
    },
    aboutHead: {
        paddingBottom: 10,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    aboutRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        // borderTopWidth: 1,
        // orderColor: colors.LIGHT_GRAY
    },
    aboutText: {
        paddingHorizontal: 10,
        flexWrap: 'wrap'
    },
    topicIcon: {
        marginRight: 10
    },
    infoText: {
        paddingRight: 20,
        flexShrink: 1
    },
    editText: {
        fontSize: 15,
        color: colors.PRIMARY,
        marginRight: 15
    },
    map: {
        height: height * 0.2,
        width: width * 0.85,
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },
    topFollowButton: {
        height: 46
    },
})

