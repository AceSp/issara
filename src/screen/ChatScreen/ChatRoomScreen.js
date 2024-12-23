import React, {
    useState,
    useContext,
    useEffect,
    memo
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    TextInput,
    SectionList,
    Modal,
    FlatList
} from 'react-native';
import {
    Icon
} from 'react-native-elements';
import { iOSColors } from 'react-native-typography';
import moment from 'moment';
// import BackgroundUpload from 'react-native-background-upload';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
    useQuery,
    useMutation
} from '@apollo/client';

import GET_MESSAGES_QUERY from '../../graphql/queries/getMessages';
import SEND_MESSAGE_MUTATION from '../../graphql/mutations/sendMessage';
import READ_MESSAGE_MUTATION from '../../graphql/mutations/readMessage';
import MESSAGE_SUBSCRIPTION from '../../graphql/subscriptions/messageSub';
import Loading from '../../component/Loading';
import {
    store
} from '../../utils/store'
import Message from './component/MessageItem';

function ChatRoom(props) {
    const param = props.route.params;

    const { state: { me } } = useContext(store);

    const [inputValue, setInputValue] = useState('');
    // const [messageList, setMessageList] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [subMessage, setSubMessage] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(-1);

    const [imageViewVisible, setImageView] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    const [sendMessage, { sendMessage_data }] = useMutation(SEND_MESSAGE_MUTATION);
    const [readMessage, { readMessage_data }] = useMutation(READ_MESSAGE_MUTATION);
    const { loading, error, data, fetchMore, subscribeToMore } = useQuery(
        GET_MESSAGES_QUERY,
        {
            variables: {
                roomId: param.room.id
            },
            // onCompleted: () => {
            //     modifyMessage(data.getMessages.messages);
            // }
        }
    );

    // function modifyMessage(newList) {
    //     for (let item of newList) {
    //         if (item.image) {
    //             item.imageIndex = img.length;
    //             setImageList([...imageList, { url: item.image }]);
    //         }
    //     }
    // }


    // function addMessage(item) {
    //     let date = null;
    //     let list = [...messageList];
    //     if (messageList.length)
    //         date = messageList[0].data[0].createdAt;
    //     const itemDate = moment(item.createdAt);

    //     if (item.image) {
    //         item.imageIndex = imageList.length;
    //         setImageLIst([{ url: item.image }, ...imageList]);
    //     }

    //     //replace optimistic response
    //     if(!list[0].data[0].id) {
    //         list[0].data[0] = item;
    //         return setMessageList(list);
    //     }

    //     if (!date || itemDate.date() !== moment(date).date()) {
    //         date = moment(item.createdAt);
    //         list.unshift({
    //             title: moment(item.createdAt).format('Do MMMM YYYY'),
    //             data: [item]
    //         })
  
    //     } else {
    //         list[0].data.unshift(item);
    //     }
    //     setMessageList(list);
    // }

    function changeRead() {
        let readArr = [];
        for(let i of param.room.member) {
            readArr.push(i.id);
        }
        const list = [...messageList]
        for(let dayList of list) {
            for(let item of dayList.data) {
                if(item.readId.length < 2) 
                    item.readId = readArr;
                else return setMessageList(list);
            }
        }
        setMessageList(list);
    }

    useEffect(() => {
        //if(data) {
        console.log("subscribetomore")
        subscribeToMore({
            document: MESSAGE_SUBSCRIPTION,
            variables: { roomId: param.room.id },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) {
                    return prev;
                }
                const newData = subscriptionData.data.messageSub;
                setSubMessage(newData);

                return {
                    getMessages: {
                        __typename: "GetMessages",
                        pageInfo: prev.getMessages.pageInfo,
                        messages: [newData, ...prev.getMessages.messages]
                    }
                };

            }
        })
        //}
    }, [subscribeToMore])

    useEffect(() => {
        if (!subMessage) return;
        if(subMessage.read) changeRead();
        // else addMessage(subMessage);
    }, [subMessage])

    useEffect(() => {
        if(loading) return;
        const messageId = [];
        console.log("readMessage")
        for(let item of data.getMessages.messages) {
            if(item.senderId !== me.id && !item.readId?.includes(me.id))
                messageId.push(item.id);
        }
        console.log(messageId)
        if(!messageId.length) return;
        readMessage({
            variables: {
                roomId: param.room.id,
                messageId: messageId
            }
        });
    }, [data?.getMessages.messages.length])

    // useEffect(() => {
    //     if (loading) return;
    //     modifyMessage(data.getMessages.messages);
    // }, [])

    // useEffect(() => {
    //     if (param?.uploadIdArr) {
    //         let progresses = [];
    //         let uploadFinished = 0;
    //         for (let [index, uploadId] of param?.uploadIdArr.entries()) {
    //             progresses.push(0);
    //             BackgroundUpload.addListener('progress', uploadId, (data) => {
    //                 // console.log(`Progress: ${data.progress}%`)
    //                 progresses[index] = data.progress;
    //                 setUploadProgress(Math.min(...progresses));
    //             });
    //             BackgroundUpload.addListener('error', uploadId, (data) => {
    //                 console.log(`Error: ${data.error}%`)
    //             })
    //             BackgroundUpload.addListener('cancelled', uploadId, (data) => {
    //                 console.log(`Cancelled!`)
    //             })
    //             BackgroundUpload.addListener('completed', uploadId, (data) => {
    //                 // data includes responseCode: number and responseBody: Object
    //                 uploadFinished++;
    //                 if (uploadFinished === param?.uploadIdArr.length) {
    //                     for (let item of param.fileUrlArr) send(item);
    //                     setUploadProgress(-1);
    //                 }
    //                 console.log('Completed!');
    //             });
    //         }
    //     }
    // }, [param.uploadIdArr]);

    function loadMore() {
        fetchMore({
            variables: {
                roomId: param.room.id,
                cursor: data.getMessages.pageInfo.endCursor,
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const newMessage = fetchMoreResult.getMessages.messages;
                const pageInfo = fetchMoreResult.getMessages.pageInfo;
                // modifyMessage(newMessage);

                return newMessage.length
                    ? {
                        // Put the new.messages at the end of the list and update `pageInfo`
                        // so we have the new `endCursor` and `hasNextPage` values
                        getMessages: {
                            __typename: previousResult.getMessages.__typename,
                            messages: [...previousResult.getMessages.messages, ...newMessage],
                            pageInfo
                        }
                    }
                    : previousResult;
            }
        });
    }

    async function send(url) {
        sendMessage({
            variables: {
                pk: param.room.pk,
                text: url ? null : inputValue,
                images: url ? url : null,
            },
            optimisticResponse: {
                __typename: 'Mutation',
                sendMessage: {
                    __typename: 'Message',
                    pk: param.room.pk,
                    id: 0,
                    senderId: me.id,
                    readId: [me.id],
                    text: inputValue,
                    images: null,
                    video: null,
                    wasRead: null,
                    createdAt: Date.now(),
                }
            },
            update: (store, { data: { sendMessage } }) => {
                const storedData = store.readQuery({
                    query: GET_MESSAGES_QUERY,
                    variables: {
                        roomId: param.room.id
                    }
                });

                const data = JSON.parse(JSON.stringify(storedData));
                // addMessage(sendMessage);

                if (!data.getMessages.messages) {
                    store.writeQuery({
                        query: GET_MESSAGES_QUERY,
                        variables: {
                            roomId: param.room.id
                        },
                        data: {
                            getMessages: {
                                __typename: 'GetMessage',
                                pageInfo: data.getMessages.pageInfo,
                                messages: [
                                    {
                                        __typename: 'Message',
                                        ...sendMessage
                                    },
                                ]

                            }
                        }
                    })
                }
                if (!data.getMessages.messages
                    .find(m => m.id === sendMessage.id)) {
                    store.writeQuery({
                        query: GET_MESSAGES_QUERY,
                        variables: {
                            roomId: param.room.id
                        },
                        data: {
                            getMessages: {
                                __typename: 'GetMessages',
                                pageInfo: data.getMessages.pageInfo,
                                messages: [
                                    {
                                        __typename: 'Message',
                                        ...sendMessage
                                    },
                                    ...data.getMessages.messages,
                                ]

                            }
                        }
                    });
                }
            }
        })
    }

    function onImagePress(index, list) {
        setImageView(true);
        setImageIndex(index);
        const arr = []
        for (let item of list) {
            arr.push({ url: item });
        }
        setImageList(arr);
    }

    const _renderItem = ({ item }) => <Message
            {...item}
            member={param.room.member}
            me={me}
            onImagePress={onImagePress}
            isImSender={item.senderId === me.id ? true : false}
        />

    // const _renderSectionFoot = ({ section: { title } }) => <View style={styles.sectionFoot}>
    //         <Text>{title}</Text>
    //     </View>

    // const _keyExtractor = (item, index) => {
    //     return item.id
    // }

    if (loading) return <Loading />
    if (error) return <View><Text>`Error! ${error.message}`</Text></View>

    // const sec = [
    //     {
    //         title: "date",
    //         data: [{id: "id",text: "hello", createdAt: new Date()}]
    //     }
    // ]
    return (
        <View style={styles.Root}>
            <Modal
                onRequestClose={() => setImageView(false)}
                visible={imageViewVisible}
                transparent={imageViewVisible}>
                <ImageViewer
                    imageUrls={imageList}
                    index={imageIndex}
                    onCancel={() => setImageView(false)}
                    enableSwipeDown={true}
                    enablePreload={true}
                />
            </Modal>
            {/* <SectionList
                inverted
                contentContainerStyle={styles.flatList}
                onEndReached={() => data.getMessages.pageInfo.hasNextPage ? loadMore() : null}
                onEndReachedThreshold={0.7}
                sections={data.getMessages.messages}
                keyExtractor={_keyExtractor}
                removeClippedSubviews={true}
                initialNumToRender={20}
                renderItem={_renderItem}
                renderSectionFooter={_renderSectionFoot}
            /> */}
            <FlatList
                inverted
                contentContainerStyle={styles.flatList}
                onEndReached={() => data.getMessages.pageInfo.hasNextPage ? loadMore() : null}
                onEndReachedThreshold={0.7}
                data={data.getMessages.messages}
                keyExtractor={item => item.id}
                removeClippedSubviews={true}
                initialNumToRender={20}
                renderItem={_renderItem}
            />
            <KeyboardAvoidingView
                style={{ backgroundColor: '#FFF' }}
                alwaysVisible
                avoidKeyboard
                bumperHeight={30}
                hideBorder
            >
                <View style={styles.accessoryContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            props.navigation.navigate('CameraRollPicture', {
                                comeFrom: 'ChatRoom',
                                imageObjArr: [],
                                room: param.room
                            });
                        }}
                        style={styles.buttonSend}
                    >
                        <Icon
                            name="image"
                            size={25}
                            color={iOSColors.gray}
                        />
                    </TouchableOpacity>
                    <TextInput
                        multiline
                        onChangeText={(text) => setInputValue(text)}
                        value={inputValue}
                        placeholder={'Message'}
                        placeholderTextColor={'#9D9FA3'}
                        style={styles.input}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            send();
                            setInputValue('');
                        }}
                        style={[styles.buttonSend, { opacity: inputValue ? 1 : 0.5 }]}
                        disabled={!inputValue}
                    >
                        <Icon
                            name="send"
                            size={25}
                            color={iOSColors.orange}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    Root: {
        flex: 1,
        backgroundColor: 'white'
    },
    flatList: {
        flexGrow: 1,
        justifyContent: 'flex-end'
    },
    roomName: {
        marginLeft: 20,
        fontSize: 20
    },
    accessoryContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    input: {
        flex: 1,
        borderRadius: 18,
        paddingBottom: 6,
        paddingTop: 5,
        paddingHorizontal: 12,
        marginHorizontal: 12,
        fontSize: 17,
        flexGrow: 1,
        lineHeight: 20,
        maxHeight: 100,
        minHeight: 36,
        color: '#262626',
        backgroundColor: '#F2F3F5'
    },
    buttonSend: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        width: 32,
        height: 32,
        borderRadius: 32,
    },
    sectionFoot: {
        alignSelf: 'center',
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: "stretch",
        flexWrap: 'wrap',
        backgroundColor: iOSColors.lightGray
    }
})

export default memo(ChatRoom);