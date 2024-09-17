import React, { 
  useState, 
} from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';
import { VideoPlayer } from '../../component/Video/views';
import PostTextModal from '../../component/PostTextModal';

function PostPreviewScreen({
  route
}) {
  const { 
    uri
  } = route.params;
  const [paused, setPaused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false)
  const toggleVideo = () => {
    setPaused(!paused);
  }
  console.log("-----------PostPreviewScreen")
  console.log(uri)
  return (
    <View style={styles.container}>
      <VideoPlayer 
        source={{uri}} 
        paused={paused}
        onPress={toggleVideo}
        style={styles.video} 
      />
      <PostTextModal 
        visible={isModalVisible}
        onDismiss={() => setModalVisible(false)}
       />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    flex: 1,
  },
});

export default PostPreviewScreen;
