import React, { 
  useState, 
} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { 
  closeEditor, 
  showEditor 
} from 'react-native-video-trim';

import { VideoPlayer } from '../../component/Video/views';
import PostTextModal from '../../component/PostTextModal';
import IonIcon from 'react-native-vector-icons/Ionicons';

function PostPreviewScreen({
  route
}) {
  // const { 
  //   uri
  // } = route.params;
  const [paused, setPaused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false)
  const toggleVideo = () => {
    setPaused(!paused);
  }

  const handleUpload = async (filePath) => {
    const options = {
      taskName: 'FileUpload',
      taskTitle: 'Uploading File',
      taskDesc: 'Progress',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#ff00ff',
      //change this for opening the app from notification
      linkingURI: 'uploadFile',
    };
    await BackgroundService.start(() => uploadFileInChunks(filePath, me.id), options);
  };

  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.VideoTrim);
    const subscription = eventEmitter.addListener('VideoTrim', (event) => {
      switch (event.name) {
        case 'onLoad': {
          // on media loaded successfully
          console.log('onLoadListener', event);
          break;
        }
        case 'onShow': {
          console.log('onShowListener', event);
          break;
        }
        case 'onHide': {
          console.log('onHide', event);
          break;
        }
        case 'onStartTrimming': {
          console.log('onStartTrimming', event);
          break;
        }
        case 'onFinishTrimming': {
          console.log('onFinishTrimming', event);
          handleUpload(event.outputPath)
          closeEditor();
          break;
        }
        case 'onCancelTrimming': {
          console.log('onCancelTrimming', event);
          break;
        }
        case 'onCancel': {
          console.log('onCancel', event);
          break;
        }
        case 'onError': {
          console.log('onError', event);
          break;
        }
        case 'onLog': {
          console.log('onLog', event);
          break;
        }
        case 'onStatistics': {
          console.log('onStatistics', event);
          break;
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);
  const uri = 'file:///data/user/0/com.gokgokgok/cache/rn_image_picker_lib_temp_75ad52c0-8c9b-47a0-80cc-e3170be56654.mp4'
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
