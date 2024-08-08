import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Animated, { useSharedValue, withTiming, withRepeat, Easing } from 'react-native-reanimated';

const PostVideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const scale = useSharedValue(1);
  const camera = useRef(null);

  const startRecording = async () => {
    setIsRecording(true);
    scale.value = withRepeat(withTiming(1.2, { duration: 500, easing: Easing.linear }), -1, true);
    const video = await camera.current.recordAsync();
    console.log(video);
  };

  const stopRecording = () => {
    camera.current.stopRecording();
    setIsRecording(false);
    scale.value = withTiming(1, { duration: 500 });
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={RNCamera.Constants.Type.front}
        flashMode={RNCamera.Constants.FlashMode.off}
        captureAudio={true}
      />
      <Animated.View style={{ transform: [{ scale: scale }] }}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={styles.capture}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  capture: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'red',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostVideoScreen;
