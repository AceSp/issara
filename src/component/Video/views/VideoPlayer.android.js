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
} from 'react-native';
import Slider from '@react-native-community/slider'
import Video from 'react-native-video';
import { BOTTOM_TAB_HEIGHT, SPONSOR_HEIGHT } from '../../../utils/constants';

const { width, height } = Dimensions.get('window');

export const VideoPlayer = ({ source, paused, onPress, onEnd, onProgress, index, videoRef }) => {

  const [horizontal, setHorizontal] = useState(false);

  const onError = (error) => {
    console.error('Video Error:', error);
  };

  const onLoad = (data) => {
    // Get actual video dimensions from metadata
    const { naturalSize } = data;
    const ratio = naturalSize.width / naturalSize.height;  
    if(ratio > 1) setHorizontal(true);
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
          resizeMode={horizontal ? "contain" : "cover"}
          repeat={true}
          paused={paused}
          onError={onError}
          onEnd={onEnd}
          onLoad={onLoad}
          onProgress={onProgress}
          onBuffer={onBuffer}
          controls={false}
          playInBackground={false}
          playWhenInactive={false}
        />
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  video: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black'
  }

});
