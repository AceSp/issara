import React, { memo, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions
} from 'react-native';
import {
  Card,
  IconButton,
  Text,
  TouchableRipple
} from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/th';
import { 
    materialTall, 
    iOSColors, 
    iOSUIKitTall 
} from 'react-native-typography';
import Modal from 'react-native-modal'; 
import { TouchableOpacity } from 'react-native-gesture-handler';

import { DEFAULT_AVATAR } from '../../utils/constants';
import ShopScreen from '../../screen/shopScreen/ShopScreen';
// import AdmobSponsor from './AdmobSponsor';

moment.locale('th');

const { width, height } = Dimensions.get('window');

function Sponsor({
  text,
  shop,
  navigation,
  isAdmob
}) {
  const [modalVisible, setIsModalVisible] = useState(false);
  const dismissModal = () => {
    setIsModalVisible(false)
  }
  return (
  <TouchableOpacity 
    onPress={() => setIsModalVisible(true)}
    style={styles.container}>
    <Image 
      source={{ uri: shop.avatar ? shop.avatar : DEFAULT_AVATAR }} 
      style={styles.avatar} />
    {/* <Image 
      source={{ uri: 'https://avatars.githubusercontent.com/u/97165289' }} 
      style={styles.avatar} /> */}
    <View style={styles.textContainer}>
      <Text style={styles.itemName}>{shop.itemName}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
    <Modal
      visible={modalVisible}
      onDismiss={dismissModal}
      isVisible={modalVisible}
      onBackdropPress={dismissModal}
      onSwipeComplete={dismissModal}
      // swipeDirection="down"
      // propagateSwipe={true}
      style={styles.modal} // Add style for modal
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>ผู้สนับสนุน</Text>
          <IconButton icon='close' onPress={dismissModal} />
        </View>
        <ShopScreen shopId={shop.id} navigation={navigation} />
      </View>
    </Modal>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 4,
    margin: 10,
    marginRight: 20,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 120
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: iOSColors.lightGray,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 24
  },
  itemName: {
    ...iOSUIKitTall.title3White,
    margin: 5
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.9,
    paddingBottom: 20,
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  text: {
    ...iOSUIKitTall.bodyWhite,
    margin: 5
  },
})

export default memo(Sponsor);
