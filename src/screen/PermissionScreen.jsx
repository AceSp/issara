import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { iOSColors, iOSUIKitTall } from 'react-native-typography';

export default function PermissionScreen({
    permissionText,
    requestPermission,
    unbackable,
    navigation
}) {
    return (
        <View style={styles.root}>
            <Text style={styles.text}>{permissionText}</Text>
            <Button labelStyle={styles.button} onPress={requestPermission}>อนุญาติ</Button>
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