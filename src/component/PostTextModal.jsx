import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal'; 
import {
  IconButton
} from 'react-native-paper'

import { store } from '../utils/store';
import { iOSColors } from 'react-native-typography';
const { width, height } = Dimensions.get('window');

const PostTextModal = ({ visible, onDismiss, onPost }) => {
  const { state: { me } } = useContext(store);
  const [text, setText] = useState('');

  const handleHashtagPress = () => {
    setText(prevText => prevText + ' #');
  };

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      isVisible={visible}
      onBackdropPress={onDismiss}
      onSwipeComplete={onDismiss}
      swipeDirection="down"
      propagateSwipe={true}
      style={styles.modal} // Add style for modal
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>คำบรรยายวิดีโอ</Text>
          <IconButton onPress={onDismiss} icon='close' size={24} />
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Type something..."
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
          multiline
          maxLength={320}
        />
        <TouchableOpacity onPress={handleHashtagPress} style={styles.hashtagButton}>
          <Text style={styles.hashtagButtonText}># แฮชแท็ก</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.4,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 15,
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.lightGray,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    height: 160,
    borderWidth: 0,
    width: '90%',
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
    alignSelf: 'center',
    textAlignVertical: 'top'
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
  hashtagButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    backgroundColor: iOSColors.lightGray,
    padding: 10,
    borderRadius: 5,
  },
  hashtagButtonText: {
    fontSize: 16,
  },
});

export default PostTextModal;

