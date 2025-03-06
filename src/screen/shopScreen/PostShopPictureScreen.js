import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  Linking
} from 'react-native';
import {
  Icon,
  Divider,
} from 'react-native-elements';
import { marketCategory } from '../../utils/constants';
import { 
  request,
  check, 
  PERMISSIONS,
  RESULTS 
} from 'react-native-permissions'

import { colors } from '../../utils/constants';
import SellButton from '../../component/SellButton';
import {
  iOSColors,
  materialTall,
} from 'react-native-typography';
import {
  Button,
  TouchableRipple,
} from 'react-native-paper';
import PermissionScreen from '../PermissionScreen';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PostShopPictureScreen = (props) => {

  const [imageObjArr, setImageObjArr] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  // Load images from navigation params
  useEffect(() => {
    if (props.route?.params?.imageObjArr) {
      setImageObjArr(props.route.params.imageObjArr);
    }
  }, [props.route?.params?.imageObjArr]);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  async function checkPermission() {
    let permission;

    if (Platform.OS === 'android') {
      permission =
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES // Android 13+ uses specific media permissions
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // Android 12 and below

    } else {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY; // iOS uses PHOTO_LIBRARY
    }

    const result = await check(permission);
    console.log("Permission Status:", result);

    switch (result) {
      case RESULTS.GRANTED:
        setHasPermission(true);
        break;
      case RESULTS.DENIED:
        requestPermission();
        break;
      case RESULTS.BLOCKED:
      case RESULTS.UNAVAILABLE:
        setHasPermission(false);
        break;
    }
  }

  async function requestPermission() {
    let permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    console.log("Requesting Permission:", permission);
    const response = await request(permission);
    console.log("Permission Response:", response);

    if (response === RESULTS.GRANTED) {
      setHasPermission(true);
      // openGallery();
    } else if (response === RESULTS.BLOCKED) {
      Alert.alert(
        "จำเป็นต้องเข้าถึงรูปภาพ",
        "ดูเหมือนว่าคุณจะบล็อคการเข้าถึงรูปภาพไว้ กรุณาเปิดในการตั้งค่า",
        [
          { text: "ยกเลิก", style: "cancel" },
          {
            text: "แก้ไขการอนุญาติ",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    } else {
      setHasPermission(false);
    }
  }

  function openGallery() {
    props.navigation.navigate('CameraRollPicture', {
      comeFrom: 'PostShopPicture',
      imageObjArr,
    });
  }

  const renderImages = () => {
    if (!imageObjArr.length) return null;

    return imageObjArr.map((item, index) =>
      item.fileUri ? (
        <View key={index} style={styles.imageView}>
          <Image source={{ uri: item.fileUri }} style={styles.imageView} />
        </View>
      ) : null
    );
  };

  if (!hasPermission) {
    return (
      <PermissionScreen
        backable={true}
        permissionArr={[
          {
            permissionText: "เราจำเป็นต้องเข้าถึงกล้องของคุณเพื่อโพสต์สร้างร้านค้า",
            requestPermission: requestPermission,
          },
        ]}
        navigation={props.navigation}
      />
    );
  }
  // const [imageObjArr, setImageObjArr] = useState([]);
  // const [hasPermission, setHasPermission] = useState(false);

  // useEffect(() => {
  //   if (props.route?.params?.imageObjArr)
  //     setImageObjArr(props.route?.params?.imageObjArr);
  // })

  // useEffect(() => {
  //   checkPermission()
  // }, [])

  // function checkPermission() {
  //   if(Platform.OS === 'android') {
  //     check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
  //       .then((result) => {
  //         console.log("---------POstShopPicture checkPermission--------")
  //         console.log(result)
  //         switch (result) {
  //           case RESULTS.UNAVAILABLE:
  //             break;
  //           case RESULTS.DENIED:
  //             requestPermission();
  //             break;
  //           case RESULTS.GRANTED:
  //             setHasPermission(true);
  //             // openGallery();
  //             break;
  //           case RESULTS.BLOCKED:
  //             break;
  //         }
  //       })
  //   } else {
  //     check(PERMISSIONS.IOS.READ_EXTERNAL_STORAGE)
  //       .then((result) => {
  //         switch (result) {
  //           case RESULTS.UNAVAILABLE:
  //             break;
  //           case RESULTS.DENIED:
  //             requestPermission();
  //             break;
  //           case RESULTS.GRANTED:
  //             setHasPermission(true);
  //             // openGallery();
  //             break;
  //           case RESULTS.BLOCKED:
  //             break;
  //         }
  //       })
  //   }
  // }

  // async function requestPermission () {
  //   if(Platform.OS === 'android') {
  //     console.log("----------POstShopPicture requestPermission")
  //     const response = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
  //     console.log(response)
  //     if(response === 'granted') openGallery();
  //   } else {
  //     const response = request(PERMISSIONS.IOS.READ_EXTERNAL_STORAGE);
  //     if(response === 'granted') openGallery();
  //   }
  // }

  // function openGallery() {
  //   props.navigation.navigate('CameraRollPicture', {
  //           comeFrom: 'PostShopPicture',
  //           imageObjArr
  //         });
  // }

  // const renderImages = () => {
  //   if (!imageObjArr.length) return null;
  //   let arr = [];
  //   console.log("----------PostShopPictureScreen-----------")
  //   console.log(imageObjArr)
  //   for (let [index, item] of imageObjArr.entries()) {
  //     if(item.fileUri)
  //     arr.push(
  //       <View key={index} style={styles.imageView}>
  //         <Image source={{ uri: item.fileUri }} style={styles.imageView} />
  //       </View>
  //     )
  //   }
  //   return arr;
  // }

  // if(!hasPermission) {
  //   let permissionArr = [];
  //   permissionArr.push({
  //     permissionText: "เราจำเป็นต้องเข้าถึงกล้องของคุณเพื่อโพสต์สร้างร้านค้า",
  //     requestPermission: requestPermission
  //   })
  //   return (
  //     <PermissionScreen 
  //       backable={true}
  //       permissionArr={permissionArr}
  //       navigation={props.navigation}
  //     />
  //   )
  // }

  return (
    <View style={styles.Root}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          <TouchableRipple onPress={() => props.navigation.goBack()}>
            <Icon name="arrow-back" style={{ padding: 8 }} />
          </TouchableRipple>
        </View>
        <View style={{ marginRight: 20 }}>
          {
            imageObjArr.length > 0  &&
            <TouchableOpacity
              onPress={() => props.navigation.navigate('PostShopDetail', {
                imageObjArr
              })}
            >
              <Icon type="antdesign" name='arrowright' />
            </TouchableOpacity>
          }
        </View>
      </View>
      <Divider />
      <ScrollView>
        <View style={styles.instruction}>
          <View style={styles.order}>
            <Text style={materialTall.display3} >1</Text>
          </View>
          <View style={styles.directionBox}>
            <Text style={[materialTall.subheading, styles.directionText]}>
              เลือกรูปที่คุณต้องการแสดงในหน้ารายการประกาศไปไว้ที่อันดับแรก กดที่รูปเพื่อแก้ไข
          </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.imageList}>
          {renderImages()}
        </View>
      </ScrollView>
      <Button
        style={{ paddingVertical: 5 }}
        mode="contained"
        onPress={openGallery}>
        เลือกรูปภาพ
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-between',
    padding: 5,
  },
  instruction: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  directionText: {
    flexWrap: 'wrap',
  },
  directionBox: {
    flex: 8,
    marginRight: 20
  },
  imageView: {
    width: width * 0.33,
    height: width * 0.33,
    borderWidth: 1.5,
    borderColor: iOSColors.midGray,
  },
  imageList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  order: {
    flex: 1,
    marginHorizontal: 20,
  },
  backButton: {
    borderRadius: 500,
    overflow: "hidden"
  }
})

export default PostShopPictureScreen;