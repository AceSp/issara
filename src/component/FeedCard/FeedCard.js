import React, {
  useState
} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { VideoPlayer } from '../Video/views';
import Icon from 'react-native-vector-icons/Ionicons';
import { BOTTOM_TAB_HEIGHT } from '../../utils/constants'
import FeedCardRight from './FeedCardRight';
import Sponsor from './Sponsor';

const { height, width } = Dimensions.get('window');

function FeedCard({
  postInfo,
  relation,
  sponsor,
  index,
  paused,
  onPress,
  navigation
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <SafeAreaView style={styles.fullScreenCard}>
      <View style={styles.videoContainer}>
        <VideoPlayer
          source={{ uri: postInfo.video, type: 'm3u8' }}
          paused={paused}
          onPress={() => onPress(index)}
          style={styles.video}
        />
      </View>
      <FeedCardRight
        postInfo={postInfo}
        relation={relation}
        navigation={navigation}
      />
      <View style={styles.bottomContent}>
        <View style={[styles.textContainer, { flex: isExpanded ? 1 : 5 }]}>
          <Text style={styles.username}>@{postInfo.author.itemName}</Text>
          <Text style={styles.postText} numberOfLines={isExpanded ? 20 : 2} ellipsizeMode="tail">
            {postInfo.text}
          </Text>
        </View>
        {!isExpanded && (
          <TouchableOpacity 
            style={styles.readMoreButton}
            onPress={() => setIsExpanded(!isExpanded)}>
            <Text>Read more...</Text>
          </TouchableOpacity>
        )}
      </View>
      <Sponsor 
        {...sponsor}
      />
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
    bottom: 130,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 80
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
    flex: 2
  },
  textContainer: {
    flexDirection: 'column', 
    flex: isExpanded ? 1 : 5
  }
});

export default FeedCard;
