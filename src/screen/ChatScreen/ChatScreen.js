import React, {
    useEffect, 
    useState,
    useContext
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList
} from 'react-native';
import {
    Avatar,
    TouchableRipple,
    Badge
} from 'react-native-paper';
import {
    iOSColors,
    iOSUIKitTall
} from 'react-native-typography';
import moment from 'moment';

import GET_ROOMS_QUERY from '../../graphql/queries/getRooms';
import Loading from '../../component/Loading';
import {
    useQuery
} from '@apollo/client';
import {
  store
} from '../../utils/store'
import AvatarWrapper from '../../component/AvatarWrapper';

function ListItem(props) {
    const [user, setUser] = useState({});
    const [read, setRead] = useState(false);

    useEffect(() => {
        for (let item of props.room.member)
            if(item.id !== props.me.id) setUser(item);
    }, [props.room.member])

    useEffect(() => {
        if(!props.lastMessage.readId) return;
        for (let item of props.lastMessage.readId)
            if (item === props.me.id) setRead(true);
    }, [props.lastMessage.readId])

    return (
        <TouchableRipple onPress={() => props.navigation.navigate('ChatRoom',
            {
                room: props.room,
                user: user
            })}
        >
            <View style={styles.listItem}>
                <Badge visible={!read} size={10} style={styles.badge} />
                    <AvatarWrapper
                        size={50}
                        uri={user.avatar}
                        label={user.itemName[0]}
                    />
                <View style={styles.listTextView}>
                    <View numberOfLines={1} style={styles.listTopView}>
                        <Text style={iOSUIKitTall.body}>
                            {user.itemName}
                        </Text>
                        <Text style={iOSUIKitTall.caption2} >
                            {moment(props.lastMessage.createdAt).fromNow()}
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={iOSUIKitTall.footnote} >
                        {props.lastMessage.text
                        ? props.lastMessage.text 
                        : `${user.itemName} ได้ส่งรูปภาพ`}
                    </Text>
                </View>
            </View>
        </TouchableRipple>
    );
}

export default function Chat(props) {
    const { state: { me } } = useContext(store);

    const { loading, error, data } = useQuery(GET_ROOMS_QUERY);

    const _renderItem = ({ item }) => <ListItem me={me} {...item} navigation={props.navigation} />
    if (loading) return <Loading />
    if (error) return <View><Text>`Error! ${error.message}`</Text></View>

    return (
        <View style={styles.Root}>
            <FlatList
                // ListHeaderComponent={ }
                contentContainerStyle={{ alignSelf: 'stretch' }}
                data={data.getRooms}
                keyExtractor={item => item.room.id}
                renderItem={_renderItem}
                removeClippedSubviews={true}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Root: {
        flex: 1,
        justifyContent: 'center',
    },
    listItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderWidth: 0.25,
        borderColor: iOSColors.lightGray,
        paddingVertical: 2,
        paddingHorizontal: 10,
        alignItems: 'center'
    },
    badge: {
        alignSelf: 'center',
        marginRight: 10,
        backgroundColor: iOSColors.orange
    },
    listTextView: {
        flex: 1,
        marginLeft: 10,
    },
    listTopView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})