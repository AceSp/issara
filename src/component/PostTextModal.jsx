import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Modal from 'react-native-modal'; // Import Modal from react-native-modal

import { store } from '../utils/store';
const { width, height } = Dimensions.get('window');

const PostTextModal = ({ visible, onDismiss }) => {
  const { state: { me } } = useContext(store);
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
        <Text style={styles.modalText}>Empty Modal</Text>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PostTextModal;

