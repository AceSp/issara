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

const { height, width } = Dimensions.get('screen');

function PlaceholderCard() {
    return (
        <Card
            style={{ marginTop: 5 }}>
            <Divider />
            <View style={styles.box}>
                <Skeleton>
                    <Skeleton.Item
                        width={width - 20}
                        height={30}
                        borderRadius={4}
                    />
                </Skeleton>
            </View>
            <Divider />
            <View style={styles.body}>

            </View>
            <Divider />
            <View style={styles.box}>
                <Skeleton>
                    <Skeleton.Item
                        borderRadius={50}
                        width={40}
                        height={40}
                    />
                </Skeleton>
                <View style={{ marginLeft: 10 }}>
                <Skeleton>
                    <Skeleton.Item
                        borderRadius={4}
                        width={300}
                        height={20}
                    />
                </Skeleton>
                <Skeleton>
                    <Skeleton.Item
                        borderRadius={4}
                        marginTop={5}
                        width={200}
                        height={10}
                    />
                </Skeleton>

                </View>
            </View>
            <View style={styles.box}>
                <Skeleton>
                    <Skeleton.Item
                        width={width - 20}
                        height={30}
                        borderRadius={4}
                    />
                </Skeleton>
            </View>
            <Divider />
        </Card>

    )
}

const styles = StyleSheet.create({
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

export default PlaceholderCard;