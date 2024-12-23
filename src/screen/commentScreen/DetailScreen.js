import React, { 
  useEffect, 
  useState, 
  useRef,
  useContext, 
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import { 
  useQuery, 
  useMutation 
} from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import DetailFeedCard from './component/DetailFeedCard';
import GET_POST_QUERY from '../../graphql/queries/getPost';
import GET_COMMENTS_QUERY from '../../graphql/queries/getComments';
import CREATE_COMMENT_MUTATION from '../../graphql/mutations/createComment';
import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import ME_SUBSCRIPTION from '../../graphql/subscriptions/meSub';
import Loading from '../../component/Loading';
import GET_ME_QUERY from '../../graphql/queries/getMe';
import { store } from '../../utils/store';
import CommentItem from '../../component/commentItem/CommentItem';
import { setShowCommentData, getShowCommentData } from '../../utils/store';
import AvatarWrapper from '../../component/AvatarWrapper';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const DetailScreen = (props) => {
  const { state: { me } } = useContext(store);
  const { 
    postId,
    postData,
    sponsorId,
    sponsorData,
  } = props.route.params;

  const { loading, error, data } = useQuery(
    GET_POST_QUERY,
    { 
      variables: { postId: postId },
      skip: postData,
    }
    );

  // const { 
  //   loading: sponsor_loading, 
  //   error: sponsor_error, 
  //   data: sponsor_data
  // } = useQuery(
  //   GET_SPONSOR_BY_ID_QUERY,
  //   { 
  //     variables: { sponsorId: sponsorId },
  //     skip: sponsorData,
  //   }
  //   );

  const post = postData? postData : data?.getPost;
  const sponsor = sponsorData? sponsorData : data?.getSponsorById;

  const [createComment, {data: createComment_data}] = useMutation(CREATE_COMMENT_MUTATION);
  const [viewPost, {data: view_data, loading: view_loading}] = useMutation(VIEW_POST_MUTATION);

  const [ text, setText ] = useState('');
  const [ showNewComment, setShow ] = useState(false);

  const { 
    loading: Comment_loading, 
    error: Comment_error, 
    data: Comment_data,
    fetchMore
  } = useQuery(GET_COMMENTS_QUERY,
    { 
      variables: {
        pk: postId,
        getNewComments: showNewComment
      }
    }
    );

  const inputRef = useRef();
  const flatlistRef = useRef();

  function getShow() {
    const showData = getShowCommentData();
    setShow(showData);
  }

  function changeShow() {
    setShow(!showNewComment);
    setShowCommentData(!showNewComment);
  };

  // useLayoutEffect(() => {
  //   getShow();
  // }, [])

  useEffect(() => {
    viewPost({ variables: {postId: postId} })
  }, []);

  function focusInput() {
    if(Comment_data.getComments.comments.length) 
      flatlistRef.current.scrollToIndex({ index: 0, viewPosition: 0.16 });
  };

  function loadMore() {
      if(!Comment_data.getComments.pageInfo.hasNextPage) {
        return
      }
      fetchMore({
        variables: { 
          pk: postId,
          cursor: Comment_data.getComments.pageInfo.endCursor
         },
         updateQuery: (previousResult, { fetchMoreResult }) => {
          const newComments = fetchMoreResult.getComments.comments;
          const pageInfo = fetchMoreResult.getComments.pageInfo;
      
          return newComments.length
            ? {
                // Put the new comments at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                getComments: {
                  __typename: previousResult.getComments.__typename,
                  comments: [...previousResult.getComments.comments, ...newComments],
                  pageInfo
                }
              }
            : previousResult;
        }
      });
    
  }

  function submit() {
    createComment({ 
      variables: { 
          text : text,
          parentId: postId
       },
       optimisticResponse: {
           __typename: 'Mutation',
           createComment: {
             __typename: 'CreateComment',
              relation: {
                __typename: 'Relation',
                id: Math.round(Math.random()* -1000000).toString(),
                isLiked: false,
                isCoined: null,
                isViewed: null,
                isSaved: null,
                userCoinCount: null
              },
              commentInfo: {
               __typename: 'CommentInfo',
               id: Math.round(Math.random()* -1000000).toString(),
               text: text,
               likeCount: 0,
               commentCount: 0,
               createdAt: new Date(),
               author: {
                   __typename: 'Author',
                   id: Math.round(Math.random()* -1000000).toString(),
                   itemName: me.itemName,
                   avatar: me.avatar,
               } 
             } 
          }
        },
          update: (store, { data: { createComment } }) => {
            const storedData = store.readQuery({ 
              query: GET_COMMENTS_QUERY,
              variables: {
              pk: postId,
              getNewComments: showNewComment
            }
            });

            const data = JSON.parse(JSON.stringify(storedData));
            if(!data.getComments.comments) {
              store.writeQuery({ query: GET_COMMENTS_QUERY, 
                variables: {
                  pk: postId,
                  getNewComments: showNewComment
                }, 
                data: { 
                    getComments: {
                    __typename: 'getComments',
                    pageInfo: {
                      __typename: 'PageInfo',
                      hasNextPage: false,
                      endCursor: createComment.commentInfo.id
                    },
                    comments: [createComment]
                  }  
                } 
              });
            } else if(!data.getComments.comments.find(c => c.commentInfo.id === createComment.commentInfo.id)) {
                store.writeQuery({ query: GET_COMMENTS_QUERY, 
                variables: {
                  pk: postId,
                  getNewComments: showNewComment
                }, 
                    data: { 
                        getComments: {
                        __typename: 'GetComments',
                        pageInfo: {...data.getComments.pageInfo},
                        comments: [createComment, ...data.getComments.comments]
                      }  
                    } 
                });
              }
           }
           
   })
   Keyboard.dismiss();
   post.postInfo.commentCount++
   if(Comment_data.getComments.comments.length) 
    flatlistRef.current.scrollToIndex({ index: 0, viewPosition: 0.16 });
  };

 

  //if (loading) return <Loading />
  if(loading || Comment_loading) return <Loading />
  if (Comment_error) return <View><Text>`Error! ${Comment_error.message}`</Text></View>

  const _renderItem = ({ item }) => <CommentItem 
      {...post} 
      navigation={props.navigation}
      {...item} 
      />

  return (
    <View style={styles.Root}>
        <FlatList
            ListHeaderComponent={
              <DetailFeedCard
                postInfo={post.postInfo}
                relation={post.relation}
                sponsor={sponsor}
                navigation={props.navigation}
                myId={me.id}
                inputRef={inputRef}
                showNewComment={showNewComment}
                changeShow={changeShow}
            />}
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={Comment_data.getComments.comments}
             keyExtractor={item => item.commentInfo.id}
             renderItem={_renderItem}
             onEndReachedThreshold={0.5}
             onEndReached={() => loadMore()}
             scrollEventThrottle={16}
             ref={flatlistRef}
        />
        <View style={styles.footer}>
          <AvatarWrapper 
            uri={me.avatar}
            label={me.itemName[0]}
          />
          <View style={styles.commentBox}>
          
          <TextInput 
            style={styles.inputBox}
            value={text}
            placeholder='เขียนความคิดเห็น..'
            onChangeText={(value)=>setText(value)}
            onFocus={() => focusInput()}
            onBlur={()=>setText('')}
            ref={inputRef}
          />
          <TouchableOpacity>
          <View style={styles.photoInput}>
          <Icon name="photo-camera" size={30} color={iOSColors.lightGray} />
          </View>
          </TouchableOpacity>
          </View>
          {text == ''? null : 
          <TouchableOpacity onPress={() => submit()}>
          <View style={styles.sendButton}>
          <Icon name="send" size={30} color={iOSColors.orange} />
          </View>
          </TouchableOpacity> }
          
    </View>
    </View>
    
        
  )
}


const styles = StyleSheet.create({
    Root: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center'
    },
    inputBox: {
      flex: 1
    },
    commentBox: { 
      height: 40, 
      borderColor: 'gray',
      borderWidth: 1 ,
      borderRadius: 20,
      margin: 5,
      marginRight: 10,
      flex: 1,
      paddingHorizontal: 10,
      flexDirection: 'row', 
    },
    footer: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center'
    },
    photoInput: {
      marginLeft: 10,
      padding: 5,
      borderRadius: 20,
      marginVertical: 'auto',
    },
    sendButton: {
      marginRight: 10
    }
  })

export default DetailScreen;