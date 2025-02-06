import React, {
  useContext,
  useState,
} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { iOSUIKitTall } from 'react-native-typography'
import { useMutation } from '@apollo/client';

import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import VIEW_AD_MUTATION from '../../graphql/mutations/viewAd';
import CREATE_PROMOTE_MUTATION from '../../graphql/mutations/createPromote';
import DELETE_PROMOTE_MUTATION from '../../graphql/mutations/deletePromote';
import { VideoPlayer } from '../Video/views';
import { BOTTOM_TAB_HEIGHT, colors } from '../../utils/constants'
import FeedCardRight from './FeedCardRight';
import Sponsor from './Sponsor';
import { Button } from 'react-native-paper';
import { store } from '../../utils/store';

const { height, width } = Dimensions.get('window');

function FeedCard({
  postInfo,
  relation,
  sponsor,
  index,
  paused,
  onPress,
  shouldUnload,
  navigation
}) {
  const { state: { me }, dispatch } = useContext(store);

  const [isExpanded, setIsExpanded] = useState(false);
  const [viewedAd, setViewedAd] = useState(false);

  const [viewPost, { data }] = useMutation(VIEW_POST_MUTATION);
  const [viewAd, { data: viewAd_data }] = useMutation(VIEW_AD_MUTATION);
  const [createPromote, { data: createPromote_data }] = useMutation(CREATE_PROMOTE_MUTATION);
  const [deletePromote, { data: removePromote_data }] = useMutation(DELETE_PROMOTE_MUTATION);

  const onEnd = () => {
    viewPost({
      variables: { postId: postInfo.id },
    });
  }

  const promotePress = () => {
    const isoDate = new Date().toISOString();
    if(!postInfo.promoteId) {
      return createPromote({
        variables: {postId: postInfo.id},
        optimisticResponse: {
          __typename: 'CreatePromote',
          createPromote: {
            __typename: 'PostInfo',
            ...postInfo,
            promoteId: `PROMOTE#${isoDate}@${me.id}`
          },
        }
      });
    }
    else {
      return deletePromote({
        variables: {id: postInfo.promoteId, postId: postInfo.id},
        optimisticResponse: {
          __typename: 'DeletePromote',
          deletePromote: {
            __typename: 'PostInfo',
            ...postInfo,
            promoteId: null
          },
        }
      });
    }
    // createPromote({variables: {postId: postInfo.id}});
    // deletePromote({variables: {id: postInfo.promoteId, postId: postInfo.id}});
  }

  const onProgress = (event) => {
    if(viewedAd) return;
    if(event.currentTime < 2) return;
    if(sponsor)
      viewAd({
        variables: {
          pk: sponsor.pk,
          id: sponsor.id,
          isSponsor: true
        }
      })
    if(postInfo.promoteId)
      viewAd({
        variables: {
          pk: postInfo.author.id,
          id: postInfo.promoteId,
          isSponsor: false
        }
      })
    setViewedAd(true);
  }

  if(shouldUnload) return <SafeAreaView style={styles.fullScreenCard} />

  return (
    <SafeAreaView style={[
        styles.fullScreenCard, 
        {
          height: sponsor ? height - BOTTOM_TAB_HEIGHT : height
        }
      ]}>
      <View style={styles.videoContainer}>
        {
          postInfo.shopId 
          ?
          <Button 
            onPress={() => navigation.navigate('Shop', { shopId: postInfo.shopId })}
            mode='contained'
            buttonColor={colors.FOB}
            style={styles.viewShopButton}
            >
              ดูร้านค้า
          </Button>
          : null
        }
        {
          postInfo.author.id === me.id
          ?
          <Button 
            onPress={promotePress}
            mode='contained'
            buttonColor={colors.FOB}
            style={styles.viewShopButton}
            >
              {postInfo.promoteId ? "ยกเลิกโปรโมท" : "โปรโมทโพสต์"}
          </Button>
          : null
        }
          <VideoPlayer
            source={{ uri: postInfo.video, type: 'm3u8' }}
            paused={paused}
            onPress={() => onPress(index)}
            onProgress={onProgress}
            onEnd={onEnd}
            style={styles.video}
          />
      </View>
      <FeedCardRight
        postInfo={postInfo}
        relation={relation}
        navigation={navigation}
      />
      <LinearGradient
        colors={isExpanded ? ['rgba(0, 0, 0, 0.4)', 'transparent'] : ['transparent', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 0 }}
        style={[
          styles.bottomContent, 
          { 
            flexDirection: isExpanded ? 'column' : 'row',
            bottom: sponsor ? 120 : 0
          }
        ]}>
        <View style={styles.textContainer}>
          <Text style={styles.username}>@{postInfo.author.itemName}</Text>
          <Text style={styles.postText} numberOfLines={isExpanded ? 20 : 2} ellipsizeMode="tail">
            {postInfo.text}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.readMoreButton}
          onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={iOSUIKitTall.subheadWhite}>
            {isExpanded ? 'ซ่อน' : 'อ่านเพิ่มเติม'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
      {/* {
        sponsor 
        ?
        <Sponsor 
          {...sponsor}
          navigation={navigation}
        />
        : null
      } */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenCard: {
    width: width,
    // height: height,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  rightButtons: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    alignItems: 'center',
  },
  bottomContent: {
    position: 'absolute',
    left: 0,
    width: width,
    padding: 10,
    paddingRight: 80
    // maxHeight: 80,
  },
  videoContainer: {
    flex: 1,
  },
  button: {
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  postText: {
    color: 'white',
    fontSize: 14,
  },
  readMoreButton: {
    alignSelf: 'flex-end', 
  },
  textContainer: {
    flexDirection: 'column', 
    flex: 1
  },
  viewShopButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1
  }
});

export default FeedCard;
