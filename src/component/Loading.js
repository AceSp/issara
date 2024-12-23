import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';


export default function FullScreenLoading() {
    return (
        <View style={styles.Root}>
            <ActivityIndicator size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    Root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})