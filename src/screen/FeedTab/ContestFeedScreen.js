import React,
{
    useEffect,
    useState,
    useRef,
    useContext,
    useCallback
} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';
import {
    Button
} from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';
// import BackgroundUpload from 'react-native-background-upload';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_POSTS_QUERY from '../../graphql/queries/getPosts';
import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import CREATE_POST_MUTATION from '../../graphql/mutations/createPost';
import Loading from '../../component/Loading';
import {
    getShowContestData,
    getContestCategoryData,
    store
} from '../../utils/store';
import NewFeedHeader from './Component/NewFeedHeader';
import ContestFeedTopTab from './Component/ContestFeedTopTab';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ContestFeedScreen = (props) => {
    const { state: { me } } = useContext(store);

    const postParam = props.route.params;

    const [showNewPost, setShowNewPost] = useState(false);
    const [category, setCategory] = useState([]);
    const [tab, setTab] = useState(0);

    const [uploadProgress, setUploadProgress] = useState(-1);

    const [seenAd, setSeenAd] = useState([]);

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
        GET_POSTS_QUERY,
        {
            variables: {
                getNewPosts: showNewPost,
                categoryArr: category,
            }
        }
    );

    const [viewPost, { data: view_data, loading: view_loading }] = useMutation(VIEW_POST_MUTATION);
    const [createPost, { createpost_data }] = useMutation(CREATE_POST_MUTATION);

    async function getShow() {
        const showData = getShowContestData();
        if (showData) setShowNewPost(showData);
    }

    async function getCate() {
        const categoryData = JSON.parse(await getContestCategoryData());
        if (categoryData) setCategory(categoryData);
    }
    /* ***********collapsible tab broken now fix later***********
      const { scrollUp, scrollDown } = React.useContext(ScrollContext);
    
      let prevOffset = 0
    
      function checkScroll(e) {
        
        const currentOffset = e.nativeEvent.contentOffset.y
        if((currentOffset - prevOffset) > 50 ) {
          scrollDown();
        } else if((currentOffset - prevOffset) < 100) {
          scrollUp();
        }
        console.log(currentOffset);
        prevOffset = currentOffset;
      }*/

    //const _animatedValue = new Animated.Value(0);

    const flatlistRef = useRef();

    useEffect(() => {
        getShow();
        getCate();

        /* props.navigation.setParams({animatedValue: _animatedValue.interpolate({
            inputRange: [0, 80],
            outputRange: [0, -80],
            extrapolate: 'clamp'
          })
        });*/
    }, []);

    useEffect(() => {
        if (!flatlistRef?.current?.scrollToOffset) return;
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            flatlistRef.current.scrollToOffset({ offset: 0 });
        });

        return unsubscribe;
    }, [props.navigation]);

    // useEffect(() => {
    //     if (postParam?.uploadIdArr) {

    //         if (postParam?.uploadIdArr.length === 0) {
    //             post(postParam?.postText);
    //         }

    //         let progresses = [];
    //         let uploadFinished = 0;
    //         for (let [index, uploadId] of postParam?.uploadIdArr.entries()) {
    //             progresses.push(0);
    //             BackgroundUpload.addListener('progress', uploadId, (data) => {
    //                 progresses[index] = data.progress;
    //                 setUploadProgress(Math.min(...progresses));
    //             })
    //             BackgroundUpload.addListener('error', uploadId, (data) => {
    //                 console.log(`Error: ${data.error}%`)
    //             })
    //             BackgroundUpload.addListener('cancelled', uploadId, (data) => {
    //                 console.log(`Cancelled!`)
    //             })
    //             BackgroundUpload.addListener('completed', uploadId, (data) => {
    //                 // data includes responseCode: number and responseBody: Object
    //                 uploadFinished++;
    //                 if (uploadFinished === postParam?.uploadIdArr.length) {
    //                     post(postParam?.postText);
    //                     setUploadProgress(-1);
    //                 }
    //                 console.log('Completed!');
    //             });
    //         }
    //     }
    // }, [postParam]);

    function loadMore() {
        fetchMore({
            variables: {
                cursor: data.getPosts.pageInfo.endCursor,
                getNewPosts: showNewPost,
                categoryArr: category
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
                const newPosts = fetchMoreResult.getPosts.posts;
                const pageInfo = fetchMoreResult.getPosts.pageInfo;

                return newPosts.length
                    ? {
                        // Put the new.posts at the end of the list and update `pageInfo`
                        // so we have the new `endCursor` and `hasNextPage` values
                        getPosts: {
                            __typename: previousResult.getPosts.__typename,
                            posts: [...previousResult.getPosts.posts, ...newPosts],
                            pageInfo
                        }
                    }
                    : previousResult;
            }
        });
    }

    function post(text) {
        createPost({
            variables: {
                text: text,
                category: postParam?.postCategory,
                mediaName: postParam?.mediaName
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
                    query: GET_POSTS_QUERY,
                    variables: {
                        getNewPosts: showNewPost,
                        categoryArr: category,
                    }
                });

                const data = JSON.parse(JSON.stringify(storedData));
                if (!data.getPosts.posts) {
                    store.writeQuery({
                        query: GET_POSTS_QUERY,
                        variables: {
                            getNewPosts: showNewPost,
                            categoryArr: category,
                        },
                        data: {
                            getUserPosts: {
                                __typename: 'GetPost',
                                pageInfo: { ...data.getPosts.pageInfo },
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
                if (!data.getPosts.posts
                    .find(p => p.postInfo.id === createPost.postInfo.id)) {
                    store.writeQuery({
                        query: GET_POSTS_QUERY,
                        variables: {
                            getNewPosts: showNewPost,
                            categoryArr: category,
                        },
                        data: {
                            getPosts: {
                                __typename: 'GetPosts',
                                pageInfo: { ...data.getPosts.pageInfo },
                                posts: [
                                    {
                                        __typename: 'Post',
                                        postInfo: { ...createPost.postInfo },
                                        relation: { ...createPost.relation }
                                    },
                                    ...data.getPosts.posts
                                ]

                            }
                        }
                    });
                }
            }
        })
    };

    function reload() {
        for (const p of data.getPosts.posts) {
            viewPost({ variables: { id: p.postInfo.id } });
        }
        if (!view_loading) {
            refetch();
        }
    }

    const _getKey = useCallback((item) => item.postInfo.id.toString(), []);

    const _renderItem = useCallback(
        ({ item }) => <FeedCard
            {...item}
            navigation={props.navigation}
            userHaveCoin={me?.userHaveCoin}
            myId={me?.id}
        />, []
    )

    if (loading) return <Loading />
    if (error) return <View><Text>`Error! ${error.message}`</Text></View>

    return (
        <View style={styles.Root}>
            <FlatList
                ListHeaderComponent={
                    <View>
                        <ContestFeedTopTab navigation={props.navigation} />
                        <NewFeedHeader
                            avatar={me?.avatar}
                            navigation={props.navigation}
                            uploadProgress={uploadProgress}
                            screen="Contest"
                        />
                        <Button
                            onPress={() => props.navigation.navigate('Category',
                                {
                                    setShowNewfeed: setShowNewPost,
                                    showNew: showNewPost,
                                    setCate: setCategory,
                                    categ: category,
                                    fromContest: true
                                })
                            }
                            mode="contained"
                        >
                            เลือกหมวดหมู่ที่คุณสนใจ
                        </Button>
                    </View>
                }
                contentContainerStyle={{ alignSelf: 'stretch' }}
                data={data.getPosts.posts}
                keyExtractor={_getKey}
                renderItem={_renderItem}
                onEndReachedThreshold={0.5}
                onEndReached={loadMore()}
                removeClippedSubviews={true}
                refreshing={networkStatus === 4}
                onRefresh={() => reload()}
                ref={flatlistRef}
            //onScrollEndDrag={(e) => checkScroll(e)}
            //onScroll={ Animated.event([{nativeEvent: {contentOffset: {y: _animatedValue}}}]) }
            />
        </View>


    )
}

const styles = StyleSheet.create({
    Root: {
        flex: 1,
        backgroundColor: iOSColors.lightGray,
        justifyContent: 'center'
    }
})

export default ContestFeedScreen;