
import React,
{
    useEffect,
    useState,
    useContext
} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import {
    Icon
} from 'react-native-elements';
import {
    Button, 
    IconButton,
} from 'react-native-paper';
import CameraRollPicker from 'react-native-camera-roll-picker';
import { stat } from 'react-native-fs';
// import BackgroundUpload from 'react-native-background-upload';
import { useMutation } from '@apollo/client';

import GET_MESSAGES_QUERY from '../graphql/queries/getMessages';
import SEND_MESSAGE_MUTATION from '../graphql/mutations/sendMessage';
import {
    store
} from '../utils/store';

const CameraRollPictureScreen = (props) => {
    const {
        comeFrom,
        imageObjArr,
        room
    } = props.route.params;

    const { state: { me } } = useContext(store);

    const [selected, setSelected] = useState([]);

    const [sendMessage, { sendMessage_data }] = useMutation(SEND_MESSAGE_MUTATION);

    useEffect(() => {
        setSelected(imageObjArr)
    }, [imageObjArr])

    async function modifySelected() {
        const imageObjArr = [];
        for (let item of selected) {
            if(item.fileUri) {
                imageObjArr.push(item);
                continue;
            }
            const fileStat = await stat(item.uri);
            const fileSize = fileStat.size;

            const fileNameArr = item.uri.split('/');
            const fileTypeArr = item.uri.split('.');
            const fileName = fileNameArr[fileNameArr.length - 1];
            const fileType = fileTypeArr[fileTypeArr.length - 1];
            imageObjArr.push({
                fileName: fileName,
                fileType: "video/" + fileType,
                fileUri: item.uri,
                fileSize,
                uri: item.uri
            });
        }
        return imageObjArr;
    }

    async function handleUploadFile() {
        const imageObjArr = await modifySelected();
        uploadFile(imageObjArr);
    }

    async function uploadFile(imageObjArr) {
        try {
            const uploadIdArr = [];
            const mediaName = [];
            for (let [index, item] of imageObjArr.entries()) {
                const options = {
                    url: 'http://localhost:4000/image',
                    path: imageObjArr[index].fileUri,
                    method: 'POST',
                    headers: {
                        'content-type': imageObjArr[index].type, // Customize content-type
                    },
                    field: 'image',
                    // Below are options only supported on Android
                    notification: {
                        enabled: true
                    },
                    useUtf8Charset: true
                }

                // const uploadId = await BackgroundUpload.startUpload(options)

                uploadIdArr.push(uploadId)
                //file url on the cloud
                mediaName.push(imageObjArr[index].fileName);
            }
            // send(mediaName);
            send([
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
            ])
            props.navigation.goBack();
            // props.navigation.navigate(comeFrom, {
            //     fileUrlArr: ['http://localhost:4000/image'],
            //     mediaName
            // });
        } catch (error) {
            console.log(error);
            console.log('at postheader => uploadFile');
        }
    }

    async function send(url) {
        sendMessage({
            variables: {
                pk: room.pk,
                images: url,
            },
            optimisticResponse: {
                __typename: 'Mutation',
                sendMessage: {
                    __typename: 'Message',
                    pk: room.pk,
                    id: 0,
                    senderId: me.id,
                    readId: [me.id],
                    text: null,
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
                        roomId: room.id
                    }
                });

                const data = JSON.parse(JSON.stringify(storedData));
                // addMessage(sendMessage);

                if (!data.getMessages.messages) {
                    store.writeQuery({
                        query: GET_MESSAGES_QUERY,
                        variables: {
                            roomId: room.id
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
                            roomId: room.id
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

    // async function uploadFile(res, imageObjArr) {
    //     try {
    //         const url = [];
    //         const uploadIdArr = [];
    //         for (let [index, item] of res.data.getSignedUrls.entries()) {
    //             const options = {
    //                 url: item,
    //                 path: imageObjArr[index].fileUri.replace("file:/", ""),
    //                 method: 'PUT',
    //                 headers: {
    //                     'content-type': imageObjArr[index].fileType, // Customize content-type
    //                 },
    //                 // Below are options only supported on Android
    //                 notification: {
    //                     enabled: true
    //                 },
    //                 useUtf8Charset: true
    //             }

    //             const uploadId = await BackgroundUpload.startUpload(options)

    //             uploadIdArr.push(uploadId)
    //             const fileUrlArr = item.split('?');
    //             const fileUrl = fileUrlArr[0];
    //             url.push(fileUrl);
    //         }
    //     props.navigation.navigate(comeFrom, {
    //         fileUrlArr: url,
    //         uploadIdArr,
    //     });

    //     } catch (error) {
    //         console.log(error);
    //         console.log('at CameraRollPicture => uploadFile');
    //     }
    // }

    async function confirm() {
        try {
            const imageObjArr = await modifySelected();
            props.navigation.navigate(comeFrom, { imageObjArr })

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View style={styles.root}>
            <View style={styles.header}>
                <IconButton 
                    icon="close"
                    onPress={() => props.navigation.goBack()}
                />
                <Text>
                    {selected.length}/20
                </Text>
                {
                selected.length > 0 && 
                <Icon
                    type="feather"
                    name="check"
                    size={28}
                    style={styles.confirmButton}
                    onPress={() => comeFrom === "ChatRoom"? handleUploadFile() : confirm()}
                />
                }
            </View>
            <CameraRollPicker
                callback={selectedArr => setSelected([...selectedArr])}
                assetType="Photos"
                maximum={20}
                selected={selected}
                emptyText="ไม่พบรูปภาพที่บันทึกไว้"
                selectSingleItem={false}
                selectedMarker={<Icon 
                    color="red" 
                    type="font-awesome" 
                    name="check" 
                    containerStyle={styles.marker}
                    size={10}
                    reverse
                    />}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column'
    },
    header: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        // paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    confirmButton: {
        alignSelf: 'flex-end'
    },
    marker: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: 'white'
    }
});

export default CameraRollPictureScreen;