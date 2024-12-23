
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useQuery } from '@apollo/client';
import { launchImageLibrary } from 'react-native-image-picker';


import { colors } from '../../utils/constants';
import ME_SUBSCRIPTION from '../../graphql/subscriptions/meSub';
import GET_ME_QUERY from '../../graphql/queries/getMe';
import Loading from '../../component/Loading';
import { getMeData, store } from '../../utils/store';
import { TextInput } from 'react-native-paper';
import { iOSColors } from 'react-native-typography';
import UserPostHeader from './UserPostHeader';

const AVATAR_SIZE = 40;
const AVATAR_RADIUS = AVATAR_SIZE/2;

const UserPostScreen = (props) => {
  const { 
    showNew,
    feedCategory,
  } = props.route.params;

  const { state: { me } } = useContext(store);

  const [ text, setText ] = useState('');
  const [ image, setImage ] = useState({
    uri: null,
    name: '',
    type: ''
  });
  const [ input, setInput ] = useState([]);
  const [ category, setCategory ] = useState([]);

  const chooseImage = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
        // alert(JSON.stringify(response));s
        console.log('response', JSON.stringify(response));
        setImage({uri:response.uri, name: response.fileName, type: response.type});
        console.log(image);
      }
    });
  }

  function renderFileUri() {
    if (image.uri) {
      return <Image
        style={styles.previewImage}
        source={{ uri: image.uri }}
      />
    } else {
      return <Image
        
      />
    }
  }

  return (
    <View style={styles.root}>
      <UserPostHeader 
        {...me} 
        navigation={props.navigation} 
        text = {text} 
        setCategory={setCategory} 
        category={category}
        feedCategory={feedCategory}
        showNew={showNew} 
        />
      <View style={styles.wrapper}>
      {renderFileUri()}
      <TextInput onChangeText={value => setText(value)} />
      <View style={styles.mediaLine}>
        <View style={styles.button} onPress={chooseImage}>
          <Icon name="photo" type="font-awesome" color={colors.PRIMARY} />
          <Text> รูปภาพ</Text>
        </View>
        <View style={styles.button}>
          <Icon name="video-plus" type="material-community" size={30} color={colors.PRIMARY}  />
          <Text> วิดีโอ</Text>
        </View>
        <View style={styles.button}>
          <Icon name="link" type="entypo" size={30} color={colors.PRIMARY}  />
          <Text> ลิงค์</Text>
        </View>
      </View>
      </View>  
    </View> 
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: iOSColors.white,
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    flex: 9,
    width: '90%'
  },
  mediaLine: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button: {
    width: 90,
    height: 40,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  previewImage: {
    width: '90%',
    height: 300,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3,
  },
});

export default UserPostScreen;