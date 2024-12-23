import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
              
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
    Platform,
    Image
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

import { colors } from '../utils/constants';
import Loading from '../component/Loading';

moment.locale('th');

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

function MapScreen(props) {

  const { 
    mapParam,
    setMapParam,
    setMarkerParam
  } = props.route.params;

  const [ mapCoord, setMapCoord ] = useState({
        latitude: 13.75630,
        longitude: 100.50180,
        latitudeDelta: 0.09,
        longitudeDelta: 0.035
    });
  const [ locationPermission, setLocationPermission ] = useState(false);

  useEffect(() => {
    if(!mapParam) {
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
    } else {
      setMapCoord(mapParam);
    }
    
  },[])

  const submit = () => {
    setMapParam(mapCoord);
    setMarkerParam({ latitude: mapCoord.latitude, longitude: mapCoord.longitude })
    props.navigation.goBack();
  };


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
            setMapCoord({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.09,
                longitudeDelta: 0.035
            });
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

          <MapView
          style={{height: '92%'}}
          provider={PROVIDER_GOOGLE}
          region={mapCoord}
          showsUserLocation
          onRegionChangeComplete={(e) => setMapCoord(e)}       
        >
          
        </MapView>
        <Image style={{
                        left: width*0.464,
                        height: 30, width: 30,
                        position: 'absolute',
                        top: height*0.382,
                        }} 
                        resizeMode={Image.resizeMode.contain}
                        source={require('../assets/pic/marker.png')} 
                        />
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

export default MapScreen;