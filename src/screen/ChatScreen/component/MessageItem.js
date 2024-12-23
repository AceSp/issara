import React, {
    useState,
    useEffect,
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import moment from 'moment';
import {
    iOSColors,
    materialTall
} from 'react-native-typography';
import { Avatar } from 'react-native-paper';

import { colors } from '../../../utils/constants';
import AvatarWrapper from '../../../component/AvatarWrapper';

const { height, width } = Dimensions.get('screen');

function MessageItem(props) {
    const [author, setAuthor] = useState({});
    const [read, setRead] = useState(false);
    const [imgHeight, setImgHeight] = useState(0);

    useEffect(() => {
        for (let item of props.member)
            if (item.id === props.senderId) setAuthor(item);
    }, [props.member]);

    useEffect(() => {
        if (!props.readId) return;
        for (let item of props.readId) {
            if (item !== props.me.id) 
                setRead(true);
        }
    }, [props.readId]);

    function setImageHeight(evt) {
        setImgHeight(
            evt.nativeEvent.height / evt.nativeEvent.width * 250
        );
    }

    function renderImageList() {
        if(!props.images) return null;
        return props.images.map((i, index) => {
            if(!i.length) 
                return (
                    <View 
                    key={index}>
                    </View>
                )
            return (
                <TouchableWithoutFeedback
                    key={i}
                    onPress={() => props.onImagePress(index, props.images)}
                >
                    <Image
                        style={[ 
                            props.images.length === 1
                            ? { 
                                borderRadius: 5,
                                margin: 1,
                                height: imgHeight,
                                width: 250,
                            }
                            : (index === props.images.length-1) && (props.images.length%2)
                            ? {
                                borderRadius: 5,
                                margin: 1,
                                height: 125,
                                width: 250,
                            }
                            : {
                                borderRadius: 5,
                                margin: 1,
                                height: 125,
                                width: 125,
                            }
                        ]}
                        resizeMode={Image.resizeMode.cover}
                        source={{ uri: i }}
                        onLoad={evt => {
                            if(props.images.length === 1)
                                setImageHeight(evt)
                        }}
                    />
                </TouchableWithoutFeedback>
            )
        });
    }

    return (
        <View style={[
            styles.container, 
            { 
                alignSelf: props.isImSender ? 'flex-end' : 'flex-start',
                justifyContent: props.isImSender ? 'flex-end' : 'flex-start',
            }
            ]}>
            {
                !props.isImSender ?
                    <AvatarWrapper
                        size={30}
                        style={styles.avatar}
                        uri={props.avatar}
                        label={author.itemName[0]}
                    />
                : null
            }
            <View style={styles.bubbleSize}>
                <View style={styles.bubbleTime}>
                    {
                        (props.isImSender && read) ?
                        <Text style={[materialTall.caption, styles.bubbleTimeText]}>
                            อ่านแล้ว
                    </Text>
                        : null
                    }
                    {
                        props.isImSender ?
                        <Text style={[
                            materialTall.caption,
                            styles.bubbleTimeText,
                        ]}>
                            {moment(props.createdAt).format('LT')}
                        </Text>
                        : null
                    }
                </View>
                {
                    props.text ?
                    <View style={[
                        styles.bubble,
                        { backgroundColor: props.isImSender ? colors.LIGHT_RED : iOSColors.lightGray }
                    ]}>
                        <View style={{ flexShrink: 1 }}>
                            {(!props.isImSender && props.member.length > 2) && (
                                <Text style={styles.senderName}>
                                    {author.itemName}
                                </Text>
                            )}
                            <Text style={[
                                styles.messageText,
                            ]}>
                                {props.text}
                            </Text>
                        </View>
                    </View>
                    : null
                }
                {
                    props.images ?
                    <View style={styles.imageList}>
                        {renderImageList()}
                    </View>
                    : null
                }
                <View style={styles.bubbleTime}>
                    {
                        !props.isImSender ?
                        <Text style={[
                            materialTall.caption,
                            styles.bubbleTimeText,
                            { alignSelf: 'flex-start' }
                        ]}>
                            {moment(props.createdAt).format('LT')}
                        </Text>
                        : null
                    }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 12,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'flex-start',
        maxWidth: '80%',
    },
    avatar: {
        paddingRight: 12,
        alignSelf: 'flex-start'
    },
    bubble: {
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: "stretch",
        flexWrap: 'wrap',
    },
    bubbleSize: {
        flexDirection: 'row',
    },
    senderName: {
        fontSize: 15,
        lineHeight: 20,
        fontWeight: '500'
    },
    messageText: {
        fontSize: 17,
        lineHeight: 22,
        fontWeight: '400'
    },
    bubbleTime: {
        marginBottom: 5,
        alignSelf: 'flex-end',
    },
    bubbleTimeText: {
        position: 'relative',
        lineHeight: 18,
        top: 2,
        fontSize: 13,
        paddingHorizontal: 8,
        fontWeight: '400',
        alignSelf: 'flex-end'
    },
    pictureWrapper: {
        backgroundColor: '#597fab',
        width: 32,
        height: 32,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pictureLetter: {
        fontWeight: '500',
        fontSize: 12,
        color: '#fff'
    },
    image: {
        borderRadius: 5,
        margin: 1,
    },
    imageList: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        maxWidth: 255
    }
});

export default MessageItem;