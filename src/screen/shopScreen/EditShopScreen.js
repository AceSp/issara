import React, { useEffect, useState, useRef, memo, useLayoutEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  TouchableRipple, 
  TextInput,
  Switch,
  Checkbox,
  Button
} from 'react-native-paper';
import { 
  request,
  check, 
  PERMISSIONS,
  RESULTS 
} from 'react-native-permissions';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';
import SwitchSelector from 'react-native-switch-selector';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import Loading from '../../component/Loading';
import GET_ADDRESS_QUERY from '../../graphql/queries/getAddress';
import UPDATE_SHOP_MUTATION from '../../graphql/mutations/updateShop';
import AddressList from '../ProfileScreen/Component/AddressList';
import { colors } from '../../utils/constants';
import Category from './component/Category';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const OpenTimeInput = (props) => {
/*these are the props
 *day = name of the day in label
 *setCheckBoxStatus
 *checkboxStatus = is checkbox tick?
 *setOpenHour
 *setOpenMinute
 *setCloseHour
 *setCloseMinute
 *openHour
 *openMinute
 *closeHour
 *closeMinute
 */

  const openMinuteRef = useRef();
  const closeMinuteRef = useRef();

  const onHourChange = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const intValue = parseInt(currentValue);
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 2) {
        if(intValue <= 2) return currentValue;
        return '';
      }
      if (cvLength < 3) {
        if(intValue < 24) return currentValue;
        return `${currentValue.slice(0, 1)}`;
      }
    }  
  };

  const onMinuteChange = (value, previousValue) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const intValue = parseInt(currentValue);
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 2) {
        if(intValue <= 5) return currentValue;
        return '';
      }
      if (cvLength < 3) {
        if(intValue <= 59) return currentValue;
        return `${currentValue.slice(0, 1)}`;
      }
    } 
  };

  const unfinishedInput = (value) => {
    if(value.length === 0) return `00`;
    if(value.length < 2) return `0${value}`;
    return value;
  }

  return(
    <View>
      <Checkbox.Item 
        label={props.day}
        labelStyle={materialTall.title}
        color={iOSColors.orange}
        onPress={() => props.setCheckBoxStatus(!props.checkBoxStatus) }
        status={props.checkBoxStatus? "checked" : "unchecked"}
      />
      {props.checkBoxStatus && (
        <View style={styles.openDayRow}>
        <View style={styles.openTimeRow}>
          <TextInput 
            mode="outlined"
            style={materialTall.headline}
            value={props.openHour}
            maxLength={2}
            keyboardType={'numeric'}
            onFocus={() => props.setOpenHour('')}
            onChangeText={(value, previousValue)=> {
              props.setOpenHour(onHourChange(value, previousValue));
              if(value.length === 2) openMinuteRef.current.focus();
            }}
            onBlur={() => props.setOpenHour(unfinishedInput(props.openHour))}
            />
          <TextInput 
            mode="outlined"
            style={materialTall.headline}
            value={props.openMinute}
            maxLength={2}
            keyboardType={'numeric'}
            onFocus={() => props.setOpenMinute('')}
            onChangeText={(value, previousValue) => props.setOpenMinute(onMinuteChange(value, previousValue))}
            onBlur={() => props.setOpenMinute(unfinishedInput(props.openMinute))}
            ref={openMinuteRef}
            />
        </View>
        <Text style={materialTall.headline}>ถึง</Text>
        <View style={styles.openTimeRow}>
          <TextInput 
            mode="outlined"
            style={materialTall.headline}
            value={props.closeHour}
            maxLength={2}
            keyboardType={'numeric'}
            onFocus={() => props.setCloseHour('')}
            onChangeText={(value, previousValue)=> {
              props.setCloseHour(onHourChange(value, previousValue));
              if(value.length === 2) closeMinuteRef.current.focus();
            }}
            onBlur={() => props.setCloseHour(unfinishedInput(props.closeHour))}
            />
          <TextInput 
            mode="outlined"
            style={materialTall.headline}
            value={props.closeMinute}
            maxLength={2}
            keyboardType={'numeric'}
            onFocus={() => props.setCloseMinute('')}
            onChangeText={(value, previousValue) => props.setCloseMinute(onMinuteChange(value, previousValue))}
            onBlur={() => props.setCloseMinute(unfinishedInput(props.closeMinute))}
            ref={closeMinuteRef}
            />
        </View>
      </View>
      )}
      
    </View>
  )
}

