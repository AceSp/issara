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
      <View onPress={() => setIsExpanded(!isExpanded)} style={styles.bottomContent}>
        <View>
          <Text style={styles.username}>@{postInfo.author.username}</Text>
          <Text style={styles.postText} numberOfLines={isExpanded ? 20 : 2} ellipsizeMode="tail">
            {postInfo.text}
          </Text>
        </View>
        <TouchableOpacity 
          style={{ flex: 1 }}
          onPress={() => setIsExpanded(!isExpanded)}>
          <Text>Read more...</Text>
        </TouchableOpacity>
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
    right: 80,
    flexDirection: 'column'
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
});

export default FeedCard;