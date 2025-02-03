import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { iOSColors, iOSUIKitTall } from 'react-native-typography';

export default function PermissionScreen({
    permissionText,
    requestPermission,
    permissionArr,
    unbackable,
    navigation
}) {
    const renderPermissionRequest = () => {
        let arr = [];
        console.log("---------PermissionScreen----------")
        console.log(permissionArr)
        for(const item of permissionArr)
        {
            arr.push(
                <View>
                    <Text style={styles.text}>{item.permissionText}</Text>
                    <Button labelStyle={styles.button} onPress={item.requestPermission}>อนุญาติ</Button>
                    {
                        unbackable 
                        ?
                        null
                        :
                        <Button labelStyle={styles.button} onPress={() => navigation.goBack()}>ย้อนกลับ</Button>
                    }
                </View>
            )
        }
        return arr;
    }
    return (
        <View style={styles.root}>
            {renderPermissionRequest()}
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        ...iOSUIKitTall.subheadEmphasized,
        color: iOSColors.orange
    },
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        ...iOSUIKitTall.title3,
        textAlign: 'center',
        marginBottom: 20
    }
})