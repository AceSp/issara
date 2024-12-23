import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { iOSColors } from 'react-native-typography';

import { colors } from '../utils/constants';
import IssaraLogo from '../assets/Images/IssaraLogo'

export default function FullScreenLoading() {
    return (
        <View style={styles.Root}>
            <IssaraLogo
                width='100%'
                height={300}
            />
            <ActivityIndicator size="large" />
        </View>
    )
}

const styles = StyleSheet.create({
    Root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    Title: {
        color: colors.PRIMARY,
        fontFamily: 'AbrilFatface-Regular',
        fontSize: 60,
    },
})