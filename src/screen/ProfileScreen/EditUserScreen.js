import React, { useState, useEffect, useRef } from 'react';
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

moment.locale('th');

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function EditUserScreen(props) {

  const { 
    phoneNumberParam,
    websiteParam,
    emailParam,
    addressParam,
    districtParam,
    amphoeParam,
    provinceParam,
    zipcodeParam,
    infoParam
    } = props.route.params;

  const [ phone, setPhone ] = useState('');
  const [ phoneError, setPhoneError ] = useState(' ');
  const [ website, setWebsite ] = useState('');
  const [ websiteError, setWebsiteError ] = useState(' ');
  const [ email, setEmail ] = useState('');
  const [ emailError, setEmailError ] = useState(' ');
  const [ address, setAddress ] = useState('');
  const [ district, setDistrict ] = useState('');
  const [ amphoe, setAmphoe ] = useState('');
  const [ province, setProvince ] = useState('');
  const [ zipcode, setZipcode ] = useState(0);
  const [ info, setInfo ] = useState('');
  const [ districtVisible, setDisVis ] = useState(false);
  const [ amphoeVisible, setAmVis ] = useState(false);
  const [ provinceVisible, setProVis ] = useState(false);
  const [ zipcodeVisible, setZipVis ] = useState(false);
  const [ locationPermission, setLocationPermission ] = useState(false);

  const [ mapCoord, setMapCoord ] = useState({
    latitude: 13.75630,
    longitude: 100.50180,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035
  });
  const [ markerCoord, setMarkerCoord ] = useState({ latitude: 13.75630, longitude: 100.50180 });

  const [updateMe, {data, loading}] = useMutation(UPDATE_ME_MUTATION);
  const [getAddress, {data: address_data, loading: address_loading, error: address_error}] = useLazyQuery(GET_ADDRESS_QUERY);

  useEffect(() => {
      setPhone(phoneNumberParam);
      setWebsite(websiteParam);
      setEmail(emailParam);
      setAddress(addressParam);
      setDistrict(districtParam);
      setAmphoe(amphoeParam);
      setProvince(provinceParam);
      setZipcode(zipcodeParam);
      setInfo(infoParam);
  }, []);

  useEffect(() => {
      
    if(Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setLocationPermission(false);
              break;
            case RESULTS.DENIED:
              requestLocationPermission();
              break;
            case RESULTS.GRANTED:
              setLocationPermission(true);
              locateCurrentPosition();
              break;
            case RESULTS.BLOCKED:
              setLocationPermission(false);
              break;
          }
        })
    } /*else {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setLocationPermission(false);
              break;
            case RESULTS.DENIED:
              requestLocationPermission();
              break;
            case RESULTS.GRANTED:
              setLocationPermission(true);
              locateCurrentPosition();
              break;
            case RESULTS.BLOCKED:
              setLocationPermission(false);
              break;
          }
        })
    }*/
  },[])

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

  // $username: $username
  // $firstName: $firstName,
  // $lastName: $lastName,
  // $avatar: $avatar,
  // $headerPic: $headerPic,
  // $info: $info,
  // $email: $email,
  // $phoneNumber: $phoneNumber,
  // $website: $website,
  // $latitude: $latitude,
  // $longitude: $longitude,
  // $address: $address,
  // $district: $district,
  // $amphoe: $amphoe,
  // $province: $province,
  // $zipcode: $zipcode,
  // $category: $category,
  // $badgeCount: $badgeCount,
  // $notificationToken: $notificationToken,
  const submit = () => {
          updateMe({
              variables: {
                  phoneNumber: phone,
                  website: website,
                  email: email,
                  latitude: markerCoord.latitude,
                  longitude: markerCoord.longitude,
                  address: address,
                  district: district,
                  amphoe: amphoe,
                  province: province,
                  zipcode: zipcode,
                  info: info
              }
          });
    props.navigation.goBack();
  };

  const getDistrict = (value) => {
    getAddress({ variables: { district: value } });
  }

  const getAmphoe = (value) => {
    getAddress({ variables: { amphoe: value } });
  }

  const getProvince = (value) => {
    getAddress({ variables: { province: value } });
  }

  const getZipcode = (value) => {
    getAddress({ variables: { zipcode: value } });
  }

  const requestLocationPermission = async () => {
    if(Platform.OS === 'android') {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if(response === 'granted') locateCurrentPosition();
      else setLocationPermission(false);
    }/* else {
      const response = request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if(response === await 'granted') locateCurrentPosition();
      else setLocationPermission(false);
    }*/
  }

  const locateCurrentPosition = () => {

      Geolocation.getCurrentPosition(
        (position) => {
            //console.log(position);
            setMapCoord({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.035
          });

          setMarkerCoord({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  }

  return (
      <View style={styles.Root}>
          <ScrollView keyboardShouldPersistTaps="handled" >
              <KeyboardAvoidingView style={styles.viewInScroll}>
              <View>
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
              </View>
              <View>
                      <Input 
                        label="ที่อยู่"
                        labelStyle={styles.sectionText}
                        multiline={true}
                        placeholder='ที่อยู่..'
                        value={address}
                        onChangeText={(value)=>setAddress(value)}
                        inputStyle={{ marginLeft: 10 }}
                        leftIcon={{ color: colors.SECONDARY, name: "directions" }}
                      />
                      <View style={styles.addressRow}>
                        <View style={styles.addressView}>
                          <Text style={styles.addressText}>ตำบล</Text>
                          <TouchableHighlight style={styles.addressButton} onPress={() => setDisVis(true)} underlayColor={colors.LIGHT_GRAY}>
                            <Text>    {district} </Text>
                          </TouchableHighlight>
                        </View>
                        <View style={styles.addressView}>
                          <Text style={styles.addressText}>อำเภอ</Text>
                          <TouchableHighlight style={styles.addressButton} onPress={() => setAmVis(true)} underlayColor={colors.LIGHT_GRAY}>
                            <Text>    {amphoe} </Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                      <View style={styles.addressRow}>
                        <View style={styles.addressView}>
                          <Text style={styles.addressText}>จังหวัด</Text>
                          <TouchableHighlight style={styles.addressButton} onPress={() => setProVis(true)} underlayColor={colors.LIGHT_GRAY}>
                            <Text>    {province} </Text>
                          </TouchableHighlight>
                        </View>
                        <View style={styles.addressView}>
                          <Text style={styles.addressText}>รหัสไปรษณีย์</Text>
                          <TouchableHighlight style={styles.addressButton} onPress={() => setZipVis(true)} underlayColor={colors.LIGHT_GRAY}>
                            <Text>    {zipcode} </Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                      <MapView
                        style={{height: 200}}
                        provider={PROVIDER_GOOGLE}
                        region={mapCoord}
                        scrollEnabled={false}
                        onPress={() => props.navigation.navigate('Map', 
                        { 
                          mapParam: mapCoord,
                          setMapParam: setMapCoord,
                          setMarkerParam: setMarkerCoord 
                        })}
                      >
                        <Marker
                          coordinate={markerCoord}
                        >

                        </Marker>
                      </MapView>
                      <AddressList
                            visible={districtVisible}
                            setVisible={setDisVis}
                            setDistrict={setDistrict}
                            setAmphoe={setAmphoe}
                            setProvince={setProvince}
                            setZipcode={setZipcode}
                            address={address_data? address_data.getAddress : null} 
                            getAddress={getDistrict}
                      />
                      <AddressList
                            visible={amphoeVisible}
                            setVisible={setAmVis}
                            setDistrict={setDistrict}
                            setAmphoe={setAmphoe}
                            setProvince={setProvince}
                            setZipcode={setZipcode}
                            address={address_data? address_data.getAddress : null} 
                            getAddress={getAmphoe}
                      />
                      <AddressList
                            visible={provinceVisible}
                            setVisible={setProVis}
                            setDistrict={setDistrict}
                            setAmphoe={setAmphoe}
                            setProvince={setProvince}
                            setZipcode={setZipcode}
                            address={address_data? address_data.getAddress : null} 
                            getAddress={getProvince}
                      />
                      <AddressList
                            visible={zipcodeVisible}
                            setVisible={setZipVis}
                            setDistrict={setDistrict}
                            setAmphoe={setAmphoe}
                            setProvince={setProvince}
                            setZipcode={setZipcode}
                            address={address_data? address_data.getAddress : null} 
                            getAddress={getZipcode}
                      />
              </View>
              <View style={{marginTop: 20}}>
                      <Input
                        label="เพิ่มเติม"
                        labelStyle={styles.sectionText} 
                        multiline={true}
                        placeholder='เพิ่มเติม..'
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