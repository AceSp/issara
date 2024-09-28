import React, { 
    Component, 
    useContext, 
    useEffect,
    useState
} from 'react';
import {
    ScrollView,
    FlatList,
    View,
    Text
} from 'react-native';
import UserHeader from './Component/UserHeader';
// import BackgroundUpload from 'react-native-background-upload';

import GET_USER_QUERY from '../../graphql/queries/getUser';
import GET_USER_POST_QUERY from '../../graphql/queries/getUserPosts';
import VideoPreviewItem from './Component/VideoPreviewItem';
import { useQuery } from '@apollo/client';
import Loading from '../../component/Loading';
import { store } from '../../utils/store';

const testPosts = [
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:21.931Z@USER#7139631289313379334",
            "text": "🫦 | #lips #lipsASMR #lipexfoliator #lipcare #lipcareroutine #ASMR \n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/7139631289313379334/7378539209621015840/7378539209621015840_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/7139631289313379334/7378539209621015840/7378539209621015840_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/7139631289313379334/7378539209621015840/7378539209621015840_0.jpg",
            "pinLocation": {
              "lat": 13.685211319346822,
              "lon": 100.59778222689187
            },
            "author": {
              "id": "USER#7139631289313379334",
              "itemName": "by.fannys",
              "avatar": "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/3dbbc56a25ae9dbf60bc55df4d6357e7~c5_100x100.jpeg?lk3s=a5d48078&nonce=39431&refresh_token=d04f1abae26f92d232b6576447f0155b&x-expires=1718874000&x-signature=tfbn%2B7pYpdnPdZKwKY2N965hTxw%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.054Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://avatars.githubusercontent.com/u/61533720"
            },
            "product": null
          }
        },
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:21.718Z@USER#7090113925819794459",
            "text": "I love Highway Cafe #ceasefire #ลูกรักไฮเวย์ \n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/7090113925819794459/7375098927843921153/7375098927843921153_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/7090113925819794459/7375098927843921153/7375098927843921153_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/7090113925819794459/7375098927843921153/7375098927843921153_0.jpg",
            "pinLocation": {
              "lat": 13.661540647003907,
              "lon": 100.47961361123764
            },
            "author": {
              "id": "USER#7090113925819794459",
              "itemName": "highwaycafe_th",
              "avatar": "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/a77ce56e1715ce3919d87710500500bd~c5_100x100.jpeg?lk3s=a5d48078&nonce=13700&refresh_token=f92346f4db8677eb65edb86fcffa1407&x-expires=1718874000&x-signature=sz6c00jiJaVPs%2Fo9ZHtns%2FK2UD4%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.393Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://avatars.githubusercontent.com/u/15722832"
            },
            "product": null
          }
        },
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:20.672Z@USER#7163365865122874373",
            "text": "BUZZ CUT 😱😳❌❌ #hairstyle #tutorial #haircut \n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/7163365865122874373/7352908196291431712/7352908196291431712_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/7163365865122874373/7352908196291431712/7352908196291431712_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/7163365865122874373/7352908196291431712/7352908196291431712_0.jpg",
            "pinLocation": {
              "lat": 13.782276610545868,
              "lon": 100.5714349219537
            },
            "author": {
              "id": "USER#7163365865122874373",
              "itemName": "enivnt",
              "avatar": "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/3aca1a75fb02bd23b41278a2d04a04ef~c5_100x100.jpeg?lk3s=a5d48078&nonce=54843&refresh_token=10329eb24bd64f9b7d537ee4ef42644c&x-expires=1718874000&x-signature=9r6XX93fM6QpYoiR5WzfzQmyqAA%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.397Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://avatars.githubusercontent.com/u/44135032"
            },
            "product": null
          }
        },
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:20.394Z@USER#7361083554079212586",
            "text": "OMG 🙀 1 minutes amazing fruit \n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/7361083554079212586/7368688841277836586/7368688841277836586_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/7361083554079212586/7368688841277836586/7368688841277836586_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/7361083554079212586/7368688841277836586/7368688841277836586_0.jpg",
            "pinLocation": {
              "lat": 13.2867775459458,
              "lon": 100.02210455137417
            },
            "author": {
              "id": "USER#7361083554079212586",
              "itemName": "hoaqundte0a",
              "avatar": "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/141d205024b8fc0a8c50d08504ba3620~c5_100x100.jpeg?lk3s=a5d48078&nonce=33673&refresh_token=d3213f18513f754d08b2f4de5aab5b18&x-expires=1718874000&x-signature=gatMYR3nV%2BAixOazVj5Cn4S1LLc%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.402Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1208.jpg"
            },
            "product": null
          }
        },
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:20.004Z@USER#7360108570610517000",
            "text": "#หม่ําจ๊กมก #fyp \n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/7360108570610517000/7360658571220028690/7360658571220028690_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/7360108570610517000/7360658571220028690/7360658571220028690_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/7360108570610517000/7360658571220028690/7360658571220028690_0.jpg",
            "pinLocation": {
              "lat": 13.537363970842211,
              "lon": 100.95541994359479
            },
            "author": {
              "id": "USER#7360108570610517000",
              "itemName": "kamumovies",
              "avatar": "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/dabda0ea4a4fd470c27973876c6ca0f0.jpeg?lk3s=a5d48078&nonce=61781&refresh_token=e589f05c07a8d0c2fb1cf7a768b1eec5&x-expires=1718874000&x-signature=WfBwWcDdbEWVxcu8uGRuGk%2BbxTM%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.407Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://avatars.githubusercontent.com/u/62884034"
            },
            "product": null
          }
        },
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:19.281Z@USER#6928466881481491462",
            "text": "Let's dance let's dance // #emmastone #ryangosling #barbie #leonardodicaprio #emmastoneedit #edit \n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/6928466881481491462/7355212742095080736/7355212742095080736_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/6928466881481491462/7355212742095080736/7355212742095080736_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/6928466881481491462/7355212742095080736/7355212742095080736_0.jpg",
            "pinLocation": {
              "lat": 13.277491389568812,
              "lon": 100.57592852663511
            },
            "author": {
              "id": "USER#6928466881481491462",
              "itemName": "rafa_martinez0297",
              "avatar": "https://p77-sign-va.tiktokcdn.com/tos-maliva-avt-0068/f49c9d8e406e97a61dc6640d1e6c9bf0~c5_100x100.jpeg?lk3s=a5d48078&nonce=71226&refresh_token=d5abb9f7adb9e0a34d45b210486d32d1&x-expires=1718874000&x-signature=JT822FX2HxBuNW4Z6Q2AhaTiryM%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.413Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/546.jpg"
            },
            "product": null
          }
        },
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:19.148Z@USER#6825599151474410501",
            "text": "@Steve Aoki at Tomorrowland Winter. #tomorrowland #tomorrowlandwinter #electronicmusic #festival \n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/6825599151474410501/7351123224027008288/7351123224027008288_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/6825599151474410501/7351123224027008288/7351123224027008288_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/6825599151474410501/7351123224027008288/7351123224027008288_0.jpg",
            "pinLocation": {
              "lat": 13.920518557283438,
              "lon": 100.29545226729329
            },
            "author": {
              "id": "USER#6825599151474410501",
              "itemName": "tomorrowland",
              "avatar": "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/4feb1d46d7b70eb75976503cd6e6538e~c5_100x100.jpeg?lk3s=a5d48078&nonce=42239&refresh_token=2fad9acc8bb55ea481a1a9504fda32d4&x-expires=1718874000&x-signature=hvc5jc5L9MQg2xdPp6Czv4DvIYQ%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.421Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://avatars.githubusercontent.com/u/77207174"
            },
            "product": null
          }
        },
        {
          "postInfo": {
            "id": "POST#2024-09-28T03:59:18.919Z@USER#7027452084439286789",
            "text": "\n# <video controls><source src=\"https://gokgokgok.sgp1.cdn.digitaloceanspaces.com/hls_vid/7027452084439286789/7374487332348529952/7374487332348529952_0.m3u8\" type=\"application/x-mpegURL\">No video tag support</video>",
            "video": "http://localhost:3004/hls/7027452084439286789/7374487332348529952/7374487332348529952_0.m3u8",
            "thumbnail": "http://localhost:3004/hls/7027452084439286789/7374487332348529952/7374487332348529952_0.jpg",
            "pinLocation": {
              "lat": 13.271442296205787,
              "lon": 100.36752541448078
            },
            "author": {
              "id": "USER#7027452084439286789",
              "itemName": "barrykingstar2",
              "avatar": "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/a25c0ce49d6da3b7df47f8a4a48bd36d~c5_100x100.jpeg?lk3s=a5d48078&nonce=80816&refresh_token=796b918ba4fc301f7e5d7e0367dc484b&x-expires=1718874000&x-signature=po5FIu4bp50T2iX%2B7QESbvELZjc%3D&shp=a5d48078&shcp=81f88b70",
              "meFollowed": false,
              "isShop": false
            }
          },
          "relation": {
            "isLiked": null
          },
          "sponsor": {
            "id": "SPONSOR#2024-09-28T03:59:23.432Z@SHOP#2020-08-29T06:03:59.366Z#shop10",
            "text": "sponsor",
            "shop": {
              "itemName": "shop10",
              "avatar": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/578.jpg"
            },
            "product": null
          }
        }
      ]

