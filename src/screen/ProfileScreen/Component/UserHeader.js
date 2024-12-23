import React, { 
    useContext, 
    useState, 
    useEffect 
} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';

import {
    Divider,
    IconButton,
    ToggleButton
} from 'react-native-paper';
import { useMutation } from '@apollo/client';
import {launchImageLibrary} from 'react-native-image-picker'
import {
  request,
  check,
  PERMISSIONS,
  RESULTS
} from 'react-native-permissions';
import BackgroundService from 'react-native-background-actions';

import formatNumber from '../../../utils/formatNumber';
import { colors, DEFAULT_AVATAR } from '../../../utils/constants';
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
import UPDATE_ME_MUTATION from '../../../graphql/mutations/updateMe';
import AvatarWrapper from '../../../component/AvatarWrapper';
import { VIDEO_URL } from '../../../utils/apollo-client';
import uploadFileInChunks from '../../../utils/uploadFileInChunks';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function UserHeader(props) {
    const { state: { me } } = useContext(store);
    const isFollowed = me?.followingUser?.includes(props.userData.id);
    // const isMod = me ? mod?.includes(me.id) : null;
    const [followed, setFollowed] = useState(false);

    const [follow, { data: follow_data }] = useMutation(FOLLOW_MUTATION);
    const [updateMe, { data: updateMe_data }] = useMutation(UPDATE_ME_MUTATION);

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

    async function checkImagePermission() {
        if (Platform.OS === 'android') {
        const result = await check(PERMISSIONS.ANDROID.CAMERA)
        switch (result) {
            case RESULTS.UNAVAILABLE:
            console.log("unavailable")
            return false;
            case RESULTS.DENIED:
            console.log("denied")
            return false;
            case RESULTS.GRANTED:
            console.log("granted")
            return true;
            case RESULTS.BLOCKED:
            console.log("blocked")
            return false;
        }
        } else {
        const result = await check(PERMISSIONS.IOS.CAMERA)
        switch (result) {
            case RESULTS.UNAVAILABLE:
            console.log("unavailable")
            return false;
            case RESULTS.DENIED:
            console.log("denied")
            return false;
            case RESULTS.GRANTED:
            console.log("granted")
            return true;
            case RESULTS.BLOCKED:
            console.log("blocked")
            return false;
        }
        }
    };

    const openVideoGallery = async () => {
        await checkImagePermission()
        const options = {
            mediaType: 'image',
            includeBase64: false,
            assetRepresentationMode: 'current',
            maxHeight: 2000,
            maxWidth: 2000,
        };

        const result = await launchImageLibrary(options);
            if (result.didCancel) {
                console.log('User cancelled image picker');
            } else if (result.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const source = result.uri || result.assets[0].uri;
                const fileName = result.fileName || result.assets[0].fileName
                console.log('Selected image:', source);
                console.log(result)
                handleUpload(fileName, source)
            }
    }

    const handleUpload = async (fileName, filePath) => {
        const options = {
            taskName: 'FileUpload',
            taskTitle: 'Uploading File',
            taskDesc: 'Progress',
            taskIcon: {
                name: 'ic_launcher',
                type: 'mipmap',
            },
            color: '#ff00ff',
            //change this for opening the app from notification
            linkingURI: 'uploadFile',
        };
        await BackgroundService.start(async () => {
            const sanitize = (name) => name.replace(/[^a-zA-Z0-9-_]/g, '_'); 
            const imageId = sanitize(fileName);
            const userId = sanitize(me.id);
            await uploadFileInChunks({ filePath, userId, imageId });
            console.log('Upload complete');
            await BackgroundService.updateNotification({
                taskDesc: 'File Uploaded',
            });
            const avatar = `${VIDEO_URL}images/${userId}/${imageId}.jpg`
            await updateMe({
                variables: {
                    avatar
                },
            })
        }, options);
    };

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
            <Text style={{ color: iOSColors.orange, marginTop: 5 }} onPress={handlePress}>
                Read more
            </Text>
        );
    }

    function _renderReadmoreRevealed(handlePress) {
        return (
            <Text style={{ color: iOSColors.orange, marginTop: 5 }} onPress={handlePress}>
                Show less
            </Text>
        );
    }

    console.log("------userHeader-------");
    console.log("props.userData?.id:", props.userData?.id);
    console.log("me.id:", me.id);
    console.log("Comparison result:", props.userData?.id === me.id); 
    return (
        <View style={styles.Root}>
            <View style={styles.Profile}>
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                            <AvatarWrapper
                                size={80}
                                style={styles.avatar}
                                uri={props.userData.avatar}
                                label={props.userData.itemName[0]}
                            />
                        <IconButton
                            icon="pencil"
                            iconColor="white"
                            size={20}
                            style={styles.editIconButton}
                            onPress={openVideoGallery}
                        />
                    </View>
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
                    {props.userData?.id == me.id 
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
                <ToggleButton.Row 
                    style={[
                        styles.toggleButtonsContainer, 
                        { width: '100%' }
                    ]} 
                    onValueChange={value => props.onToggleChange(value)} 
                    value={props.currentToggleValue}
                >
                    <ToggleButton icon="format-list-bulleted" value={0} style={{ flex: 1 }} />
                    <ToggleButton icon="bookmark" value={1} style={{ flex: 1 }} />
                    <ToggleButton icon="heart" value={2} style={{ flex: 1 }} />
                </ToggleButton.Row>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    toggleButtonsContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    avatar: {
        alignSelf: 'center',
    },
    editIconButton: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: colors.PRIMARY,
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2
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
        alignSelf: 'center',
    },
    Profile: {
        flex: 1,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: colors.LIGHT_GRAY,
        opacity: 50,
        backgroundColor: 'white',
        width: '100%',
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
    avatarContainer: {
        position: 'relative',
        width: 80,
        marginBottom: 20,
        alignItems: 'center',
        alignSelf: 'center',
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

