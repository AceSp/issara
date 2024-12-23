import React, { 
    Component, 
    useEffect, 
    useContext,
    useState
} from 'react';
import {
    View,
    ScrollView,
    SectionList
} from 'react-native';
import { Avatar, Text } from 'react-native-elements';

import ProfileHeader from './Component/ProfileHeader';
import ME_SUBSCRIPTION from '../../graphql/subscriptions/meSub';
import GET_ME_QUERY from '../../graphql/queries/getMe';
import GET_USER_POST_QUERY from '../../graphql/queries/getUserPosts';
import FeedCard from '../../component/FeedCard/FeedCard';
import { useQuery } from '@apollo/client';
import Loading from '../../component/Loading';
import { store } from '../../utils/store';
import UserHeader from './Component/UserHeader';

export default function UserProfileScreen(props) {

    const param = props.route.params;

    const { state: { me } } = useContext(store);

    const [uploadProgress, setUploadProgress] = useState(-1);

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
        GET_USER_POST_QUERY,
        {
            variables: { userId: me.id }
        }
    );

    useEffect(() => {
        console.log('start')
        if (param?.uploadIdArr) {

            if (param?.uploadIdArr.length === 0) {
                post(param?.postText);
            }

            let progresses = [];
            let uploadFinished = 0;
            for (let [index, uploadId] of param?.uploadIdArr.entries()) {
                progresses.push(0);
                BackgroundUpload.addListener('progress', uploadId, (data) => {
                    // console.log(`Progress: ${data.progress}%`)
                    progresses[index] = data.progress;
                    setUploadProgress(Math.min(...progresses));
                })
                BackgroundUpload.addListener('error', uploadId, (data) => {
                    console.log(`Error: ${data.error}%`)
                })
                BackgroundUpload.addListener('cancelled', uploadId, (data) => {
                    console.log(`Cancelled!`)
                })
                BackgroundUpload.addListener('completed', uploadId, (data) => {
                    // data includes responseCode: number and responseBody: Object
                    uploadFinished++;
                    if (uploadFinished === param?.uploadIdArr.length) {
                        post(param?.postText);
                        setUploadProgress(-1);
                    }
                    console.log('Completed!');
                });
            }
        }
    }, [param]);

    function post(text) {
        createPost({
            variables: {
                text: text,
                category: param?.postCategory,
                mediaName: param?.mediaName
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
                        title: null,
                        likeCount: 0,
                        coinCount: 0,
                        commentCount: 0,
                        createdAt: new Date(),
                        category: null,
                        author: {
                            __typename: 'User',
                            id: Math.round(Math.random() * -1000000).toString(),
                            itemName: me?.itemName,
                            avatar: me?.avatar,
                            meFollowed: false,
                        }
                    },
                    sponsor: {},
                }
            },
            update: (store, { data: { createPost } }) => {
                const storedData = store.readQuery({
                    query: GET_USER_POST_QUERY,
                    variables: {
                        userId: me.id
                    }
                });

                const data = JSON.parse(JSON.stringify(storedData));
                if (!data.getUserPosts.posts) {
                    store.writeQuery({
                        query: GET_USER_POST_QUERY,
                        variables: {
                            getNewPosts: showNewPost,
                            categoryArr: category,
                        },
                        data: {
                            getUserPosts: {
                                __typename: 'GetPost',
                                pageInfo: { ...data.getUserPosts.pageInfo },
                                posts: [
                                    {
                                        __typename: 'Post',
                                        postInfo: { ...createPost.postInfo },
                                        relation: { ...createPost.userRelation }
                                    },
                                ]

                            }
                        }
                    })
                }
                if (!data.getUserPosts.posts
                    .find(p => p.postInfo.id === createPost.postInfo.id)) {
                    store.writeQuery({
                        query: GET_USER_POST_QUERY,
                        variables: {
                            getNewPosts: showNewPost,
                            categoryArr: category,
                        },
                        data: {
                            getUserPosts: {
                                __typename: 'GetPosts',
                                pageInfo: { ...data.getUserPosts.pageInfo },
                                posts: [
                                    {
                                        __typename: 'Post',
                                        postInfo: { ...createPost.postInfo },
                                        relation: { ...createPost.relation }
                                    },
                                    ...data.getUserPosts.posts
                                ]

                            }
                        }
                    });
                }
            }
        })
    };

    function loadMore() {
        fetchMore({
            variables: {
                id: me.id,
                cursor: data.getUserPosts.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const newPosts = fetchMoreResult.getUserPosts.posts;
                const pageInfo = fetchMoreResult.getUserPosts.pageInfo;

                return newPosts.length
                    ? {
                        // Put the new.posts at the end of the list and update `pageInfo`
                        // so we have the new `endCursor` and `hasNextPage` values
                        getUserPosts: {
                            __typename: previousResult.getUserPosts.__typename,
                            posts: [...previousResult.getUserPosts.posts, ...newPosts],
                            pageInfo
                        }
                    }
                    : previousResult;
            }
        });
    }

    const _renderItem = ({ item }) => <FeedCard
        userHaveCoin={me.userHaveCoin}
        navigation={props.navigation}
        {...item} />

    if (loading) return (
        <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}>
            <Loading />
        </View>
    )
    if (error) return <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}><Text>`Error! ${error.message}`</Text></View>
    if (!loading && !data.getUserPosts.posts) {
        return (
            <ScrollView>
                <UserHeader
                    userData={me}
                    navigation={props.navigation}
                    me_following={me.following}
                />
                <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <Text>ยังไม่มีโพสต์</Text>
                </View>
            </ScrollView>

        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f1f6f8' }} >
            <SectionList
                ListHeaderComponent={
                    <UserHeader
                        isMe={true}
                        userData={me}
                        navigation={props.navigation}
                    />}
                contentContainerStyle={{ alignSelf: 'stretch' }}
                sections={data.getUserPosts.posts}
                keyExtractor={item => item.postInfo.id}
                renderItem={_renderItem}
                onEndReachedThreshold={0.9}
                onEndReached={() => data.getUserPosts.pageInfo.hasNextPage ? loadMore() : null}
                removeClippedSubviews={true}
                refreshing={networkStatus === 4}
                onRefresh={() => refetch()}
            />

        </View>
    )
}

