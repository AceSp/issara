import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    Icon,
} from 'react-native-elements';
import {
    Button
} from 'react-native-paper';
import { iOSColors, iOSUIKitTall } from 'react-native-typography';

function ShareModal(props) {
    return (
        <View>
            {
                props.comeFromGroup ?
                    <View>
                        <Button
                            onPress={() => props.navigation.navigate('Post', {
                                title: props.title,
                                text: props.text,
                                author: props.author,
                                createdAt: props.createdAt,
                                comeFrom: "NewFeed",
                                isShare: true,
                            })}
                            icon={() => <Icon
                                type="ionicon"
                                name="shapes-outline"
                                size={30}
                                color={iOSColors.gray}
                            />}
                            labelStyle={iOSUIKitTall.title3}
                            contentStyle={styles.shareOptionLabel}
                            style={styles.shareOption}
                        >
                            แชร์ไปยังฟีดทั่วไป
                                </Button>
                        <Button
                            onPress={() => props.navigation.navigate('Post', {
                                title: props.title,
                                text: props.text,
                                author: props.author,
                                createdAt: props.createdAt,
                                comeFrom: "News",
                                isShare: true,
                            })}
                            icon={() => <Icon
                                type="font-awesome"
                                name="newspaper-o"
                                size={30}
                                color={iOSColors.gray}
                            />}
                            labelStyle={iOSUIKitTall.title3}
                            contentStyle={styles.shareOptionLabel}
                            style={styles.shareOption}
                        >
                            แชร์ไปยังฟีดข่าว
                                </Button>
                    </View>
                    : null
            }

            <Button
                onPress={() => props.navigation.navigate('ShareGroup', {
                    title: props.title,
                    text: props.text,
                    author: props.author,
                    createdAt: props.createdAt,
                })}
                icon={() => <Icon
                    type="material-community"
                    name="account-group-outline"
                    size={30}
                    color={iOSColors.gray}
                />}
                labelStyle={iOSUIKitTall.title3}
                contentStyle={styles.shareOptionLabel}
                style={styles.shareOption}
            >
                แชร์ไปยังกลุ่ม
            </Button>
            <Button
                onPress={props.externalShare}
                icon={() => <Icon
                    type="material-community"
                    name="share-outline"
                    size={30}
                    color={iOSColors.gray}
                />}
                labelStyle={iOSUIKitTall.title3}
                contentStyle={styles.shareOptionLabel}
                style={styles.shareOption}
            >
                แชร์ไปยังแอปอื่น
            </Button>
        </View>
    )
}

export default ShareModal;

const styles = StyleSheet.create({
    shareOption: {
        marginLeft: 10,
        alignSelf: 'stretch'
    },
    shareOptionLabel: {
        alignSelf: 'flex-start'
    }
});