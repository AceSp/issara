import React, {
  useRef,
  useState,
} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Text,
  Slider,
} from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

export const VideoPlayer = ({ source, paused, onPress, onEnd, onProgress, index }) => {
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const onError = (error) => {
    console.error('Video Error:', error);
  };

  const onBuffer = (buffer) => {
    console.log('Buffering:', buffer);
  };

  const onVideoProgress = (event) => {
    setProgress(event.currentTime);
    setDuration(event.playableDuration);
    onProgress(event);
  };

  const seek = (value) => {
    videoRef.current.seek(value);
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
          onProgress={onVideoProgress}
          onBuffer={onBuffer}
          controls={false}
          playInBackground={false}
          playWhenInactive={false}
        />
      </TouchableWithoutFeedback>
      <Slider
        style={styles.progressBar}
        value={progress}
        maximumValue={duration}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        thumbTintColor="#FFFFFF"
        onValueChange={seek}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    overflow: 'hidden',
  },
  video: {
    height: '100%',
    width: '100%',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 40,
  },
});
