import React, {
    useRef,
    useState,
    useEffect,
    useContext,
} from 'react';
import { ScrollView, Clipboard } from 'react-native';
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
import QRCode from 'react-native-qrcode-svg';

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

    const { state: { me } } = useContext(store);
    const [snackVisible, setSnackVisible] = useState(false);

    const shareLink = `https://play.google.com/store/apps/details?id=com.issara&referrer=${me.id}`

    const handleCopy = () => {
        Clipboard.setString(shareLink);
        setSnackVisible(true);
    };

    async function externalShare() {
        try {
            await Share.open({
                message: shareLink,
            });
        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <View style={styles.Root}>
                <View style={styles.topContaienr}>
                    <View style={styles.linkContainer}>
                        <Text 
                            style={styles.linkText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {shareLink}
                        </Text>
                        <Button
                            mode="contained"
                            onPress={handleCopy}
                            style={styles.copyButton}
                            labelStyle={iOSUIKitTall.footnoteEmphasized}
                        >
                            คัดลอก
                        </Button>
                    </View>
                    <QRCode value={shareLink} />
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
                
                <Snackbar
                    visible={snackVisible}
                    onDismiss={() => setSnackVisible(false)}
                    duration={2000}
                    style={styles.snack}
                >
                    คัดลอกลิงก์เรียบร้อยแล้ว
                </Snackbar>

            {/* <View style={styles.bottomContainer}>
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
                /> */}
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
    linkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: iOSColors.customGray,
        borderRadius: 10,
        padding: 10,
        marginVertical: 15,
        width: '90%'
    },
    linkText: {
        flex: 1,
        ...iOSUIKitTall.subheadEmphasized,
        color: iOSColors.black,
        marginRight: 10
    },
    copyButton: {
        backgroundColor: iOSColors.orange,
        borderRadius: 8,
        paddingVertical: 3
    },
    snack: {
        backgroundColor: iOSColors.green
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
