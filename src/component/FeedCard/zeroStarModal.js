import React from 'react';
import { StyleSheet, View, Text} from 'react-native';

import { colors } from '../../utils/constants'
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function ZeroStarModal() {
    return (
        <View style={styles.Root}>
            <View style={styles.top}>
                <Text style={[styles.text, styles.header]} >
                    ไม่มีดาว
                </Text>
                <Text style={[styles.text, styles.detail]} >
                    คุณไม่มีดาวอยู่เลย 
                    ต้องการซื้อเพิ่มหรือไม่
                </Text>
            </View>
            <View style={styles.bottom}>
                <View style={styles.left}>
                    <TouchableHighlight 
                    onPress={()=> {}} 
                    style={styles.buttonLeft} 
                    underlayColor={colors.LIGHT_RED_2}
                    >
                    <Text style={[styles.text, styles.buttonText]} >ซื้อเลย</Text>
                    </TouchableHighlight>
                    
                </View>
                <View style={styles.right}>
                    <TouchableHighlight 
                    onPress={()=> {}} 
                    style={styles.buttonRight}
                    underlayColor={colors.LIGHT_RED_2} 
                    >
                    <Text style={[styles.text, styles.buttonText]} >เอาไว้ก่อน</Text>
                    </TouchableHighlight>    
                </View>
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    Root:{
        width: 300,
        height: 150,
        backgroundColor: colors.LIGHT_RED,
        borderRadius: 20
    },
    top:{
        flex: 2,
        borderBottomWidth: 0.2,
    },
    bottom:{
        flex: 1,
        flexDirection: 'row'
    },
    left:{
        flex: 1,
        borderRightWidth: 0.2
    },
    buttonLeft: {
        height: 50, 
        borderBottomLeftRadius: 20
    },
    right:{
        flex: 1,
    },
    buttonRight: {
        height: 50, 
        borderBottomRightRadius: 20
    },
    text: {
        textAlign: 'center',
    },
    header: {
        marginTop: 15,
        fontSize: 24,
        fontWeight: 'bold'
    },
    detail: {
        marginTop: 10,
        fontSize: 16,
    },
    buttonText: {
        marginTop: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.BUTTON_RED
    }
    
});