import React, { 
    Component, 
    useContext, 
    useEffect,
    useState
} from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { 
    iOSColors, 
    iOSUIKitTall,
} from 'react-native-typography';

import { store } from '../../utils/store';
import EarningItem from './Component/EarningItem';
import Loading from '../../component/Loading';

export default function UserIncomeScreen(props) {

    const { state: { me } } = useContext(store);

    function renderTable() {
        if(!me) return;
        let arr = [];
        for (const item of me.earningHistory) {
        arr.push(
            <EarningItem 
                key={item.date}
                date={item.date} 
                coinEarning={item.coinEarning}
                adEarning={item.adEarning}
            />
        )
        }
        return arr;
    }

    return (
        <View style={styles.root} >
            <View style={styles.header}>
                <Text style={[styles.dateText, iOSUIKitTall.subheadEmphasized]}>
                    วันที่
                </Text>
                <Text style={[styles.coinText, iOSUIKitTall.subheadEmphasized]}>
                    เหรียญ
                </Text>
                <Text style={[styles.adText, iOSUIKitTall.subheadEmphasized]}>
                    โฆษณา
                </Text>
                <Text style={[styles.sumText, iOSUIKitTall.subheadEmphasized]}>
                    รวม
                </Text>
            </View>
            {renderTable()}
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: iOSColors.white
    },
    header: {
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