const EditShopScreen = (props) => {

  const {
    idParam,  
    nameParam,   
    categoryParam,       
    typeParam,   
    haveStoreFrontParam,             
    haveOnlineParam,         
    addressParam,      
    tambonParam,       
    amphoeParam,     
    changwatParam,       
    latitudeParam,       
    longitudeParam,        
    openTimeParam,       
    phoneNumberParam,          
    websiteParam,      
    emailParam,    
    phraseParam,     
    descriptionParam
  } = props.route.params;

  const [ name, setName ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ shopType, setShopType ] = useState('');
  const [ haveStoreFront, setHaveStoreFront ] = useState(true);
  const [ haveOnline, setHaveOnline ] = useState(true);
  const [ address, setAddress ] = useState('');
  const [ tambon, setTambon ] = useState('');
  const [ amphoe, setAmphoe ] = useState('');
  const [ changwat, setChangwat ] = useState('');
  const [ phone, setPhone ] = useState('');
  const [ website, setWebsite ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ phrase, setPhrase ] = useState('');
  const [ description, setDescription ] = useState('');

  const [ mapCoord, setMapCoord ] = useState({
    latitude: 13.75630,
    longitude: 100.50180,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035
  });
  const [ markerCoord, setMarkerCoord ] = useState({ latitude: 13.75630, longitude: 100.50180 });

  const [ monday, setMonday ] = useState(false);
  const [ mondayOpenHour, setMondayOpenHour ] = useState('08');
  const [ mondayOpenMinute, setMondayOpenMinute ] = useState('00');
  const [ mondayCloseHour, setMondayCloseHour ] = useState('17');
  const [ mondayCloseMinute, setMondayCloseMinute ] = useState('00');
  const [ tuesday, setTuesday ] = useState(false);
  const [ tuesdayOpenHour, setTuesdayOpenHour ] = useState('08');
  const [ tuesdayOpenMinute, setTuesdayOpenMinute ] = useState('00');
  const [ tuesdayCloseHour, setTuesdayCloseHour ] = useState('17');
  const [ tuesdayCloseMinute, setTuesdayCloseMinute ] = useState('00');
  const [ wednesday, setWednesday ] = useState(false);
  const [ wednesdayOpenHour, setWednesdayOpenHour ] = useState('08');
  const [ wednesdayOpenMinute, setWednesdayOpenMinute ] = useState('00');
  const [ wednesdayCloseHour, setWednesdayCloseHour ] = useState('17');
  const [ wednesdayCloseMinute, setWednesdayCloseMinute ] = useState('00');
  const [ thursday, setThursday ] = useState(false);
  const [ thursdayOpenHour, setThursdayOpenHour ] = useState('08');
  const [ thursdayOpenMinute, setThursdayOpenMinute ] = useState('00');
  const [ thursdayCloseHour, setThursdayCloseHour ] = useState('17');
  const [ thursdayCloseMinute, setThursdayCloseMinute ] = useState('00');
  const [ friday, setFriday ] = useState(false);
  const [ fridayOpenHour, setFridayOpenHour ] = useState('08');
  const [ fridayOpenMinute, setFridayOpenMinute ] = useState('00');
  const [ fridayCloseHour, setFridayCloseHour ] = useState('17');
  const [ fridayCloseMinute, setFridayCloseMinute ] = useState('00');
  const [ saturday, setSaturday ] = useState(false);
  const [ saturdayOpenHour, setSaturdayOpenHour ] = useState('08');
  const [ saturdayOpenMinute, setSaturdayOpenMinute ] = useState('00');
  const [ saturdayCloseHour, setSaturdayCloseHour ] = useState('17');
  const [ saturdayCloseMinute, setSaturdayCloseMinute ] = useState('00');
  const [ sunday, setSunday ] = useState(false);
  const [ sundayOpenHour, setSundayOpenHour ] = useState('08');
  const [ sundayOpenMinute, setSundayOpenMinute ] = useState('00');
  const [ sundayCloseHour, setSundayCloseHour ] = useState('17');
  const [ sundayCloseMinute, setSundayCloseMinute ] = useState('00');

  const [ categoryVisible, setCateVis ] = useState(false);
  const [ tambonVisible, setDisVis ] = useState(false);
  const [ amphoeVisible, setAmVis ] = useState(false);
  const [ changwatVisible, setProVis ] = useState(false);

  const [ nameError, setNameError ] = useState(false);
  const [ categoryError, setCategoryError ] = useState(false);
  const [ typeError, setTypeError ] = useState(false);
  const [ tambonError, setDisError ] = useState(false);
  const [ amphoeError, setAmError ] = useState(false);
  const [ changwatError, setProError ] = useState(false);
  const [ phoneError, setPhoneError ] = useState(false);
  const [ websiteError, setWebsiteError ] = useState(false);
  const [ emailError, setEmailError ] = useState(false);

  const [ phoneErrorText, setPhoneErrorText ] = useState('');

  const [updateShop, {data, loading, error}] = useMutation(UPDATE_SHOP_MUTATION
    ,
    {
      onCompleted: (data) => {
        props.navigation.navigate('Shop', 
          {
            id: data.updateShop.id
          });
        
    }
    }
    );

  const [getAddress, {data: address_data, loading: address_loading, error: address_error}] = useLazyQuery(GET_ADDRESS_QUERY);

  useEffect(() => {
     if(nameParam) setName(nameParam);
     if(categoryParam) setCategory(categoryParam);
     if(typeParam) setShopType(typeParam);
     if(haveStoreFrontParam) setHaveStoreFront(haveStoreFrontParam);
     if(haveOnlineParam) setHaveOnline(haveOnlineParam);
     if(addressParam) setAddress(addressParam);
     if(tambonParam) setTambon(tambonParam);
     if(amphoeParam) setAmphoe(amphoeParam);
     if(changwatParam) setChangwat(changwatParam);
     if(latitudeParam) {
         setMapCoord({
            latitude: latitudeParam,
            longitude: longitudeParam,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035
          });
         setMarkerCoord({latitude: latitudeParam, longitude: longitudeParam});
     }

     if(openTimeParam) {
         if(openTimeParam.monday.length > 0) {
             setMonday(true);
             setMondayOpenHour(openTimeParam.monday[0].opens.slice(0, 2));
             setMondayOpenMinute(openTimeParam.monday[0].opens.slice(3, 5));
             setMondayCloseHour(openTimeParam.monday[0].closes.slice(0, 2));
             setMondayCloseMinute(openTimeParam.monday[0].closes.slice(3, 5));
         }
         if(openTimeParam.tuesday.length > 0) {
            setTuesday(true);
            setTuesdayOpenHour(openTimeParam.tuesday[0].opens.slice(0, 2));
            setTuesdayOpenMinute(openTimeParam.tuesday[0].opens.slice(3, 5));
            setTuesdayCloseHour(openTimeParam.tuesday[0].closes.slice(0, 2));
            setTuesdayCloseMinute(openTimeParam.tuesday[0].closes.slice(3, 5));
        }
        if(openTimeParam.wednesday.length > 0) {
            setWednesday(true);
            setWednesdayOpenHour(openTimeParam.wednesday[0].opens.slice(0, 2));
            setWednesdayOpenMinute(openTimeParam.wednesday[0].opens.slice(3, 5));
            setWednesdayCloseHour(openTimeParam.wednesday[0].closes.slice(0, 2));
            setWednesdayCloseMinute(openTimeParam.wednesday[0].closes.slice(3, 5));
        }
        if(openTimeParam.thursday.length > 0) {
            setThursday(true);
            setThursdayOpenHour(openTimeParam.thursday[0].opens.slice(0, 2));
            setThursdayOpenMinute(openTimeParam.thursday[0].opens.slice(3, 5));
            setThursdayCloseHour(openTimeParam.thursday[0].closes.slice(0, 2));
            setThursdayCloseMinute(openTimeParam.thursday[0].closes.slice(3, 5));
        }
        if(openTimeParam.friday.length > 0) {
            setFriday(true);
            setFridayOpenHour(openTimeParam.friday[0].opens.slice(0, 2));
            setFridayOpenMinute(openTimeParam.friday[0].opens.slice(3, 5));
            setFridayCloseHour(openTimeParam.friday[0].closes.slice(0, 2));
            setFridayCloseMinute(openTimeParam.friday[0].closes.slice(3, 5));
        }
        if(openTimeParam.saturday.length > 0) {
            setSaturday(true);
            setSaturdayOpenHour(openTimeParam.saturday[0].opens.slice(0, 2));
            setSaturdayOpenMinute(openTimeParam.saturday[0].opens.slice(3, 5));
            setSaturdayCloseHour(openTimeParam.saturday[0].closes.slice(0, 2));
            setSaturdayCloseMinute(openTimeParam.saturday[0].closes.slice(3, 5));
        }
        if(openTimeParam.sunday.length > 0) {
            setSunday(true);
            setSundayOpenHour(openTimeParam.sunday[0].opens.slice(0, 2));
            setSundayOpenMinute(openTimeParam.sunday[0].opens.slice(3, 5));
            setSundayCloseHour(openTimeParam.sunday[0].closes.slice(0, 2));
            setSundayCloseMinute(openTimeParam.sunday[0].closes.slice(3, 5));
        }
     };

     if(phoneNumberParam) setPhone(phoneNumberParam);
     if(websiteParam) setWebsite(websiteParam);
     if(emailParam) setEmail(emailParam);
     if(phraseParam) setPhrase(phraseParam);
     if(descriptionParam) setDescription(descriptionParam);
  },[])

  useEffect(() => {
    if(latitudeParam) return;
    if(Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              requestLocationPermission();
              break;
            case RESULTS.GRANTED:
              locateCurrentPosition();
              break;
            case RESULTS.BLOCKED:
              break;
          }
        })
    } /*else {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              requestLocationPermission();
              break;
            case RESULTS.GRANTED:
              locateCurrentPosition();
              break;
            case RESULTS.BLOCKED:
              break;
          }
        })
    }*/
  },[])

  const haveStoreFrontSwitch = () => {
    if(!haveOnline && haveStoreFront) setHaveOnline(true);
    setHaveStoreFront(!haveStoreFront);
  }

  const haveOnlineSwitch = () => {
    if(haveOnline && !haveStoreFront) setHaveStoreFront(true);
    setHaveOnline(!haveOnline);
  }

  const getTambon = (value) => {
    getAddress({ variables: { tambon: value } });
  }

  const getAmphoe = (value) => {
    getAddress({ variables: { amphoe: value } });
  }

  const getChangwat = (value) => {
    getAddress({ variables: { changwat: value } });
  }

  const validatePhone = value => {
    if(!value || value === '') {
      setPhoneError(true);
      setPhoneErrorText('โปรดระบุหมายเลขโทรศัพท์');
      return
    } 
    const firstTwo = value.slice(0, 2);
    const test = firstTwo != '06' && firstTwo !='08' && firstTwo !='09'
    if (test || value.length !== 12) {
      setPhoneError(true);
      setPhoneErrorText('หมายเลขโทรศัพท์ไม่ถูกต้อง');
      return 
    } 
    return setPhoneError(false);
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

  const validateWebsite = (value) => {
    if(!value) return setWebsiteError(false);
    const res = value.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm);
    if(!res)
        setWebsiteError(true);
    else
        setWebsiteError(false);
  }

  const validateEmail = (value) => {
    if(!value) return setEmailError(false);
    const res = value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(!res)
        setEmailError(true);
    else
        setEmailError(false);
  }

  const requestLocationPermission = async () => {
    if(Platform.OS === 'android') {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if(response === 'granted') locateCurrentPosition();
    }/* else {
      const response = request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if(response === await 'granted') locateCurrentPosition();
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
            //console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  }

  const validateShop = () => {
    let haveError = false;
    if(name === '') {
      setNameError(true);
      haveError = true;
    }
    if(category === '') {
      setCategoryError(true);
      haveError = true;
    }
    if(shopType === '') {
      setTypeError(true);
      haveError = true;
    }  
    if(tambon === '') {
      setDisError(true);
      haveError = true;
    }
    if(amphoe === '') {
      setAmError(true);
      haveError = true;
    }
    if(changwat === '') {
      setProError(true);
      haveError = true;
    }
    if(haveError) return true
    else return false
  }

  const submit = () => {
    if(validateShop()) return;
    updateShop({
      variables: {
        id: idParam,
        name,
        category,
        type: shopType,
        haveStoreFront,
        haveOnline,
        address,
        tambon,
        amphoe,
        changwat,
        latitude: markerCoord.latitude,
        longitude:markerCoord.longitude,
        openTime: {
          monday: monday? 
            [
              {
                opens: `${mondayOpenHour}:${mondayOpenMinute}`, 
                closes: `${mondayCloseHour}:${mondayCloseMinute}`
              }
            ]
            : []
            ,
          tuesday: tuesday? 
            [
              {
                opens: `${tuesdayOpenHour}:${tuesdayOpenMinute}`, 
                closes: `${tuesdayCloseHour}:${tuesdayCloseMinute}`
              }
            ]
            : []
            ,
          wednesday: wednesday? 
            [
              {
                opens: `${wednesdayOpenHour}:${wednesdayOpenMinute}`, 
                closes: `${wednesdayCloseHour}:${wednesdayCloseMinute}`
              }
            ]
            : []
            ,
          thursday: thursday? 
            [
              {
                opens: `${thursdayOpenHour}:${thursdayOpenMinute}`, 
                closes: `${thursdayCloseHour}:${thursdayCloseMinute}`
              }
            ]
            : []
            ,
          friday: friday? 
            [
              {
                opens: `${fridayOpenHour}:${fridayOpenMinute}`, 
                closes: `${fridayCloseHour}:${fridayCloseMinute}`
              }
            ]
            : []
            ,
          saturday: saturday? 
            [
              {
                opens: `${saturdayOpenHour}:${saturdayOpenMinute}`, 
                closes: `${saturdayCloseHour}:${saturdayCloseMinute}`
              }
            ]
            : []
            ,
          sunday: sunday? 
            [
              {
                opens: `${sundayOpenHour}:${sundayOpenMinute}`, 
                closes: `${sundayCloseHour}:${sundayCloseMinute}`
              }
            ]
            : []
          },
        phoneNumber: phone,
        website,
        email,
        phrase,
        description
      }
    });
  };

  return (
    
    <View style={styles.Root}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView>
            <View style={styles.sectionView}>
              <TextInput 
                label="ชื่อร้านค้า"
                style={[materialTall.headline, styles.textInput]}
                value={name}
                maxLength={80}
                onFocus={() => setNameError(false)}
                onChangeText={(value) => setName(value)}
                selectionColor="black"
                error={nameError}
               />
                <View style={styles.underName}>
                  <View>
                    {nameError? <Text style={{ color: colors.ERROR }}>โปรดระบุชื่อร้านค้า</Text> : null }
                  </View>
                  <Text style={[materialTall.caption, styles.textInputCoun]}>{name.length}/80</Text>
                </View>
                <View> 
                  <TouchableRipple 
                    style={[styles.inputButton, { borderColor: categoryError? colors.ERROR : iOSColors.midGray }]} 
                    onPress={() => {
                      setCateVis(true);
                      setCategoryError(false);
                    }} 
                  >
                    <View>
                      {category == ''? null : <Text style={styles.label}>หมวดหมู่</Text>}
                      {category == ''? 
                            <Text style={[
                              styles.placeholderText, 
                              materialTall.headline, 
                              { 
                                color: categoryError? colors.ERROR : materialColors.blackSecondary, 
                                paddingBottom: 5 
                              }]}
                              >
                              หมวดหมู่
                            </Text> 
                            : 
                            <Text style={[
                              materialTall.headline, 
                              styles.placeholderText, 
                              { color: 'black' }]}
                              >
                              {category}
                            </Text>} 
                    </View>
                  </TouchableRipple>
                  {categoryError? <Text style={styles.errorText}>โปรดระบุหมวดหมู่</Text> : null }
                </View>
                <Category
                  visible={categoryVisible}
                  setVisible={setCateVis}
                  setCategory={setCategory}
                  />
                <View style={styles.typeView}>
                  <Text style={materialTall.title}>ประเภท</Text>
                  <SwitchSelector
                    style={{flex: 0.75, marginLeft: 20}}
                    buttonColor={colors.PRIMARY}
                    selectedColor="white"
                    textColor={materialColors.blackPrimary}
                    textStyle={materialTall.subheading}
                    selectedTextStyle={materialTall.body2White}
                    backgroundColor={colors.LIGHT_GREY_2}
                    hasPadding
                    options={[
                      { label: "ผลิต", value: 'ผลิต'},
                      { label: "จำหน่าย", value: 'จำหน่าย'}, 
                      { label: "บริการ", value: 'บริการ'}
                    ]}
                    onPress={(value) => {
                      setTypeError(false);
                      setShopType(value);
                    }}
                    />
              </View>
              {typeError? <Text style={styles.errorText}>โปรดเลือกประเภท</Text> : null }
              <View style={styles.typeView}>
                <Text style={materialTall.title}>มีหน้าร้าน</Text>
                <View style={styles.switchView}>
                  {
                  haveStoreFront? 
                    <Text style={materialTall.headline}>มี</Text> 
                    : 
                    <Text style={materialTall.headline}>ไม่มี</Text>  
                  }
                  <Switch 
                    value={haveStoreFront} 
                    onValueChange={haveStoreFrontSwitch} 
                    color={iOSColors.orange} 
                    style={{ marginRight: 30, marginLeft: 10 }}
                    />
                </View>  
              </View>
              <View style={styles.typeView}>
                <Text style={materialTall.title}>ออนไลน์</Text>
                <View style={styles.switchView}>
                  {
                  haveOnline? 
                    <Text style={materialTall.headline}>มี</Text> 
                    : 
                    <Text style={materialTall.headline}>ไม่มี</Text>  
                  }
                  <Switch 
                    value={haveOnline} 
                    onValueChange={haveOnlineSwitch} 
                    color={iOSColors.orange} 
                    style={{ marginRight: 30, marginLeft: 10 }}
                    />
                </View>
              </View>
            </View>
            <View style={haveStoreFront? styles.sectionView : { display: 'none' }}>
              <Text style={[materialTall.title, { color: 'black' }]}>พื้นที่</Text>
              <TextInput 
                label="ที่อยู่"
                style={[materialTall.headline, styles.textInput]}
                value={address}
                onChangeText={(value) => setAddress(value)}
                selectionColor="black"
               />
              <View style={styles.rowView}>
                <Text style={materialTall.title}>ตำบล</Text>
                <View>
                  <TouchableRipple 
                    style={[
                      styles.rightInputButton, 
                      styles.addressButton,
                      { borderColor: tambonError? colors.ERROR : iOSColors.midGray }
                    ]} 
                    onPress={() => { 
                      setDisVis(true);
                      setDisError(false);
                      setAmError(false);
                      setProError(false);
                    }} 
                    underlayColor={colors.LIGHT_GRAY}
                  >
                    <Text style={[materialTall.headline, { color: 'black' }]}>    {tambon} </Text>
                  </TouchableRipple>
                  {tambonError? <Text style={styles.errorText}>โปรดระบุตำบล</Text> : null }
                </View>
              </View>
              <View style={styles.rowView}>
                <Text style={materialTall.title}>อำเภอ</Text>
                <View>
                  <TouchableRipple 
                    style={[
                      styles.rightInputButton, 
                      styles.addressButton, 
                      { borderColor: amphoeError? colors.ERROR : iOSColors.midGray 
                    }]} 
                    onPress={() => { 
                      setAmVis(true);
                      setDisError(false);
                      setAmError(false);
                      setProError(false);
                    }} 
                    underlayColor={colors.LIGHT_GRAY}
                  >
                    <Text style={[materialTall.headline, { color: 'black' }]}>    {amphoe} </Text>
                  </TouchableRipple>
                  {amphoeError? <Text style={styles.errorText}>โปรดระบุอำเภอ</Text> : null }
                </View>
              </View>
              <View style={styles.rowView}>
                <Text style={materialTall.title}>จังหวัด</Text>
                <View>
                  <TouchableRipple 
                    style={[
                      styles.rightInputButton, 
                      styles.addressButton,
                      { borderColor: changwatError? colors.ERROR : iOSColors.midGray }
                    ]} 
                    onPress={() => { 
                      setProVis(true);
                      setDisError(false);
                      setAmError(false);
                      setProError(false);
                    }} 
                    underlayColor={colors.LIGHT_GRAY}
                  >
                    <Text style={[materialTall.headline, { color: 'black' }]}>    {changwat} </Text>
                  </TouchableRipple>
                  {changwatError? <Text style={styles.errorText}>โปรดระบุจังหวัด</Text> : null }
                </View>
              </View>
              <AddressList
                    visible={tambonVisible}
                    setVisible={setDisVis}
                    setTambon={setTambon}
                    setAmphoe={setAmphoe}
                    setChangwat={setChangwat}
                    address={address_data? address_data.getAddress : null} 
                    getAddress={getTambon}
              />
              <AddressList
                    visible={amphoeVisible}
                    setVisible={setAmVis}
                    setTambon={setTambon}
                    setAmphoe={setAmphoe}
                    setChangwat={setChangwat}
                    address={address_data? address_data.getAddress : null} 
                    getAddress={getAmphoe}
              />
              <AddressList
                    visible={changwatVisible}
                    setVisible={setProVis}
                    setTambon={setTambon}
                    setAmphoe={setAmphoe}
                    setChangwat={setChangwat}
                    address={address_data? address_data.getAddress : null} 
                    getAddress={getChangwat}
              />
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
            </View>
            <View style={haveStoreFront? styles.sectionView : { display: 'none' }}>
              <Text style={[materialTall.title, { color: 'black' }]}>เวลาเปิด</Text>
              <OpenTimeInput 
                day="วันจันทร์"
                checkBoxStatus={monday}
                setCheckBoxStatus={setMonday}
                openHour={mondayOpenHour}
                openMinute={mondayOpenMinute}
                closeHour={mondayCloseHour}
                closeMinute={mondayCloseMinute}
                setOpenHour={setMondayOpenHour}
                setOpenMinute={setMondayOpenMinute}
                setCloseHour={setMondayCloseHour}
                setCloseMinute={setMondayCloseMinute}
                />
              <OpenTimeInput 
                day="วันอังคาร"
                checkBoxStatus={tuesday}
                setCheckBoxStatus={setTuesday}
                openHour={tuesdayOpenHour}
                openMinute={tuesdayOpenMinute}
                closeHour={tuesdayCloseHour}
                closeMinute={tuesdayCloseMinute}
                setOpenHour={setTuesdayOpenHour}
                setOpenMinute={setTuesdayOpenMinute}
                setCloseHour={setTuesdayCloseHour}
                setCloseMinute={setTuesdayCloseMinute}
                />
              <OpenTimeInput 
                day="วันพุธ"
                checkBoxStatus={wednesday}
                setCheckBoxStatus={setWednesday}
                openHour={wednesdayOpenHour}
                openMinute={wednesdayOpenMinute}
                closeHour={wednesdayCloseHour}
                closeMinute={wednesdayCloseMinute}
                setOpenHour={setWednesdayOpenHour}
                setOpenMinute={setWednesdayOpenMinute}
                setCloseHour={setWednesdayCloseHour}
                setCloseMinute={setWednesdayCloseMinute}
                />
              <OpenTimeInput 
                day="วันพฤหัส"
                checkBoxStatus={thursday}
                setCheckBoxStatus={setThursday}
                openHour={thursdayOpenHour}
                openMinute={thursdayOpenMinute}
                closeHour={thursdayCloseHour}
                closeMinute={thursdayCloseMinute}
                setOpenHour={setThursdayOpenHour}
                setOpenMinute={setThursdayOpenMinute}
                setCloseHour={setThursdayCloseHour}
                setCloseMinute={setThursdayCloseMinute}
                />
              <OpenTimeInput 
                day="วันศุกร์"
                checkBoxStatus={friday}
                setCheckBoxStatus={setFriday}
                openHour={fridayOpenHour}
                openMinute={fridayOpenMinute}
                closeHour={fridayCloseHour}
                closeMinute={fridayCloseMinute}
                setOpenHour={setFridayOpenHour}
                setOpenMinute={setFridayOpenMinute}
                setCloseHour={setFridayCloseHour}
                setCloseMinute={setFridayCloseMinute}
                />
              <OpenTimeInput 
                day="วันเสาร์"
                checkBoxStatus={saturday}
                setCheckBoxStatus={setSaturday}
                openHour={saturdayOpenHour}
                openMinute={saturdayOpenMinute}
                closeHour={saturdayCloseHour}
                closeMinute={saturdayCloseMinute}
                setOpenHour={setSaturdayOpenHour}
                setOpenMinute={setSaturdayOpenMinute}
                setCloseHour={setSaturdayCloseHour}
                setCloseMinute={setSaturdayCloseMinute}
                />
              <OpenTimeInput 
                day="วันอาทิตย์"
                checkBoxStatus={sunday}
                setCheckBoxStatus={setSunday}
                openHour={sundayOpenHour}
                openMinute={sundayOpenMinute}
                closeHour={sundayCloseHour}
                closeMinute={sundayCloseMinute}
                setOpenHour={setSundayOpenHour}
                setOpenMinute={setSundayOpenMinute}
                setCloseHour={setSundayCloseHour}
                setCloseMinute={setSundayCloseMinute}
                />
            </View>
            <View style={styles.sectionView}>
              <TextInput 
                label="เบอร์โทร"
                style={[materialTall.headline, styles.textInput]}
                value={phone}
                onFocus={() => setPhone('')}
                onBlur={() => validatePhone(phone)}
                keyboardType={'phone-pad'}
                onChangeText={(value, previousValue)=>onPhoneNumChange(value, previousValue)}
                error={phoneError}
                />
                {phoneError? <Text style={styles.errorText}>{phoneErrorText}</Text> : null }
              <TextInput 
                label="เว็บไซต์"
                style={[materialTall.headline, styles.textInput]}
                value={website}
                onBlur={() => validateWebsite(website)}
                onChangeText={(value)=>setWebsite(value)}
                error={websiteError}
                />
                {websiteError? <Text style={styles.errorText}>เว็บไซต์ไม่ถูกต้อง</Text> : null }
              <TextInput
                label="อีเมลล์"
                style={[materialTall.headline, styles.textInput]}
                value={email}
                onBlur={() => validateEmail(email)}
                onChangeText={(value)=>setEmail(value)}
                error={emailError}
                />
                {emailError? <Text style={styles.errorText}>อีเมลล์ไม่ถูกต้อง</Text> : null }
              <TextInput 
                label="คำเชิญชวน"
                style={[materialTall.headline, styles.textInput]}
                value={phrase}
                maxLength={140}
                onChangeText={(value) => setPhrase(value)}
                selectionColor="black"
               />
               <Text style={[materialTall.caption, styles.textInputCount]}>{phrase.length}/140</Text>
              <TextInput 
                label="คำบรรยาย"
                style={[materialTall.headline, styles.textInput]}
                value={description}
                onChangeText={(value) => setDescription(value)}
                selectionColor="black"
                multiline={true}
               />
            </View>
          </KeyboardAvoidingView>
          {(nameError|| categoryError || tambonError || amphoeError || changwatError || emailError)
               && ( 
                 <View style={styles.errorView}>
                   <Icon type="antdesign" name="exclamationcircle" color={colors.ERROR} />
                   <Text style={[materialTall.subheading, styles.errorText]}>โปรดกรอกข้อมูลที่จำเป็นให้ครบถ้วน</Text> 
                 </View>
               
               )
              }
          <Button  
                mode="contained"
                onPress={() => submit()}  
                labelStyle={materialTall.headlineWhite} >
                บันทึกการเปลี่ยนแปลง
          </Button>
        </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
  Root: {     
      flex: 1,
      backgroundColor: iOSColors.lightGray
  },
  sectionView: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: iOSColors.lightGray2
  },
  textInput: {  
    backgroundColor: iOSColors.lightGray,
    marginTop: 15            
  },
  underName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  inputButton: {
    borderBottomWidth: 1,
    borderColor: iOSColors.Gray,
    marginTop: 15,
    paddingTop: 5,
    backgroundColor: iOSColors.lightGray,
    height: 64,
    justifyContent: 'center'
  },
  typeView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15
  },
  placeholderText: {
    marginLeft: 15,
    lineHeight: 30,
    marginBottom: 5
  },
  errorText: {
    color: colors.ERROR,
    marginTop: 5
  },
  rightInputButton: {
    borderBottomWidth: 1,
    borderColor: iOSColors.midGray,
    backgroundColor: iOSColors.lightGray,
    width: width*0.6,
    paddingRight: 10,
    alignItems: 'center'
  },
  addressButton: {
    backgroundColor: iOSColors.lightGray,
    color: 'black',
    borderBottomWidth: 2
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  openTimeRow: {
    flexDirection: 'row',
    paddingTop: 0
  },
  openDayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  errorView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  switchView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInputCount: {
    alignSelf: 'flex-end',
    marginRight: 10
  }
})

export default EditShopScreen;