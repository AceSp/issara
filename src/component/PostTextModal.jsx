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
  Button,
  Chip,
  IconButton
} from 'react-native-paper'

import { store } from '../utils/store';
import { iOSColors } from 'react-native-typography';
const { width, height } = Dimensions.get('window');

const PostTextModal = ({ 
  visible, 
  onDismiss, 
  haveShop,
  connectShop,
  setConnectShop,
  onPost,
  source
}) => {
  const { state: { me } } = useContext(store);
  const [text, setText] = useState('');

  const handleHashtagPress = () => {
    setText(prevText => prevText + ' #');
  };

  const extractTags = (text) => {
    const regex = /#(\w+)/g;
    const tags = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      tags.push(match[1]);
    }
    return tags;
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
        <View style={styles.bottomView}>
          <Button 
            onPress={handleHashtagPress}
            mode='outlined' 
            >
            # แฮชแท็ก
          </Button>
          {
            haveShop ?
            <Chip 
              selected={connectShop} 
              style={{
                backgroundColor: connectShop ? iOSColors.orange : iOSColors.lightGray,
                paddingTop: 5
              }} 
              textStyle={{
                color: connectShop ? 'white' : iOSColors.orange
              }}
              selectedColor={'white'}
              showSelectedCheck={true}
              icon={connectShop ? null : "link"} 
              onPress={() => setConnectShop(!connectShop)}
            >
              โพสต์โดยร้านค้า
            </Chip>
            : null
          }
          <Button 
            onPress={() => {
              const tags = extractTags(text);
              onPost(source, text, tags);
            }}
            mode='contained' 
            >
            โพสต์
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 12
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
    backgroundColor: iOSColors.lightGray,
  },
  hashtagButtonText: {
    fontSize: 16,
  },
});

export default PostTextModal;

