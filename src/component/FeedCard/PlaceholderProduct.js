import React from 'react';
import {
    StyleSheet,
    Dimensions,
    View,
} from 'react-native';
import {
    Card,
    Divider,
} from 'react-native-paper';
import Skeleton from 'react-native-skeleton-placeholder';
import { colors } from '../../utils/constants';

const { height, width } = Dimensions.get('screen');

function PlaceholderProduct() {
    return (
        <Card
            style={styles.root}>
            <Divider />
            <View style={styles.box}>
                <View 
                    style={{
                        width: width - 20,
                        height: 30,
                        borderRadius: 4,
                        backgroundColor: colors.LIGHT_GRAY
                    }}
                />

            </View>
            <Divider />
            <View style={{ flexDirection: 'row' }}>
                <View 
                    style={{
                        width: 200,
                        height: 130,
                        borderRadius: 4,
                        backgroundColor: colors.LIGHT_GRAY
                    }}
                />

                <View>
                    <View 
                        style={{
                            marginLeft: 10,
                            marginTop: 10,
                            width: 120,
                            height: 20,
                            borderRadius: 4,
                            backgroundColor: colors.LIGHT_GRAY
                        }}
                    />
                    <View 
                        style={{
                            marginLeft: 10,
                            marginTop: 10,
                            width: 120,
                            height: 20,
                            borderRadius: 4,
                            backgroundColor: colors.LIGHT_GRAY
                        }}
                    />
                    <View 
                        style={{
                            marginLeft: 10,
                            marginTop: 10,
                            width: 120,
                            height: 20,
                            borderRadius: 4,
                            backgroundColor: colors.LIGHT_GRAY
                        }}
                    />
                </View>

            </View>
        </Card>

    )
}

const styles = StyleSheet.create({
    root: {
        marginTop: 5,
        padding: 10,
        flexDirection: 'row'
    },
    box: {
        flexDirection: 'row',
        height: 50,
        paddingLeft: 10,
        paddingTop: 10,
    },
    body: {
        height: 100,
        padding: 10
    },
})

export default PlaceholderProduct;