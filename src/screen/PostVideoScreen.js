import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

const PostVideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const camera = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('front');

  if (!hasPermission) {
    requestPermission();
    return <Text>Requesting permission...</Text>;
  }

  if (device == null) return <Text>Camera not available</Text>;

  const startRecording = async () => {
    setIsRecording(true);
    const video = await camera.current.startRecording({
      onRecordingFinished: (video) => console.log(video),
      onRecordingError: (error) => console.error(error),
    });
  };

  const stopRecording = () => {
    camera.current.stopRecording();
    setIsRecording(false);
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
      />
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={styles.capture}
      >
        <Text style={{ fontSize: 14 }}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
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
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
});

export default PostVideoScreen;
