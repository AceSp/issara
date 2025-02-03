import React, { useState, useEffect, useRef, useContext } from 'react';
import { 
    Text, 
    Keyboard,
    TouchableOpacity,
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Dimensions,
    TextInput,
    TouchableHighlight,
    Platform
} from 'react-native';
import {
    Avatar,
    Icon,
    Input,
    Button,
    Overlay
} from 'react-native-elements';
import {launchImageLibrary} from 'react-native-image-picker'
import BackgroundService from 'react-native-background-actions';

import moment from 'moment';
import 'moment/locale/th';
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { 
  request,
  check, 
  PERMISSIONS,
  RESULTS 
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

import { colors, distric } from '../../utils/constants';
import UPDATE_ME_MUTATION from '../../graphql/mutations/updateMe';
import GET_ADDRESS_QUERY from '../../graphql/queries/getAddress';
import CategoryItem from '../categoryScreen/CategoryItem';
import AddressList from './Component/AddressList';
import { store } from '../../utils/store';
import AvatarWrapper from '../../component/AvatarWrapper';
import { IconButton } from 'react-native-paper';
import uploadFileInChunks from '../../utils/uploadFileInChunks';
import { VIDEO_URL } from '../../utils/apollo-client';

moment.locale('th');

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function EditUserScreen(props) {

  const { state: { me } } = useContext(store);

  const [ firstName, setFirstName ] = useState('');
  const [ lastName, setLastName ] = useState('');
  const [ username, setUsername ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ phoneError, setPhoneError ] = useState(' ');
  const [ website, setWebsite ] = useState('');
  const [ websiteError, setWebsiteError ] = useState(' ');
  const [ email, setEmail ] = useState('');
  const [ emailError, setEmailError ] = useState(' ');
  const [ info, setInfo ] = useState('');

  const [updateMe, {data, loading}] = useMutation(UPDATE_ME_MUTATION);
  const [getAddress, {data: address_data, loading: address_loading, error: address_error}] = useLazyQuery(GET_ADDRESS_QUERY);

  useEffect(() => {
    if(me.phoneNumber)
      setPhone(me.phoneNumber);
    if(me.website)
      setWebsite(me.website);
    if(me.email)
      setEmail(me.email);
    if(me.info)
      setInfo(me.info);
  }, []);

  async function checkImagePermission() {
      if (Platform.OS === 'android') {
      const result = await check(PERMISSIONS.ANDROID.CAMERA)
      switch (result) {
          case RESULTS.UNAVAILABLE:
          console.log("unavailable")
          return false;
          case RESULTS.DENIED:
          console.log("denied")
          return false;
          case RESULTS.GRANTED:
          console.log("granted")
          return true;
          case RESULTS.BLOCKED:
          console.log("blocked")
          return false;
      }
      } else {
      const result = await check(PERMISSIONS.IOS.CAMERA)
      switch (result) {
          case RESULTS.UNAVAILABLE:
          console.log("unavailable")
          return false;
          case RESULTS.DENIED:
          console.log("denied")
          return false;
          case RESULTS.GRANTED:
          console.log("granted")
          return true;
          case RESULTS.BLOCKED:
          console.log("blocked")
          return false;
      }
      }
  };

  const openVideoGallery = async () => {
    await checkImagePermission()
    const options = {
        mediaType: 'image',
        includeBase64: false,
        assetRepresentationMode: 'current',
        maxHeight: 2000,
        maxWidth: 2000,
    };

    const result = await launchImageLibrary(options);
        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const source = result.uri || result.assets[0].uri;
            const fileName = result.fileName || result.assets[0].fileName
            console.log('Selected image:', source);
            console.log(result)
            handleUpload(fileName, source)
        }
  }

  const handleUpload = async (fileName, filePath) => {
      const options = {
          taskName: 'FileUpload',
          taskTitle: 'Uploading File',
          taskDesc: 'Progress',
          taskIcon: {
              name: 'ic_launcher',
              type: 'mipmap',
          },
          color: '#ff00ff',
          //change this for opening the app from notification
          linkingURI: 'uploadFile',
      };
      await BackgroundService.start(async () => {
          const sanitize = (name) => name.replace(/[^a-zA-Z0-9-_]/g, '_'); 
          const imageId = sanitize(fileName);
          const userId = sanitize(me.id);
          await uploadFileInChunks({ filePath, userId, imageId });
          await BackgroundService.updateNotification({
              taskDesc: 'File Uploaded',
          });
          const avatar = `${VIDEO_URL}images/${userId}/${imageId}.jpg`
          await updateMe({
              variables: {
                  avatar
              },
          })
      }, options);
  };

  const onPhoneNumChange = (value, previousValue) => {
    if (!value) return setPhone(value);
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;
    
    if (!previousValue || value.length > previousValue.length) {
        if (cvLength < 4) return setPhone(currentValue);
        if (cvLength < 7) return setPhone(`${currentValue.slice(0, 3)}-${currentValue.slice(3)}`);
        return setPhone(`${currentValue.slice(0, 3)}-${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`);
    }
  };

  const validatePhone = value => {
    if(!value) return setPhoneError(" ");
    const firstTwo = value.slice(0, 2);
    const test = firstTwo != '06' && firstTwo !='08' && firstTwo !='09'
    if (test || value.length !== 12) return setPhoneError('หมายเลขโทรศัพท์ไม่ถูกต้อง');
    setPhoneError(" ");
  };

  const validateWebsite = (value) => {
    if(!value) return setWebsiteError(' ');
    const res = value.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
    if(!res)
        setWebsiteError('เว็บไซต์ไม่ถูกต้อง');
    else
        setWebsiteError(' ');
  }

  const validateEmail = (value) => {
    if(!value) return setWebsiteError(' ');
    const res = value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(!res)
        setEmailError('เว็บไซต์ไม่ถูกต้อง');
    else
        setEmailError(' ');
  }

  const submit = () => {
          updateMe({
              variables: {
                  firstName,
                  lastName,
                  username,
                  website: website,
                  info: info
              }
          });
    props.navigation.goBack();
  };

  return (
      <View style={styles.Root}>
          <ScrollView keyboardShouldPersistTaps="handled" >
              <KeyboardAvoidingView style={styles.viewInScroll}>
              <View style={styles.avatarContainer}>
                      <AvatarWrapper
                          size={80}
                          style={styles.avatar}
                          uri={me.avatar}
                          label={me.itemName[0]}
                      />
                  <IconButton
                      icon="pencil"
                      iconColor="white"
                      size={20}
                      style={styles.editIconButton}
                      onPress={openVideoGallery}
                  />
              </View>
              <View>
                <Input 
                  label="ชื่อ"
                  labelStyle={styles.sectionText}
                  placeholder='ชื่อ..'
                  value={firstName}
                  onChangeText={(value)=>setFirstName(value)}
                  inputStyle={{ marginLeft: 10 }}
                />
              </View>
              <View>
                <Input 
                  label="นามสกุล"
                  labelStyle={styles.sectionText}
                  placeholder='นามสกุล..'
                  value={lastName}
                  onChangeText={(value)=>setLastName(value)}
                  inputStyle={{ marginLeft: 10 }}
                />
              </View>
              <View>
                <Input 
                  label="ชื่อผู้ใช้"
                  labelStyle={styles.sectionText}
                  placeholder='ชื่อผู้ใช้..'
                  value={username}
                  onChangeText={(value)=>setUsername(value)}
                  inputStyle={{ marginLeft: 10 }}
                />
              </View>
              {/* <View>
                      <Input 
                        label="เบอร์โทร"
                        labelStyle={styles.sectionText}
                        placeholder='เบอร์โทร..'
                        value={phone}
                        keyboardType={'phone-pad'}
                        onFocus={() => setPhone('')}
                        onBlur={() => validatePhone(phone)}
                        onChangeText={(value, previousValue)=>onPhoneNumChange(value, previousValue)}
                        inputStyle={{ marginLeft: 10 }}
                        leftIcon={{ color: colors.SECONDARY, name: "phone" }}
                        errorMessage={phoneError}
                      />
              </View>
              <View>
                      <Input
                        label="อีเมลล์"
                        labelStyle={styles.sectionText} 
                        placeholder='อีเมลล์..'
                        value={email}
                        onBlur={() => validateEmail(email)}
                        onChangeText={(value)=>setEmail(value)}
                        inputStyle={{ marginLeft: 10 }}
                        leftIcon={{ color: colors.SECONDARY, name: "email" }}
                        errorMessage={emailError}
                      />
              </View> */}
              <View>
                      <Input 
                        label="เว็บไซต์"
                        labelStyle={styles.sectionText}
                        placeholder='เว็บไซต์..'
                        value={website}
                        onBlur={() => validateWebsite(website)}
                        onChangeText={(value)=>setWebsite(value)}
                        inputStyle={{ marginLeft: 10 }}
                        leftIcon={{ color: colors.SECONDARY, type: "material-community", name: "web" }}
                        errorMessage={websiteError}
                      />
              </View>
              <View style={{marginTop: 20}}>
                      <Input
                        label="คำบรรยาย"
                        labelStyle={styles.sectionText} 
                        multiline={true}
                        placeholder='คำบรรยาย..'
                        value={info}
                        onChangeText={(value)=>setInfo(value)}
                        inputStyle={{ marginLeft: 10 }}
                      />
              </View>
              </KeyboardAvoidingView>
              
          </ScrollView>
            <Button onPress={() => submit()} title="แก้ไข" buttonStyle={styles.button} titleStyle={styles.buttonText} />  
      </View>
  )
}

