import React, {
    useRef,
    useState,
    useEffect,
    useContext,
} from 'react';
import { ScrollView } from 'react-native';
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import {
    Button,
    Divider,
    Snackbar,
    Card
} from 'react-native-paper';
import {
    iOSColors,
    iOSUIKit,
    iOSUIKitTall
} from 'react-native-typography';
import { useQuery } from '@apollo/client';
import Skeleton from 'react-native-skeleton-placeholder';
import Timeline from 'react-native-timeline-flatlist';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

import {
    store,
} from '../../utils/store'
import { LOGO_ICON } from '../../utils/constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const process = [
    {
        title: 'กด "บันทึก" รูป QR ด้านบนลงในโทรศัพท์    มือถือของคุณ',
        icon: (
            <Text style={[
                iOSUIKitTall.title3Emphasized,
                { color: iOSColors.white }
            ]}>
                1
            </Text>
        )
    },
    {
        title: 'เปิดแอพพลิเคชั่นธนาคารที่คุณมี',
        icon: (
            <Text style={[
                iOSUIKitTall.title3Emphasized,
                { color: iOSColors.white }
            ]}>
                2
            </Text>
        )
    },
    {
        title: 'ไปยังเมนู "แสกน" หรือ "แสกนจ่าย" จากนั้นกดปุ่ม "รูปภาพ" ในหน้าแสกนเพื่อ เลือกรูป QR ในมือถือของคุณ',
        icon: (
            <Text style={[
                iOSUIKitTall.title3Emphasized,
                { color: iOSColors.white }
            ]}>
                3
            </Text>
        )
    },
]

function ShareAppScreen(props) {

    const { state: { me, branchUniversalObject } } = useContext(store);

    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        async function generateUrl() {
            const linkProperties = {
                feature: 'referrals',
            }
            const controlParams = {
                $desktop_url: 'http://desktop-url.com/monster/12345'
            }
            // const { channel, completed, error } = 
            // const { url } = await branchUniversalObject
            //     .generateShortUrl(linkProperties, controlParams)
            const url = "placeholderUrl"
            setShareUrl(url);
        }

        generateUrl();
    })

    async function externalShare() {
        try {
            await Share.open({
                message: shareUrl,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <View style={styles.Root}>
                <View style={styles.topContaienr}>
                    <View style={styles.rowView}>
                        <Text style={iOSUIKitTall.body}>ได้รับแล้ว      </Text>
                        <Text style={iOSUIKitTall.title3Emphasized}>{me?.userHaveCoin}</Text>
                        <Text style={iOSUIKitTall.body}>        เหรียญ</Text>
                    </View>
                    <Text style={iOSUIKitTall.title3Emphasized}>
                        ชวนเพื่อนของคุณเพื่อรับสิทธิ์ชิงโชค
                    </Text>
                    <Button
                        mode="contained"
                        onPress={externalShare}
                        icon='share-variant'
                        style={styles.button}
                        labelStyle={[
                            iOSUIKitTall.bodyEmphasized,
                            { color: iOSColors.white }
                        ]}>
                        แชร์เพื่อลุ้นโชค
                    </Button>
                </View>
            <View style={styles.bottomContainer}>
                <Text style={[iOSUIKitTall.title3Emphasized, styles.topicText]}>
                    วิธีลุ้นโชค
                </Text>
            </View>
                <Timeline
                    data={process}
                    showTime={false}
                    circleSize={30}
                    circleColor={iOSColors.orange}
                    lineColor={iOSColors.orange}
                    style={styles.orderList}
                    titleStyle={iOSUIKitTall.title3}
                    innerCircle='element'
                />
        </View>
    )
}


const styles = StyleSheet.create({
    Root: {
        flex: 1
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    topContaienr: {
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: iOSColors.white,
        padding: 10,
        alignSelf: 'center',
        borderRadius: 20,
        marginTop: 20
    },
    topicText: {
        marginVertical: 10,
        marginLeft: 20,
    },
    orderText: {
        color: iOSColors.white
    },
    orderList: {
        marginHorizontal: 20,
        backgroundColor: iOSColors.white,
        width: width * 0.9
    },
    button: {
        marginVertical: 15,
    },
    bottomContainer: {
        backgroundColor: iOSColors.white,
        width: width * 0.9,
        alignSelf: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 20
    },
})

export default ShareAppScreen;