import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import Animated, { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const PostVideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const borderRadiusValue = useSharedValue(40);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.front;
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermission();
      const microphoneStatus = await Camera.requestMicrophonePermission();
      setHasPermission(cameraStatus === 'authorized' && microphoneStatus === 'authorized');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Camera permission denied</Text>;
  }

  if (device == null) return <Text>Camera not available</Text>;

  const startRecording = async () => {
    if (!isCameraReady) {
      console.warn('Camera is not ready yet!');
      return;
    }
    setIsRecording(true);
    borderRadiusValue.value = withTiming(0, { duration: 500, easing: Easing.linear });
    const video = await camera.current.startRecording({
      onRecordingFinished: (video) => console.log(video),
      onRecordingError: (error) => console.error(error),
      audio: hasPermission,
    });
  };

  const stopRecording = () => {
    camera.current.stopRecording();
    setIsRecording(false);
    borderRadiusValue.value = withTiming(40, { duration: 500, easing: Easing.linear });
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.preview}
        device={device}
        isActive={true}
        video={true}
        audio={true}
        onInitialized={() => setIsCameraReady(true)}
        onError={(error) => console.error('Camera error:', error)}
      />
      <Animated.View>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.capture]}
        >
          <Animated.View style={[isRecording ? styles.recordingSquare : styles.innerCircle, { width: 60, height: 60, borderRadius: borderRadiusValue }]} />
        </TouchableOpacity>
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
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    backgroundColor: 'red',
  },
  recordingSquare: {
    width: 60,
    height: 60,
    backgroundColor: 'red',
  },
});

export default PostVideoScreen;
