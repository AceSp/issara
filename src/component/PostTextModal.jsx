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
      swipeDirection="down"
      propagateSwipe={true}
      style={styles.modal} // Add style for modal
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Comments</Text>
          <TouchableOpacity onPress={onDismiss}>
            <Icon name="close" size={24} color={iOSColors.black} />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalText}>Enter Text</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Type something..."
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.lightGray,
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

