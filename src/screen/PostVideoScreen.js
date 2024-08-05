import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

const PostVideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const camera = useRef(null);
  const device = useCameraDevices('front');
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
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
