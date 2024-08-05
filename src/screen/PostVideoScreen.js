import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';

const PostVideoScreen = () => {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async (camera) => {
    setIsRecording(true);
    const options = { quality: RNCamera.Constants.VideoQuality['480p'] };
    const data = await camera.recordAsync(options);
    console.log(data);
    setIsRecording(false);
  };

  const stopRecording = (camera) => {
    camera.stopRecording();
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.front}
        captureAudio={true}
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
