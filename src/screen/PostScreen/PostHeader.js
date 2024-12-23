import React,
{
    useContext
}
from 'react';
import {
    Text,
    Keyboard,
    TouchableOpacity,
    StyleSheet,
    View
} from 'react-native';
import {
    Avatar,
    Icon
} from 'react-native-elements';

import moment from 'moment';
import 'moment/locale/th';
import { useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';
import { TouchableRipple } from 'react-native-paper';
// import BackgroundUpload from 'react-native-background-upload';

import { colors, imageUrl, mediaUrl, videoUrl } from '../../utils/constants';
import CREATE_POST from '../../graphql/mutations/createPost';
import GET_POSTS_QUERY from '../../graphql/queries/getPosts';
import GET_SIGNED_URL_MUTATION from '../../graphql/mutations/getSignedUrls';
import { readDir, readFile } from 'react-native-fs';
import { store } from '../../utils/store';

moment.locale('th');
const FILE_CHUNK_SIZE = 10000000;

function PostHeader(props) {
    const [createPost, { data }] = useMutation(CREATE_POST, {
        onCompleted: () => props.navigation.navigate(props.comeFrom)
    });
    const [getSignedUrl, { data: data_url }] = useMutation(GET_SIGNED_URL_MUTATION);

    const { state: { me } } = useContext(store);

    function updateNewFeedScreen(store, createPost) {
        const storedData = store.readQuery({
            query: GET_POSTS_QUERY
        });

        const data = JSON.parse(JSON.stringify(storedData));
        if (!data.getPosts.sections.find(
        item => item.data.find(p => p.postInfo.id === createPost.postInfo.id))) {
            data.getPosts.sections[0].data.unshift(createPost);
            store.writeQuery({
                query: GET_POSTS_QUERY,
                data: {
                getPosts: {
                    __typename: 'GetPosts',
                    pageInfo: data.getPosts.pageInfo,
                    sections: data.getPosts.sections,
                }
                }
            })
        }
    }

    function updateUserProfileScreen(store, createPost) {
        const storedData = store.readQuery({
            query: GET_USER_POSTS_QUERY,
            variables: {
                id: props.me.id
            }
        });

        const data = JSON.parse(JSON.stringify(storedData));
        if (!data.getUserPosts.sections.length) {
            data.getPosts.sections[0].data[0] = createPost
            store.writeQuery({
                query: GET_POSTS_QUERY,
                data: {
                getPosts: {
                    __typename: 'GetPosts',
                    pageInfo: data.getPosts.pageInfo,
                    sections: data.getPosts.sections,
                }
                }
            })
        } else if (!data.getPosts.sections.find(
            item => item.data.find(p => p.postInfo.id === createPost.postInfo.id))) {
                data.getPosts.sections[0].data.unshift(createPost);
                store.writeQuery({
                    query: GET_POSTS_QUERY,
                    data: {
                    getPosts: {
                        __typename: 'GetPosts',
                        pageInfo: data.getPosts.pageInfo,
                        sections: data.getPosts.sections,
                    }
                    }
                })
        }
    }

    function handleUpdateAfterPost(store, createPost) {
        switch (props.comeFrom) {
            case "NewFeed":
                updateNewFeedScreen(store, createPost);
                break;
            case "UserProfile":
                updateUserProfileScreen(store, createPost);
                break;
            default:
                console.log("invalid screen name");
                console.log("error from postheader");
                break;
        }
    }

    function handleUploadFile() {
        Keyboard.dismiss();

        if(!props.hasText) 
            return props.setSnackVisible(true);

        if(props.comeFrom === 'CreatePromote') 
            return props.navigation.navigate('CreatePromote', {
                textParam: props.body,
                mediaObjArrParam: props.mediaObjArr,
                mediaSrcArrParam: props.mediaSrcArr
            });

        if(!props.mediaObjArr?.length) return post({text: props.body});

        uploadFile()
    }

    async function uploadFile() {
        try {
            let text = props.body;
            const uploadIdArr = [];
            const mediaName = [];
            for (let [index, item] of props.mediaObjArr.entries()) {
                const options = {
                    url: props.mediaObjArr[index].type === 'video/mp4' ? videoUrl : imageUrl,
                    path: props.mediaObjArr[index].fileUri,
                    type: 'multipart',
                    method: 'POST',
                    headers: {
                        'content-type': props.mediaObjArr[index].type, // Customize content-type
                    },
                    field: props.mediaObjArr[index].type === 'video/mp4' ? 'video' : 'image',
                    // Below are options only supported on Android
                    notification: {
                        enabled: true
                    },
                    useUtf8Charset: true
                }

                // const uploadId = await BackgroundUpload.startUpload(options)

                uploadIdArr.push(uploadId)
                //file url on the cloud
                const fileUrl = `${mediaUrl}/${me.id}/${props.mediaObjArr[index].name}`
                mediaName.push(props.mediaObjArr[index].name);
                text = text
                    .replace(
                        props.mediaSrcArr[index],
                        fileUrl
                        // item.url + '/' + fields.key
                    )
            }
            props.navigation.navigate(props.comeFrom, {
                postText: text,
                uploadIdArr,
                mediaName
            });
        } catch (error) {
            console.log(error);
            console.log('at postheader => uploadFile');
        }
    }

    async function post({
        text,
        uploadIdArr
    }) {
        await createPost({
            variables: {
                text,
            },
            optimisticResponse: {
                __typename: 'Mutation',
                createPost: {
                    __typename: 'Post',
                    relation: {
                        __typename: 'Relation',
                        id: Math.round(Math.random() * -1000000).toString(),
                        isLiked: false,
                        isCoined: null,
                        isViewed: null,
                        isSaved: null,
                        userCoinCount: null
                    },
                    postInfo: {
                        __typename: 'PostInfo',
                        id: Math.round(Math.random() * -1000000).toString(),
                        text: text,
                        likeCount: 0,
                        coinCount: 0,
                        commentCount: 0,
                        createdAt: new Date(),
                        author: {
                            __typename: 'User',
                            id: Math.round(Math.random() * -1000000).toString(),
                            itemName: props.itemName,
                            avatar: props.avatar,
                            meFollowed: false,
                        }
                    },
                    sponsor: null
                }
            },
            update: (store, { data: { createPost } }) => {
                if(props.isShare) return;
                handleUpdateAfterPost(store, createPost)
            }
        })
        Keyboard.dismiss();
    };

    return (
        <View style={styles.Root}>
            <View style={styles.backButton}>
                <TouchableRipple onPress={() => props.navigation.goBack()}>
                    <Icon name="arrow-back" style={{ padding: 8 }} />
                </TouchableRipple>
            </View>
            <View style={styles.avatarContainer}>
                <Avatar
                    rounded
                    containerStyle={styles.avatar}
                    source={props.avatar ? { uri: props.avatar } : require('../../assets/pic/profile.jpg')} />
            </View>
            <View style={styles.metaContainer}>
                <Text numberOfLines={1} style={styles.metaFullName}>
                    {props.itemName}
                </Text>
            </View>
            <View style={styles.postContainer}>
                <TouchableOpacity
                    onPress={handleUploadFile}
                >
                    <Text style={{
                        fontSize: 20,
                        color: (props.comeFrom === 'CreatePromote' && props.hasText)
                            ? iOSColors.orange
                            : props.hasText
                                ? iOSColors.orange : iOSColors.lightGray2
                        }}>
                        ตกลง
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    Root: {
        flexDirection: 'row',
        alignItems: "center",
        padding: 5,
    },
    avatarContainer: {
        flex: 0.2,
        paddingLeft: 5,
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    avatar: {
        height: 40,
        width: 40
    },
    metaContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        marginLeft: 20
    },
    metaFullName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postButton: {
        width: 80,
        height: 40,
        borderRadius: 25,
        borderWidth: 0.5,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    disableButtonColor: {
        backgroundColor: '#ff9191'
    },
    buttonColor: {
        backgroundColor: colors.PRIMARY
    },
    postContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    backButton: {
        borderRadius: 500,
        overflow: "hidden"
    }
})

export default PostHeader;