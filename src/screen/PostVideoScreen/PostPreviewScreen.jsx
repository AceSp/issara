import React, { 
  useState, 
} from 'react';
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { VideoPlayer } from '../../component/Video/views';
import PostTextModal from '../../component/PostTextModal';
import IonIcon from 'react-native-vector-icons/Ionicons';

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
      <TouchableOpacity 
        style={styles.modalButton} 
        onPress={() => setModalVisible(true)}
      >
        <IonIcon name="create" color="white" size={24} />
      </TouchableOpacity>
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
  modalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostPreviewScreen;
