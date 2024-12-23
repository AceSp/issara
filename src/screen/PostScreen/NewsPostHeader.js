import React from 'react';
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
import { useMutation, useQuery } from '@apollo/client';

import { colors } from '../../utils/constants';
import CREATE_POST from '../../graphql/mutations/createPost';
import GET_NEWS_POSTS_QUERY from '../../graphql/queries/getNewsPosts';
import { TouchableRipple } from 'react-native-paper';
import { iOSColors } from 'react-native-typography';

const AVATAR_SIZE = 40;
const AVATAR_RADIUS = AVATAR_SIZE / 2;

moment.locale('th');

function NewsPostHeader(props) {
    const [createPost, { data }] = useMutation(CREATE_POST);

    const Post = () => {
        createPost({
            variables: {
                text: props.text,
                category: props.category
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
                        title: "",
                        text: props.text,
                        likeCount: 0,
                        coinCount: 0,
                        commentCount: 0,
                        createdAt: new Date(),
                        category: null,
                        topic: null,
                        author: {
                            __typename: 'User',
                            id: Math.round(Math.random() * -1000000).toString(),
                            itemName: props.itemName,
                            avatar: props.avatar,
                            meFollowed: false,
                        }
                    },
                    sponsor: {},
                }
            },
            update: (store, { data: { createPost } }) => {
                const storedData = store.readQuery({
                    query: GET_NEWS_POSTS_QUERY,
                    variables: {
                        getNewPosts: props.showNew,
                        categoryArr: props.feedCategory
                    }
                });
                const data = JSON.parse(JSON.stringify(storedData));
                if (!data.getNewsPosts.posts.find(p => p.postInfo.id === createPost.postInfo.id)) {
                    store.writeQuery({
                        query: GET_NEWS_POSTS_QUERY,
                        variables: {
                            getNewPosts: props.showNew,
                            categoryArr: props.feedCategory
                        },
                        data: {
                            getNewsPosts: {
                                __typename: 'GetPosts',
                                pageInfo: { ...data.getNewsPosts.pageInfo },
                                posts: [
                                    {
                                        __typename: 'Post',
                                        postInfo: { ...createPost.postInfo },
                                        relation: { ...createPost.relation }
                                    },
                                    ...data.getNewsPosts.posts
                                ]

                            }
                        }
                    })
                }
            }
        })
        Keyboard.dismiss();
        props.navigation.navigate('News')
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
                <Text style={styles.metaFullName}>
                    {props.username}
                </Text>
            </View>
            <TouchableOpacity onPress={() => props.navigation.navigate('NewsPostCate',
                {
                    setCate: props.setCategory,
                    cate: props.category
                })}>
                <Text style={{ fontSize: 20 }}>
                    เลือกหมวดหมู่
            </Text>
            </TouchableOpacity>
            <View style={styles.postContainer}>
                <TouchableOpacity
                    onPress={Post}
                    disabled={props.text.length < 1}
                    >
                    <Text style={{ 
                        fontSize: 20, 
                        color: props.text.length < 1? 
                            iOSColors.gray 
                            : 
                            iOSColors.orange 
                        }}>
                        โพสต์
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

export default NewsPostHeader;