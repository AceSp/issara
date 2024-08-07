import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Camera, useCameraDevices, getCa } from 'react-native-vision-camera';

const PostVideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const borderRadiusValue = useRef(new Animated.Value(40)).current;
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
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    Animated.timing(borderRadiusValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      scaleValue.setValue(1);
    });
    const video = await camera.current.startRecording({
      onRecordingFinished: (video) => console.log(video),
      onRecordingError: (error) => console.error(error),
      audio: hasPermission,
    });
  };

  const stopRecording = () => {
    camera.current.stopRecording();
    setIsRecording(false);
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(borderRadiusValue, {
        toValue: 40,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
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
      <View style={styles.whiteCircle}>
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableOpacity
            onPress={isRecording ? stopRecording : startRecording}
            style={[styles.capture, { borderRadius: borderRadiusValue }]}
          />
        </Animated.View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCircle: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PostVideoScreen;
