
import React, {
  useEffect,
  useState,
  useContext
} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Icon,
  Overlay
} from 'react-native-elements';
import {
  List,
  Button,
  Avatar
} from 'react-native-paper';
import { 
  useQuery, 
  useMutation 
} from '@apollo/client';
import {
  iOSColors
} from 'react-native-typography';
global.Buffer = global.Buffer || require('buffer').Buffer

import { AuthContext } from '../../utils/context';
import { colors } from '../../utils/constants';
import Loading from '../../component/Loading';
import MenuListItem from './Component/MenuListItem';
import { TextInput } from 'react-native-gesture-handler';
import { store } from '../../utils/store';
import AvatarWrapper from '../../component/AvatarWrapper';

const MenuScreen = (props) => {
  const { state: { me, accessToken } } = useContext(store);

  const { signOut } = React.useContext(AuthContext);

  const [overlayVisible, setVisible] = useState(false);
  const [text, setText] = useState('');

  const backDropPress = () => {
    setVisible(false);
    setText('');
  }

  async function externalShare() {
      try {
        const shareUrl = `https://playStorelink/referrer?=${accessToken}`
        await Share.open({
          message: `โหลดเลย ${shareUrl}`,
        });
      } catch (error) {
          console.log(error.message);
      }
  };

  return (
    <ScrollView>
      <View style={styles.Root}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('MyProfile')}
          style={styles.menuRow}
        >
          <AvatarWrapper
            label={me?.itemName[0]}
            size={40}
            color={iOSColors.white}
            uri={me?.avatar}
            style={{
              marginRight: 10
            }}
            labelStyle={{
              fontSize: 30,
              marginBottom: 7
            }}
          />
          <View>
            <Text style={[styles.nameText, styles.textBold]}>{me?.itemName}</Text>
          </View>
        </TouchableOpacity>
        <MenuListItem
          onPress={() => props.navigation.navigate('Subscription')}
          name="การติดตาม"
          iconName="cast-connected"
        />
        {/* <MenuListItem
          onPress={() => props.navigation.navigate('Streaming')}
          name="ไลฟ์สด"
          iconName="video-wireless"
          iconType="material-community"
        /> */}
        <MenuListItem
          onPress={() => props.navigation.navigate('MyShop')}
          name="ร้านค้าของคุณ"
          iconName="archive"
          iconType="entypo"
          buttonLabel="ลงขาย"
          buttonPress={() => props.navigation.navigate('PostShopPicture')}
        />
        <MenuListItem
          onPress={() => props.navigation.navigate('ManageAd')}
          name="โฆษณาของคุณ"
          iconName="megaphone"
          iconType="entypo"
        />
        <MenuListItem
          onPress={() => props.navigation.navigate('UserIncome')}
          name="รายได้ของคุณ"
          iconName="table"
          iconType="material-community"
        />
        <MenuListItem
          onPress={externalShare}
          name="แชร์แอพ"
          iconName="share-variant"
          iconType="material-community"
        />
        <MenuListItem
          onPress={signOut}
          name="ออกจากระบบ"
          iconName="logout"
          iconType="material-community"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  Root: {
    alignItems: 'stretch',
  },
  menuRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center'
  },
  icon: {
    backgroundColor: colors.LIGHT_GREY_2,
    borderRadius: 20,
    padding: 5,
    marginRight: 15
  },
  avatar: {
    marginRight: 20
  },
  nameText: {
    fontSize: 20
  },
  textBold: {
    fontWeight: 'bold'
  },
  pageList: {
    paddingHorizontal: 20,
    backgroundColor: 'white'
  },
  viewMore: {
    backgroundColor: colors.LIGHT_RED
  },
  button: {
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10
  },
  overlay: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    paddingBottom: 0
  },
  inputBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    margin: 2,
    marginTop: 10
  },
  buttonText: {
    fontSize: 20,
    color: colors.PRIMARY
  },
  titleText: {
    fontSize: 20,
  }
})

export default MenuScreen;