export default function UserProfileScreen(props) {

    const param = props.route.params;

    const { state: { me } } = useContext(store);

    const [uploadProgress, setUploadProgress] = useState(-1);

    const {
        loading: user_loading,
        error: user_error,
        data: user_data
    } = useQuery(
        GET_USER_QUERY,
        {
            variables: { userId: param.userId }
        }
    );

    const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
        GET_USER_POST_QUERY,
        {
            variables: { userId: param.userId }
        }
    );

    // useEffect(() => {
    //     console.log('start')
    //     if (param?.uploadIdArr) {

    //         if (param?.uploadIdArr.length === 0) {
    //             post(param?.postText);
    //         }

    //         let progresses = [];
    //         let uploadFinished = 0;
    //         for (let [index, uploadId] of param?.uploadIdArr.entries()) {
    //             progresses.push(0);
    //             BackgroundUpload.addListener('progress', uploadId, (data) => {
    //                 // console.log(`Progress: ${data.progress}%`)
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
    //                 if (uploadFinished === param?.uploadIdArr.length) {
    //                     post(param?.postText);
    //                     setUploadProgress(-1);
    //                 }
    //                 console.log('Completed!');
    //             });
    //         }
    //     }
    // }, [param]);

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
                        userId: param.userId
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
                id: param.userId,
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

    const _renderItem = ({ item }) => <VideoPreviewItem
        item={item}
        navigation={props.navigation} />

    if (loading || user_loading) return (
        <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}>
            <Loading />
        </View>
    )
    if (error) return <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}><Text>`Error! ${error.message}`</Text></View>
    if (user_error) return <View style={{ flex: 1, backgroundColor: '#f1f6f8' }}><Text>`Error! ${user_error.message}`</Text></View>
    if (!loading && !user_loading && !data.getUserPosts.posts) {
        return (
            <ScrollView>
                <UserHeader
                    userData={user_data.getUser}
                    navigation={props.navigation}
                    me_following={me.following}
                />
                <View style={{ alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                    <Text>ยังไม่มีโพสต์</Text>
                </View>
            </ScrollView>

        )
    }

    console.log("--------userProfileScreen------------")
    console.log(data.getUserPosts)
    return (
        <View style={{ flex: 1, backgroundColor: '#f1f6f8' }} >
            <FlatList
                ListHeaderComponent={
                    <UserHeader
                        userData={user_data.getUser}
                        navigation={props.navigation}
                    />}
                contentContainerStyle={{ alignSelf: 'stretch' }}
                // data={data.getUserPosts.posts}
                data={testPosts}
                keyExtractor={item => item.postInfo.id}
                renderItem={_renderItem}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'flex-start' }}
                onEndReachedThreshold={0.9}
                onEndReached={() => data.getUserPosts.pageInfo.hasNextPage ? loadMore() : null}     
                removeClippedSubviews={true}
                refreshing={networkStatus === 4}
                onRefresh={() => refetch()}
            />
        </View>
    )
}

