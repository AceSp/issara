import React, {
  useRef
} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

export const VideoPlayer = ({ source, paused, onPress, onEnd, onProgress, index }) => {
  const videoRef = useRef(null);

  const onError = (error) => {
    console.error('Video Error:', error);
  };

  const onBuffer = (buffer) => {
    console.log('Buffering:', buffer);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => onPress(index)}>
        <Video
          ref={videoRef}
          source={source}
          style={styles.video}
          resizeMode="cover"
          repeat={true}
          paused={paused}
          onError={onError}
          onEnd={onEnd}
          onProgress={onProgress}
          onBuffer={onBuffer}
          controls={true}
          playInBackground={false}
          playWhenInactive={false}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    overflow: 'hidden'
  },
  video: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right:
    height: '100%',
    width: '100%',
  },
});
