import React, { 
  useEffect, 
  useState, 
  useRef 
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
import { useQuery, useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import GET_REPLY_QUERY from '../../graphql/queries/getReply';
import CREATE_REPLY_MUTATION from '../../graphql/mutations/createReply';
import { getMeData } from '../../utils/store';
import FullScreenLoading from '../FullScreenLoading';
import ReplyItemHeader from '../../component/commentItem/ReplyItemHeader';
import ReplyItem from '../../component/commentItem/ReplyItem';
import AvatarWrapper from '../../component/AvatarWrapper';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const MoreReplyScreen = (props) => {
  const { commentId } = props.route.params;
  const { parentId } = props.route.params;
  const { textAutoFocus } = props.route.params;
  const { postInfo } = props.route.params;

  const { loading, error, data } = useQuery(
    GET_REPLY_QUERY,
    { variables: { id: commentId, parentid: parentId } }
    );

  const [createReply, {data: createReply_data}] = useMutation(CREATE_REPLY_MUTATION);

  const [ me, setMe ] = useState({});
  const [ text, setText ] = useState('');

  const inputRef = useRef();
  const flatlistRef = useRef();

  async function getMe() {
    const meData = getMeData();
    setMe(meData);
  }


  useEffect(() => {
    getMe();
  }, []);

  function focusInput() {
    if(data.getReply.replies) {
      flatlistRef.current.scrollToEnd()
    }
  }
  
  
  function submit() {
    createReply({ 
      variables: { 
          text: text,
          id: commentId,
          postid: postInfo.id,
          parentid: parentId
       },
      optimisticResponse: {
           __typename: 'Mutation',
           createReply: {
             __typename: 'createReply',
             postInfo: {...postInfo},
             comment:{
               replyCount: data.getReply.parent.commentInfo.replyCount + 1,
               ...data.getReply.parent.commentInfo
             },
             child: {
              __typename: 'Comment',
             userRelation: {
               __typename: 'UserRelation',
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
               replyCount: 0,
               createdAt: new Date(),
               author: {
                   __typename: 'User',
                   id: Math.round(Math.random()* -1000000).toString(),
                   username: me.username,
                   avatar: me.avatar,
             } 
             }
            }
          }
        },
          update: (store, { data: { createReply } }) => {
               const storedData = store.readQuery({ 
                 query: GET_REPLY_QUERY,
                 variables:  { id: commentId, parentid: parentId }
                });

                const data = JSON.parse(JSON.stringify(storedData));
                if(!data.getReply.replies) {
                  store.writeQuery({ query: GET_REPLY_QUERY, variables:  { id: commentId, parentid: parentId }, 
                    data: { 
                        getReply: {
                        __typename: 'Reply',
                        parent: {...data.getReply.parent},
                        replies: [
                            {
                                __typename: 'Comment',
                                commentInfo: { ...createReply.child.commentInfo },
                                userRelation: { ...createReply.child.userRelation }
                            }
                        ]

                      }  
                    } 
                })

                } else if(!data.getReply.replies.find(r => r.commentInfo.id === createReply.child.commentInfo.id)) {
                   store.writeQuery({ query: GET_REPLY_QUERY, variables:  { id: commentId, parentid: parentId }, 
                       data: { 
                           getReply: {
                           __typename: 'Reply',
                           parent: { ...data.getReply.parent },
                           replies: [
                               ...data.getReply.replies,
                               {
                                   __typename: 'Comment',
                                   commentInfo: { ...createReply.child.commentInfo },
                                   userRelation: { ...createReply.child.userRelation }
                               },
                           ]

                         }  
                       } 
                   })  
                  }
           }
   })
   Keyboard.dismiss();
  };

  if (loading) return <FullScreenLoading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) => <ReplyItem 
        {...item} 
        navigation={props.navigation}
        parentId={data.getReply.parent.commentInfo.id} 
   />
  return (
    <View style={styles.Root}>
        <FlatList
            ListHeaderComponent={
              <ReplyItemHeader
                inputRef={inputRef}
                parentId={parentId}
                {...data.getReply.parent}
            />}
            contentContainerStyle={{ alignSelf: 'stretch' }}
            data={data.getReply.replies}
            keyExtractor={item => item.commentInfo.id}
            renderItem={_renderItem}
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
            autoFocus={textAutoFocus}
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
export default MoreReplyScreen;