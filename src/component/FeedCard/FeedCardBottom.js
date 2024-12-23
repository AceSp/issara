import React, {
    useState,
    useEffect,
    useLayoutEffect,
    memo
} from 'react';
import {
    View,
    StyleSheet,
    Dimensions
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

import { colors } from '../../utils/constants'
import LIKE_POST_MUTATION from '../../graphql/mutations/likePost';
import SAVE_POST_MUTATION from '../../graphql/mutations/savePost';
import GET_POSTS_QUERY from '../../graphql/queries/getPosts';
import { useMutation } from '@apollo/client';
import Coin from './Coin';
import formatNumber from '../../utils/formatNumber';
import { linking } from '../../utils/linking';
import ShareModal from './ShareModal';
import MoreOptionModal from './MoreOptionModal';
import ReportModal from './ReportModal';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

  function FeedCardBottom({
    sponsorId,
    postInfo,
    relation,
    comeFromGroup,
    navigation,
}) {
    const [likePost, { data }] = useMutation(LIKE_POST_MUTATION);
    const [savePost, { data: savePost_data }] = useMutation(SAVE_POST_MUTATION);

    const [coinVisible, setCoinVisible] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [coinCountState, setCoinCountState] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showMoreModal, setShowMoreModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);

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
        setLiked(!liked);
        likePost({variables: { postId: postInfo.id }});
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

    return (
        <Card.Actions style={styles.root}>
            <View style={styles.rowView}>
            <TouchableRipple style={styles.Button} onPress={like}>
                <View style={styles.Button}>
                    {liked ? <Icon
                        name="thumbs-up"
                        type='font-awesome'
                        color={iOSColors.orange}
                        size={27} /> :
                        <Icon
                            name="thumbs-o-up"
                            type='font-awesome'
                            color={iOSColors.gray}
                            size={27} />
                    }
                    <Text style={styles.ButtonText}>
                        {formatNumber(postInfo.likeCount) + (relation.isLiked ? (liked ? 0 : -1) : (liked ? 1 : 0))}
                    </Text>
                </View>
            </TouchableRipple>
            <TouchableRipple
                onPress={() => navigation.navigate('Detail', {
                    postId: postInfo.id,
                    sponsorId: sponsorId ? sponsorId : null
                })
                }
                style={styles.Button}>
                <View style={styles.Button}>
                    <Icon
                        name="comment-processing-outline"
                        type="material-community"
                        color={iOSColors.gray}
                        size={27} />
                    <Text style={styles.ButtonText}>
                        {postInfo.commentCount}
                    </Text>
                </View>
            </TouchableRipple>
            </View>
            <View style={styles.rowView}>
            <TouchableRipple style={styles.Button} onPress={externalShare}>
                <View style={styles.Button}>
                    <Icon
                        name="share"
                        color={iOSColors.gray}
                        size={25} />
                    <Text style={styles.ButtonText}>
                        แชร์
                    </Text>
                </View>
            </TouchableRipple>
            <TouchableRipple 
                style={styles.Button} 
                // onPress={() => save()} >
                onPress={() => setShowMoreModal(true)} >
                <View style={styles.Button}>
                    <Icon
                        type="material-community"
                        name="dots-vertical"
                        color={iOSColors.gray}
                        size={25} />
                    <Text style={styles.ButtonText}>
                        เพิ่มเติม
                    </Text>
                </View>
                {/* <View style={styles.Button}>
                    {saved ?
                        <Icon
                            name="bookmark"
                            color={iOSColors.orange}
                            size={30} />
                        :
                        <Icon
                            name="bookmark-border"
                            color={iOSColors.gray}
                            size={30} />
                    }
                    <Text style={styles.ButtonText}>
                        บันทึก
                    </Text>
                </View> */}
            </TouchableRipple>
            </View>
            <Portal>
                <Modal
                    visible={showMoreModal}
                    contentContainerStyle={styles.modal}
                    onDismiss={() => setShowMoreModal(false)}
                >
                    <MoreOptionModal 
                        save={save}
                        saved={saved}
                        showReportOption={showReportOption}
                    />
                </Modal>
                <Modal
                    visible={showReportModal}
                    contentContainerStyle={styles.modal}
                    onDismiss={() => setShowReportModal(false)}
                >
                    <ReportModal 
                        pk = {postInfo.author.id}
                        id = {postInfo.id}
                    />
                </Modal>
            </Portal>
        </Card.Actions>
    )
}

export default memo(FeedCardBottom);

//contentStyle={{width: 350, height: 60, padding: 0, borderRadius: 10, backgroundColor: colors.BUTTON_RED}}

const styles = StyleSheet.create({
    root: {
        justifyContent: 'space-between'
    },
    Button: {
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginRight: 6
    },
    ButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#444B52',
        marginLeft: 6
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