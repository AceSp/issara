import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Modal from 'react-native-modal'; // Import Modal from react-native-modal

import { store } from '../utils/store';
const { width, height } = Dimensions.get('window');

const PostTextModal = ({ visible, onDismiss }) => {
  const { state: { me } } = useContext(store);
  const [text, setText] = useState('');

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      isVisible={visible}
      onBackdropPress={onDismiss}
      onSwipeComplete={onDismiss}
      // swipeDirection="down"
      propagateSwipe={true}
      style={styles.modal} // Add style for modal
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalText}>Enter Text</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type something..."
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={onDismiss}>
          <Text style={styles.closeButtonText}>Close</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
  },
  closeButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default PostTextModal;

