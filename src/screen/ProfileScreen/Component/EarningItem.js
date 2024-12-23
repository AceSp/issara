import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    Text
} from 'react-native-elements';
import {
    Card, 
    Divider
} from 'react-native-paper';
import { 
    iOSColors, 
    iOSUIKitTall 
} from 'react-native-typography';
import moment from 'moment';
import formatNumber from '../../../utils/formatNumber';

moment.locale('th');

export default function EarningItem({
    date,
    amount
}) {
    return (
        <View style={styles.root}>
            <Text style={[styles.dateText, iOSUIKitTall.subhead]}>
                {moment(date).format('Do MMMM YYYY')}
            </Text>
            <Text style={[styles.coinText, iOSUIKitTall.subhead]}>
                {formatNumber(amount)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: iOSColors.lightGray2,
        justifyContent: 'space-between'
    },
    dateText: {
        // marginLeft: 20
        flex: 1.5,
        textAlign: 'center',
    },
    coinText: {
        flex: 1,
        textAlign: 'center',
    },
    adText: {
        flex: 1,
        textAlign: 'center',
    },
    sumText: {
        // marginRight: 20
        flex: 1,
        textAlign: 'center',
    }
})



