import React, {
    useState,
    useEffect,
    useLayoutEffect,
    memo
} from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import {
    Icon,
    Text
} from 'react-native-elements';
import {
    Card,
    TouchableRipple,
    Modal,
    Portal,
    Button
} from 'react-native-paper';
import { iOSColors, iOSUIKitTall } from 'react-native-typography';
import Share from 'react-native-share';
import Image from 'react-native-fast-image';

import { colors } from '../../utils/constants'
import LIKE_POST_MUTATION from '../../graphql/mutations/likePost';
import SAVE_POST_MUTATION from '../../graphql/mutations/savePost';
import FOLLOW_MUTATION from '../../graphql/mutations/follow';
import UNFOLLOW_MUTATION from '../../graphql/mutations/unfollow';
import GET_POSTS_QUERY from '../../graphql/queries/getPosts';
import { useMutation } from '@apollo/client';
import Coin from './Coin';
import formatNumber from '../../utils/formatNumber';
import { linking } from '../../utils/linking';
import ShareModal from './ShareModal';
import MoreOptionModal from './MoreOptionModal';
import ReportModal from './ReportModal';
import { DEFAULT_AVATAR } from '../../utils/constants';
import CommentModal from './CommentModal';
import Avatar from './Avatar';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function FeedCardRight({
    postInfo,
    relation,
    navigation,
}) {
    const [likePost, { data }] = useMutation(LIKE_POST_MUTATION);
    const [savePost, { data: savePost_data }] = useMutation(SAVE_POST_MUTATION);
    const [follow, { data: follow_data }] = useMutation(FOLLOW_MUTATION);
    const [unfollow, { data: data_unfollow }] = useMutation(UNFOLLOW_MUTATION);
    const [avatarLoadError, setAvatarLoadError] = useState(false);
    const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

    const [coinVisible, setCoinVisible] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [coinCountState, setCoinCountState] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showMoreModal, setShowMoreModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
        if (followed != postInfo.author.meFollowed) {
        setFollowed(postInfo.author.meFollowed);
        }
    }, [postInfo.author?.meFollowed])

    const onFollowPress = () => {
        if (!postInfo.authormeFollowed) {
        follow({
            variables: { userId: postInfo.author.id }
        });
        setFollowed(!followed);
        } else {
        unfollow({
            variables: { userId: postInfo.author.id }
        });
        setFollowed(!followed);
        }
    }

    useEffect(() => {
        if (liked != relation.isLiked) {
            setLiked(relation.isLiked);
        }
    }, [relation.isLiked]);

    useEffect(() => {
        if (saved != relation.isSaved) {
            setSaved(relation.isSaved);
        }
    }, [relation.isSaved]);

    useLayoutEffect(() => {
        setCoinCountState(0);
    }, [postInfo.coinCount]);

    const like = () => {
        const optimisticResponse = {
            __typename: 'Mutation',
            likePost: {
                __typename: 'Post',
                id: postInfo.id,
                likeCount: liked ? postInfo.likeCount - 1 : postInfo.likeCount + 1,
                isLiked: !liked,
            },
        };

        setLiked(!liked);
        likePost({
            variables: { postId: postInfo.id },
            optimisticResponse,
            update: (cache, { data: { likePost } }) => {
                const data = cache.readQuery({
                    query: GET_POSTS_QUERY,
                    variables: { cursor: null, limit: null, isJob: null },
                });

                if (data && data.getPosts && data.getPosts.sections) {
                    const updatedSections = data.getPosts.sections.map(section => {
                        if (section.data) {
                            return {
                                ...section,
                                data: section.data.map(item => {
                                    if (item.postInfo.id === postInfo.id) {
                                        return {
                                            ...item,
                                            postInfo: {
                                                ...item.postInfo,
                                                likeCount: likePost.postInfo.likeCount,
                                                isLiked: likePost.relation.isLiked,
                                            },
                                            relation: {
                                                ...item.relation,
                                                isLiked: likePost.relation.isLiked,
                                            },
                                        };
                                    }
                                    return item;
                                }),
                            };
                        }
                        return section;
                    });

                    cache.writeQuery({
                        query: GET_POSTS_QUERY,
                        variables: { cursor: null, limit: null, isJob: null },
                        data: {
                            getPosts: {
                                ...data.getPosts,
                                sections: updatedSections,
                            },
                        },
                    });
                }
            },
        });
    }

    const save = () => {
        setSaved(!saved);
        savePost({
            variables: { postId: postInfo.id },
        });
    }

    async function onShare() {
        navigation.navigate('Post', {
            title: postInfo.title,
            text: postInfo.text,
            author: postInfo.author,
            createdAt: postInfo.createdAt
        });
    }

    async function externalShare() {
        try {
            await Share.open({
                message: linking.prefixes[0] + "/detail?postId=" + postInfo.id,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    const showReportOption = () => setShowReportModal(true);

    const handleAvatarError = () => {
        setAvatarLoadError(true);
    };

    return (
        <View style={styles.root}>
            <View style={styles.avatarContainer}>
                <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('UserProfile', { userId: postInfo.author.id })}
                >
                <Avatar 
                    source={postInfo.author.avatar}
                    style={styles.avatar}
                />
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.followButton, followed && styles.followingButton]} 
                onPress={onFollowPress}
                >
                <Icon
                    name={followed ? "check" : "plus"}
                    type="font-awesome"
                    color={followed ? "black" : "white"}
                    size={15}
                />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={like}>
                <Icon
                    name={liked ? "heart" : "heart-outline"}
                    type="material-community"
                    color={liked ? iOSColors.red : iOSColors.white}
                    size={35}
                />
                <Text style={styles.buttonText}>
                    {formatNumber(postInfo.likeCount + (liked ? 1 : 0))}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setIsCommentModalVisible(true)}
                >
                <Icon
                    name="comment-processing-outline"
                    type="material-community"
                    color={iOSColors.white}
                    size={35}
                />
                <Text style={styles.buttonText}>
                    {formatNumber(postInfo.commentCount)}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={save}>
                <Icon
                    name={saved ? "bookmark" : "bookmark-outline"}
                    type="material-community"
                    color={saved ? iOSColors.yellow : iOSColors.white}
                    size={35}
                />
                <Text style={styles.buttonText}>บันทึก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={externalShare}>
                <Icon
                    name="share"
                    type="material-community"
                    color={iOSColors.white}
                    size={35}
                />
                <Text style={styles.buttonText}>แชร์</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={showReportOption}>
                <Icon
                    name="flag-outline"
                    type="material-community"
                    color={iOSColors.white}
                    size={35}
                />
                <Text style={styles.buttonText}>รายงาน</Text>
            </TouchableOpacity>
            <Portal>
                <CommentModal
                    visible={isCommentModalVisible}
                    onDismiss={() => setIsCommentModalVisible(false)}
                    postId={postInfo.id}
                    postData={postInfo}
                />
                <Modal
                    visible={showReportModal}
                    contentContainerStyle={styles.modal}
                    onDismiss={() => setShowReportModal(false)}
                >
                    <ReportModal
                        pk={postInfo.author.id}
                        id={postInfo.id}
                    />
                </Modal>
            </Portal>
        </View>
    )
}


//contentStyle={{width: 350, height: 60, padding: 0, borderRadius: 10, backgroundColor: colors.BUTTON_RED}}

const styles = StyleSheet.create({
    root: {
        position: 'absolute',
        right: 10,
        bottom: 100,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
    },
    button: {
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: iOSColors.white,
        marginTop: 5,
    },
    followButton: {
        position: 'absolute',
        bottom: -10,
        backgroundColor: '#FF4040',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    followingButton: {
        backgroundColor: 'white',
    },
    modal: {
        backgroundColor: iOSColors.white,
        position: 'absolute',
        bottom: 0,
        width: width,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingVertical: 10
    },
    shareOption: {
        marginLeft: 10,
        alignSelf: 'stretch'
    },
    shareOptionLabel: {
        alignSelf: 'flex-start'
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
});

export default FeedCardRight;
