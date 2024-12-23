import React, { 
    useEffect, 
    useState 
} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    Image
} from 'react-native';
import {
    Card,
    Divider,
    Button,
    Modal,
    Portal
} from 'react-native-paper';
import { materialTall, iOSColors } from 'react-native-typography';

import PLAY_AD_MUTATION from '../graphql/mutations/playAd';
import PAUSE_AD_MUTATION from '../graphql/mutations/pauseAd';
import { useMutation } from '@apollo/client';
import ChoosePaymentModal from '../screen/PaymentScreen/Component/ChoosePaymentModal';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const AdCard = (props) => {

    const [status, setStatus] = useState('');
    const [waiting, setWaiting] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        switch (props.status) {
            case 'online':
                setStatus('ออนไลน์')
                break;
            case 'checking':
                setStatus('กำลังตรวจสอบ')
                break;
            case 'paying':
                setStatus('รอการชำระเงิน')
                break;
            case 'editing':
                setStatus('รอการแก้ไข')
                break;
            case 'expired':
                setStatus('หมดอายุ')
                break;
            case 'rejected':
                setStatus('ยกเลิก')
                break;
            case 'offline':
                setStatus('หยุด')
                break;
            default:
                break;
        }
        setWaiting(false);
    }, [props.status])

    const [
        playAd,
        {
            data: playPromote_data,
            loading: playPromote_loading,
            error: playPromote_error
        }
    ] = useMutation(PLAY_AD_MUTATION);

    const [
        pauseAd,
        {
            data: pausePromote_data,
            loading: pausePromote_loading,
            error: pausePromote_error
        }
    ] = useMutation(PAUSE_AD_MUTATION);

    const currencyFormat = amount => {
        return '฿' + Number(amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

    const play = () => {
        setWaiting(true);
        playAd({ variables: { pk: props.pk, adId: props.id } });
    }

    const pause = () => {
        setWaiting(true);
        pauseAd({ variables: { pk: props.pk, adId: props.id } });
    }

    const editAd = () => {
        if (props.minuteBudget === null) props.navigation.navigate('UpdatePromote',
            {
                promoteIdParam: props.id,
                idParam: props.shop ? props.shop.id : null,
                budgetParam: props.budget,
                startBudgetParam: props.startBudget,
                nameParam: props.shop ? props.shop.itemName : props.product.itemName,
                tambonParam: props.tambon,
                amphoeParam: props.amphoe,
                changwatParam: props.changwat,
                regionParam: props.region,
                phraseParam: props.phrase,
                descriptionParam: props.text
            });
        else props.navigation.navigate('UpdateSponsor',
            {
                sponsorIdParam: props.id,
                idParam: props.shop ? props.shop.id : null,
                budgetParam: props.budget,
                startBudgetParam: props.startBudget,
                nameParam: props.shop ? props.shop.name : props.product.name,
                tambonParam: props.tambon,
                amphoeParam: props.amphoe,
                changwatParam: props.changwat,
                regionParam: props.region,
                phraseParam: props.phrase,
                descriptionParam: props.text
            })
    }

    return (
        <Card style={styles.Root}>
            <Card.Content>
                <View style={[styles.rowView, styles.topView]}>
                    <View style={styles.metaView}>
                        <Text style={materialTall.caption}>
                            สถานะ
                        </Text>
                        <Text style={
                            status === 'ออนไลน์' ?
                                [materialTall.button, styles.greenText]
                                :
                                status === 'หยุด' ?
                                    [materialTall.button, styles.redText]
                                    :
                                    materialTall.button
                        }>
                            {status}
                        </Text>
                    </View>
                    <View style={styles.metaView}>
                        <Text style={materialTall.caption}>
                            การมองเห็น
                        </Text>
                        <Text style={materialTall.button}>
                            {props.impression}
                        </Text>
                    </View>
                    <View style={styles.metaView}>
                        <Text style={materialTall.caption}>
                            ค่าใช้จ่าย
                        </Text>
                        <Text style={materialTall.button}>
                            {currencyFormat(props.budget)}
                        </Text>
                    </View>
                </View>
                <Divider />
                <View>
                    <Card.Title
                        title={props.isPromote? 'โปรโมท' : 'สนับสนุนคอลัมน์'}
                        subtitle={props.text}
                        subtitleStyle={materialTall.body1}
                        left={
                            (p) => <Image 
                                style={styles.image} 
                                source={props.image}
                                // source={require('../assets/pic/rose-blue-flower-rose-blooms-67636.jpeg')} 
                            />
                        }
                        leftStyle={styles.leftStyle}
                    />
                </View>
                <Divider />
                <Card.Actions style={styles.action}>
                    {
                        status === 'หยุด' && 
                        <Button
                            onPress={() => play()}
                            loading={waiting}
                            icon="play-circle"
                        >
                            ดำเนินการต่อ
                        </Button>
                    }
                    {
                        status === 'ออนไลน์' &&
                        <Button
                            onPress={() => pause()}
                            loading={waiting}
                            icon="pause-circle"
                        >
                            หยุด
                        </Button>
                    }
                    {
                        status === 'รอการชำระเงิน' &&
                        <Button
                            onPress={() => setShowModal(true)}
                            loading={waiting}
                            icon="bank-transfer-out"
                        >
                            ชำระเงิน
                        </Button>
                    }
                    <Button
                        icon="square-edit-outline"
                        onPress={() => editAd()}
                        >
                        แก้ไข
                    </Button>
                </Card.Actions>
            </Card.Content>
            <Portal>
                <Modal 
                    visible={showModal} 
                    contentContainerStyle={styles.modal}
                    onDismiss={() => setShowModal(false)}
                >
                    <ChoosePaymentModal 
                        navigation={props.navigation} 
                        setShowModal={setShowModal}
                        pk={props.pk} 
                        id={props.id} 
                    />
                </Modal>
            </Portal>
        </Card>
    )
}


const styles = StyleSheet.create({
    Root: {
        marginTop: 5,
        height: 190
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    metaView: {
        alignItems: 'center'
    },
    image: {
        height: 60,
        width: 100,
        borderRadius: 5,
        overflow: 'hidden'
    },
    leftStyle: {
        marginRight: 65, 
    },
    topView: {
        alignSelf: 'stretch',
        justifyContent: 'space-around'
    },
    starButtonContainer: {
        width: 100, 
        marginTop: 15
    },
    action: {
        justifyContent: 'flex-end'
    },
    greenText: {
        color: iOSColors.green
    },
    redText: {
        color: iOSColors.orange
    },
    yellowText: {
        color: iOSColors.yellow
    },
    modal: {
        backgroundColor: iOSColors.white,
        minHeight: 270,
        width: width * 0.9,
        alignSelf: 'center'
    }
  })

export default AdCard;