import React, {
  useState,
  useEffect
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
import { VideoPlayer } from '../Video/views';
import { BOTTOM_TAB_HEIGHT } from '../../utils/constants'
import FeedCardRight from './FeedCardRight';
import Sponsor from './Sponsor';

const { height, width } = Dimensions.get('window');

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';

const FeedCard = forwardRef(({
  postInfo,
  relation,
  sponsor,
  index,
  paused,
  onPress,
  navigation
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [viewPost, { data }] = useMutation(VIEW_POST_MUTATION);

  const onEnd = () => {
    viewPost({
      variables: { postId: postInfo.id },
    });
  }
  return (
    <SafeAreaView style={styles.fullScreenCard}>
      <View style={styles.videoContainer}>
        <VideoPlayer
          source={{ uri: postInfo.video, type: 'm3u8' }}
          paused={paused}
          onPress={() => onPress(index)}
          onEnd={onEnd}
          style={styles.video}
        />
      </View>
      {/* <FeedCardRight
        postInfo={postInfo}
        relation={relation}
        navigation={navigation}
      /> */}
      <LinearGradient
        colors={isExpanded ? ['rgba(0, 0, 0, 0.4)', 'transparent'] : ['transparent', 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 0, y: 0 }}
        style={[
          styles.bottomContent, 
          { 
            flexDirection: isExpanded ? 'column' : 'row',
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
      {
        sponsor 
        ?
        <Sponsor 
          {...sponsor}
          navigation={navigation}
        />
        : null
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullScreenCard: {
    width: width,
    height: height - BOTTOM_TAB_HEIGHT,
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
    bottom: 120,
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
  }
});

export default FeedCard;
