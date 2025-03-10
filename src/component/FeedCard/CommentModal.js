import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  ScrollView,
  KeyboardEvent,
} from 'react-native';
import Modal from 'react-native-modal'; 
import Avatar from './Avatar';
import { Icon } from 'react-native-elements';
import { useMutation, useQuery } from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import { store } from '../../utils/store';
import GET_COMMENTS_QUERY from '../../graphql/queries/getComments';
import CREATE_COMMENT_MUTATION from '../../graphql/mutations/createComment';
import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import CommentItem from '../commentItem/CommentItem';
import Loading from '../Loading';
import AvatarWrapper from '../AvatarWrapper';

const { width, height } = Dimensions.get('window');

const CommentModal = ({ visible, onDismiss, postId, postData }) => {
  const { state: { me } } = useContext(store);
  const [text, setText] = useState('');
  const [showNewComment, setShow] = useState(false);
  const [parentId, setParentId] = useState(postId);

  const { loading, error, data, fetchMore } = useQuery(GET_COMMENTS_QUERY, {
    variables: {
      pk: postId,
      getNewComments: showNewComment,
    },
  });

  const [createComment] = useMutation(CREATE_COMMENT_MUTATION);
  const [viewPost] = useMutation(VIEW_POST_MUTATION);

  const inputRef = useRef();
  const flatlistRef = useRef();

  useEffect(() => {
    if (visible) {
      viewPost({ variables: { postId: postId } });
    }

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, [visible]);

  const setReply = (commentId) => {
    inputRef.current.focus()
    setParentId(commentId)
  }

  const submit = () => {
    createComment({
      variables: {
        text: text,
        parentId,
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
          },
          replies: [] 
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
        if (!data.getComments.comments) {
          store.writeQuery({
            query: GET_COMMENTS_QUERY,
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
        } else if (!data.getComments.comments.find(c => c.commentInfo.id === createComment.commentInfo.id)) {
          if (parentId === postId) {
            store.writeQuery({
              query: GET_COMMENTS_QUERY,
              variables: {
                pk: postId,
                getNewComments: showNewComment
              },
              data: {
                getComments: {
                  __typename: 'GetComments',
                  pageInfo: { ...data.getComments.pageInfo },
                  comments: [createComment, ...data.getComments.comments]
                }
              }
            });
          } else {
            const updatedComments = data.getComments.comments.map(comment => {
              if (comment.commentInfo.id === parentId) {
                return {
                  relation: comment.relation,
                  commentInfo: {
                    ...comment.commentInfo,
                    commentCount: comment.commentInfo.commentCount + 1
                  },
                  replies: [...(comment.replies || []), createComment]
                };
              }
              return comment;
            });
            store.writeQuery({
              query: GET_COMMENTS_QUERY,
              variables: {
                pk: postId,
                getNewComments: showNewComment
              },
              data: {
                getComments: {
                  __typename: 'GetComments',
                  pageInfo: { ...data.getComments.pageInfo },
                  comments: updatedComments
                }
              }
            });
          }
        }
      },
    });
    Keyboard.dismiss();
    setText('');
    if (data?.getComments?.comments?.length) {
      flatlistRef.current.scrollToIndex({ index: 0, animated: true });
    }
  };

  const loadMore = () => {
    if (!data?.getComments?.pageInfo?.hasNextPage) return;
    fetchMore({
      variables: {
        pk: postId,
        cursor: data.getComments.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        // ... (keep the updateQuery logic as is)
      },
    });
  };

  const renderItem = ({ item }) => (
    <CommentItem
      {...postData}
      {...item}
      setReply={setReply}
    />
  );

  if (loading || !me) return <Loading />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      isVisible={visible}
      onBackdropPress={onDismiss}
      onSwipeComplete={onDismiss}
      // swipeDirection="down"
      propagateSwipe={true}
      style={styles.modal} // Add style for modal
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments</Text>
          <TouchableOpacity onPress={onDismiss}>
            <Icon name="close" size={24} color={iOSColors.black} />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <FlatList
            data={data?.getComments?.comments}
            renderItem={renderItem}
            keyExtractor={(item) => item.commentInfo.id}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ref={flatlistRef}
            scrollEnabled={false}
          />
        </ScrollView>
        <View style={styles.footer}>
          <AvatarWrapper 
            uri={me?.avatar ? me.avatar : null}
            label={me.itemName[0]}
          />
          <View style={styles.commentBox}>
            <TextInput
              style={styles.inputBox}
              value={text}
              onBlur={() => setParentId(postId)}
              placeholder="Write a comment..."
              onChangeText={(value) => setText(value)}
              ref={inputRef}
            />
            <TouchableOpacity>
              <View style={styles.photoInput}>
                <Icon name="photo-camera" size={24} color={iOSColors.lightGray} />
              </View>
            </TouchableOpacity>
          </View>
          {text !== '' && (
            <TouchableOpacity onPress={submit}>
              <View style={styles.sendButton}>
                <Icon name="send" size={24} color={iOSColors.orange} />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.7,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.lightGray,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: iOSColors.lightGray,
  },
  commentBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: iOSColors.customGray,
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  inputBox: {
    flex: 1,
    height: 40,
  },
  photoInput: {
    padding: 5,
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default CommentModal;