const styles = StyleSheet.create({
    avatar: {
        alignSelf: 'center',
    },
    avatarContainer: {
        position: 'relative',
        width: 80,
        marginBottom: 20,
        alignItems: 'center',
        alignSelf: 'center',
    },
    editIconButton: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: colors.PRIMARY,
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2
    },
    Root: {     
        flex: 1,
        marginTop: 20
    },
    viewInScroll: {
      paddingHorizontal: 20,
      marginBottom: 30
    },
    switch: {
        height: 40,
        width: 200,
        marginLeft: 20,
        marginVertical: 15
    },
    categoryContainer: {
        flexDirection: 'row',
        width: 400,
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 80
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black'
    },
    inputBox: {
        width: '90%',
        borderColor: 'gray',
        borderWidth: 1,
        padding: 2,
        borderRadius: 10,
        margin: 10,
        marginLeft: 20,
        paddingHorizontal: 20,
        paddingVertical: 7,
        flexDirection: 'row', 
    },
    nameBox: { 
        height: 45,
        borderColor: 'gray',
        borderWidth: 1 ,
        borderRadius: 10,
        margin: 10,
        marginLeft: 20,
        paddingHorizontal: 10,
        flexDirection: 'row', 
    },
    rowFlex: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    groupPicIcon: {
        marginLeft: 10,
    },
    createButton: {
        padding: 10,
        paddingHorizontal: 30
    },
    button: {
        backgroundColor: colors.PRIMARY
    },
    buttonText: {
        fontSize: 25
    },
    addressButton: {
      borderBottomWidth: 1,
      borderRadius: 10,
      marginLeft: 5,
      paddingVertical: 10,
      width: width*0.35
    },
    addressView: {
      marginTop: 20,
      marginRight: 30
    },
    addressText: {
      fontSize: 20
    },
    addressRow: {
      flexDirection: 'row', 
      width: width*0.4, 
      marginLeft: 15,
    }
  })

export default EditUserScreen;