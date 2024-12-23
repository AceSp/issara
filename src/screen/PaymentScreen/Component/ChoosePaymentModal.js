import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import {
    View,
    StyleSheet,
    Dimensions,
    Text
} from 'react-native';
import {
    Button
} from 'react-native-paper';
import {
    iOSColors,
    iOSUIKit,
    iOSUIKitTall
} from 'react-native-typography';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const id = "mockID";
const amount = 1000;

function ChoosePaymentModal(props) {
    //   const { 
    //     id,
    //     amount
    //   } = props.route.params;

    return (
        <View style={styles.Root}>
            <ScrollView>
                <View style={[styles.box, styles.amountView]}>
                    <Text style={iOSUIKitTall.bodyEmphasized}>จำนวนที่ต้องจ่าย</Text>
                    <Text style={iOSUIKitTall.bodyEmphasized}>{props.amount}</Text>
                    <Text style={iOSUIKitTall.bodyEmphasized}>บาท</Text>
                </View>
                <View style={styles.box}>
                    <Text style={iOSUIKitTall.bodyEmphasized}>
                        ชำระด้วยบัตรเดบิต/เครดิต
                </Text>
                    <Button
                        mode='outlined'
                        style={styles.button}
                    >
                        เพิ่มบัตร
                </Button>
                </View>
                <View style={styles.box}>
                    <Text style={iOSUIKitTall.bodyEmphasized}>
                        ชำระด้วย QR Code
                </Text>
                    <Button
                        onPress={() => {
                            props.setShowModal(false);
                            props.navigation.navigate('QRCode', {
                                pk: props.pk,
                                id: props.id
                            });
                        }}
                        mode='outlined'
                        style={styles.button}
                    >
                        แสดง QR Code
                </Button>
                </View>

            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    Root: {
        backgroundColor: iOSColors.white,
        flex: 1
    },
    box: {
        marginHorizontal: 20,
        marginTop: 20
    },
    amountView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        marginTop: 10
    }
})

export default ChoosePaymentModal;