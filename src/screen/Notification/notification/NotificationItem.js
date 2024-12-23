import React, { memo } from 'react';
import {
    StyleSheet,
    View,
    Image
} from 'react-native';

import {
    Card,
    Divider,
    Paragraph,
    Text,
    Avatar,
    Badge,
    Button
} from 'react-native-paper';
import { materialTall, iOSColors } from 'react-native-typography';
import moment from 'moment';
import 'moment/locale/th';
import AvatarWrapper from '../../../component/AvatarWrapper';

moment.locale('th');

function NotificationItem(props) {
    return (
        <View style={styles.root}>
            <View style={styles.card}>
                    <AvatarWrapper
                        size={40}
                        uri={props.avatar}
                        label={props.text[0]}
                    />
                <View style={styles.title}>
                    <Text style={materialTall.subheading}>{props.text}</Text>
                    <Text style={materialTall.caption} >{moment(props.createdAt).fromNow()}</Text>
                </View>
                <View>
                    <Badge visible={props.unseen} size={10} style={styles.badge} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: 'white',
        elevation: 1,
    },
    name: {
        backgroundColor: 'red'
    },
    avatar: {
        marginRight: 16
    },
    badge: {
        backgroundColor: iOSColors.orange,
        marginRight: 16,
        marginLeft: 16
    },
    title: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 16,
        paddingBottom: 5
    },
    optionView: {
        flexDirection: 'row',
    },
    button: {
        flex: 1
    }
})

export default memo(NotificationItem);