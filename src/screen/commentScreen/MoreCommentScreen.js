import React, {
  useEffect,
  useState,
  useRef,
  useContext
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

import GET_COMMENTS_QUERY from '../../graphql/queries/getComments';
import CREATE_COMMENT_MUTATION from '../../graphql/mutations/createComment';
import { getMeData } from '../../utils/store';
import FullScreenLoading from '../FullScreenLoading';
import CommentItemHeader from '../../component/commentItem/CommentItemHeader';
import ReplyItem from '../../component/commentItem/ReplyItem';
import { store } from '../../utils/store';
import CommentItem from '../../component/commentItem/CommentItem';
import AvatarWrapper from '../../component/AvatarWrapper';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const MoreCommentScreen = (props) => {
  const {
    comment,
    textAutoFocus,
    postInfo
  } = props.route.params;
  const { state: { me } } = useContext(store);

  const { loading, error, data } = useQuery(
    GET_COMMENTS_QUERY,
    { variables: { pk: comment.commentInfo.id } }
  );

  const [createComment, { data: createComment_data }] = useMutation(CREATE_COMMENT_MUTATION);

  const [text, setText] = useState('');

  const inputRef = useRef();
  const flatlistRef = useRef();

  function focusInput() {
    if (data.getComments.comments) {
      flatlistRef.current.scrollToEnd()
    }
  }

  function submit() {
    createComment({
      variables: {
        text: text,
        parentId: comment.commentInfo.id,
      },
      optimisticResponse: {
        __typename: 'Mutation',
        createComment: {
          __typename: 'CreateComment',
          relation: {
            __typename: 'Relation',
            id: Math.round(Math.random() * -1000000).toString(),
            isLiked: false,
            isCoined: null,
            isViewed: null,
            isSaved: null,
            userCoinCount: null
          },
          commentInfo: {
            __typename: 'CommentInfo',
            id: Math.round(Math.random() * -1000000).toString(),
            text: text,
            likeCount: 0,
            commentCount: 0,
            createdAt: new Date(),
            author: {
              __typename: 'User',
              id: Math.round(Math.random() * -1000000).toString(),
              itemName: me?.itemName,
              avatar: me?.avatar,
            }
          }
        }
      },
      update: (store, { data: { createComment } }) => {
        const storedData = store.readQuery({
          query: GET_COMMENTS_QUERY,
          variables: { pk: comment.commentInfo.id }
        });

        const data = JSON.parse(JSON.stringify(storedData));
        if(!data?.getComments?.comments) {
          store.writeQuery({
            query: GET_COMMENTS_QUERY, variables: { pk: comment.commentInfo.id },
            data: {
              getComments: {
                __typename: 'GetComments',
                pageInfo: {
                  __typename: 'PageInfo',
                  hasNextPage: false,
                  endCursor: createComment.commentInfo.id
                },
                comments: [createComment]
              }
            }
          });
        } else if (!data.getComments?.comments?.find(r => r.commentInfo.id === createComment.commentInfo.id)) {
          store.writeQuery({
            query: GET_COMMENTS_QUERY, variables: { pk: comment.commentInfo.id },
            data: {
              getComments: {
                __typename: 'GetComments',
                pageInfo: data.getComments.pageInfo,
                comments: [createComment, ...data.getComments.comments]
              }
            }
          });
        }
      }
    });
    Keyboard.dismiss();
  };

  if (loading) return <FullScreenLoading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) => <View style={{ marginLeft: 20 }}>
    <CommentItem
      postInfo={postInfo}
      parentId={comment.commentInfo.id}
      navigation={props.navigation}
      {...item}
    />
  </View>
  return (
    <View style={styles.Root}>
      <FlatList
        ListHeaderComponent={
          <CommentItem
            inputRef={inputRef}
            {...comment}
            showReplyButton={true}
          />}
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={data.getComments.comments}
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
            onChangeText={(value) => setText(value)}
            onFocus={() => focusInput()}
            onBlur={() => setText('')}
            autoFocus={textAutoFocus}
            ref={inputRef}
          />
          <TouchableOpacity>
            <View style={styles.photoInput}>
              <Icon name="photo-camera" size={30} color={iOSColors.lightGray} />
            </View>
          </TouchableOpacity>
        </View>
        {text == '' ? null :
          <TouchableOpacity onPress={() => submit()}>
            <View style={styles.sendButton}>
              <Icon name="send" size={30} color={iOSColors.orange} />
            </View>
          </TouchableOpacity>}

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
    borderWidth: 1,
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

export default MoreCommentScreen;