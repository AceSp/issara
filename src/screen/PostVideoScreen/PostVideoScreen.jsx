import * as React from 'react'
import { 
  useRef, 
  useState, 
  useCallback, 
} from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
  NativeModules,
  NativeEventEmitter,
} from 'react-native'
import {launchImageLibrary} from 'react-native-image-picker'
import { TapGestureHandler } from 'react-native-gesture-handler'
import {
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
  useLocationPermission,
  useCameraPermission,
  useMicrophonePermission
} from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
import {
  request,
  check,
  PERMISSIONS,
  RESULTS
} from 'react-native-permissions';
import { 
  cleanFiles, 
  closeEditor, 
  isValidFile, 
  listFiles, 
  showEditor 
} from 'react-native-video-trim';
import BackgroundService from 'react-native-background-actions';

import { 
  CONTENT_SPACING, 
  CONTROL_BUTTON_SIZE, 
  MAX_ZOOM_FACTOR, 
  SAFE_AREA_PADDING, 
  SCREEN_HEIGHT, 
  SCREEN_WIDTH 
} from '../../utils/constants'
import Reanimated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated'
import { useEffect } from 'react'
import { useIsForeground } from '../../utils/hooks/useIsForeground'
import { StatusBarBlurBackground } from '../../utils/views/StatusBarBlurBackground'
import { CaptureButton } from '../../utils/views/CaptureButton'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/core'
import { usePreferredCameraDevice } from '../../utils/hooks/usePreferredCameraDevice'
import PermissionScreen from '../PermissionScreen'

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const SCALE_FULL_ZOOM = 3

function PostVideoScreen({ navigation }) {

  const camera = useRef(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const microphone = useMicrophonePermission();
  const location = useLocationPermission();
  const [galleryPermission, setGalleryPermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const zoom = useSharedValue(1)

  // check if camera page is active
  const isFocussed = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocussed && isForeground

  const [cameraPosition, setCameraPosition] = useState('back')
  const [enableNightMode, setEnableNightMode] = useState(false)

  // camera device settings
  const [preferredDevice] = usePreferredCameraDevice()
  let device = useCameraDevice(cameraPosition)

  if (preferredDevice != null && preferredDevice.position === cameraPosition) {
    // override default device with the one selected by the user in settings
    device = preferredDevice
    console.log("device (overridden):", device)
  }

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    { fps: 30 },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ])

  const fps = Math.min(format?.maxFps ?? 1, 30)

  //#region Animated Zoom
  const minZoom = device?.minZoom ?? 1
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom)
    return {
      zoom: z,
    }
  }, [maxZoom, minZoom, zoom])
  //#endregion

  //#region Callbacks
  const onError = useCallback((error) => {
    console.error(error)
  }, [])
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!')
    setIsCameraInitialized(true)
  }, [])
  const onMediaCaptured = useCallback(
    (media, type) => {
      console.log(`Media captured! ${JSON.stringify(media)}`)
      const mediaArr = media.path.split('/')
      const fileName = mediaArr[mediaArr.length-1]
      const uri = 'file://' + media.path;
      navigation.navigate('PostPreview', { uri, fileName })
      // navigation.navigate('MediaScreen', {
      //   path: media.path,
      //   type: type,
      // })
    },
    [navigation],
  )
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
  }, [])
  //#endregion

  //#region Tap Gesture
  const onFocusTap = useCallback(
    ({ nativeEvent: event }) => {
      if (!device?.supportsFocus) return
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      })
    },
    [device?.supportsFocus],
  )
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed()
  }, [onFlipCameraPressed])
  //#endregion

  //#region Effects
  useEffect(() => {
    // Reset zoom to it's default everytime the `device` changes.
    zoom.value = device?.neutralZoom ?? 1
  }, [zoom, device])
  //#endregion

  useEffect(() => {
    checkPermissions();
    location.requestPermission();
  }, []);

  useEffect(() => {
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined
    console.log(`Camera: ${device?.name} | Format: ${f}`)
  }, [device?.name, format, fps])

  async function checkPermission() {
    let permission;

    if (Platform.OS === 'android') {
      permission =
        Platform.Version >= 33
          ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO // Android 13+ uses specific media permissions
          : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE; // Android 12 and below

    } else {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY; // iOS uses PHOTO_LIBRARY
    }

    const result = await check(permission);
    console.log("Permission Status:", result);

    switch (result) {
      case RESULTS.GRANTED:
        setGalleryPermission(true);
        break;
      case RESULTS.DENIED:
        requestGalleryPermission();
        break;
      case RESULTS.BLOCKED:
      case RESULTS.UNAVAILABLE:
        setGalleryPermission(false);
        break;
    }
  }

  const openVideoGallery = async () => {
    const options = {
      mediaType: 'video',
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
      console.log('Selected video:', source);
      console.log(result)
      isValidFile(result.assets[0].uri || '').then((res) =>
        console.log(res)
      );
      // Handle the selected video here, e.g., navigate to a new screen with the video
      navigation.navigate('PostPreview', { uri: source, fileName })
    }

    // showEditor(result.assets[0]?.uri || '', {
    // });
  }


  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet'

  //   runAtTargetFps(10, () => {
  //     'worklet'
  //     console.log(`${frame.timestamp}: ${frame.width}x${frame.height} ${frame.pixelFormat} Frame (${frame.orientation})`)
  //     examplePlugin(frame)
  //     exampleKotlinSwiftPlugin(frame)
  //   })
  // }, [])

  async function checkPermissions() {
    await checkCameraPermission();
    await checkMicrophonePermission();
    await checkGalleryPermission();
  }

  async function checkCameraPermission() {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const result = await check(permission);
    console.log("Camera Permission Status:", result);

    switch (result) {
      case RESULTS.GRANTED:
        setCameraPermission(true);
        break;
      case RESULTS.DENIED:
        requestCameraPermission();
        break;
      case RESULTS.BLOCKED:
      case RESULTS.UNAVAILABLE:
        setCameraPermission(false);
        showBlockedPermissionAlert("กล้อง", requestCameraPermission);
        break;
    }
  }

  async function requestCameraPermission() {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.CAMERA
        : PERMISSIONS.IOS.CAMERA;

    const response = await request(permission);
    console.log("Camera Permission Response:", response);

    if (response === RESULTS.GRANTED) {
      setCameraPermission(true);
    } else if (response === RESULTS.BLOCKED) {
      showBlockedPermissionAlert("กล้อง", requestCameraPermission);
    } else {
      setCameraPermission(false);
    }
  }

  async function checkMicrophonePermission() {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;

    const result = await check(permission);
    console.log("Microphone Permission Status:", result);

    switch (result) {
      case RESULTS.GRANTED:
        setMicrophonePermission(true);
        break;
      case RESULTS.DENIED:
        requestMicrophonePermission();
        break;
      case RESULTS.BLOCKED:
      case RESULTS.UNAVAILABLE:
        setMicrophonePermission(false);
        showBlockedPermissionAlert("ไมโครโฟน", requestMicrophonePermission);
        break;
    }
  }

  async function requestMicrophonePermission() {
    const permission =
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.RECORD_AUDIO
        : PERMISSIONS.IOS.MICROPHONE;

    const response = await request(permission);
    console.log("Microphone Permission Response:", response);

    if (response === RESULTS.GRANTED) {
      setMicrophonePermission(true);
    } else if (response === RESULTS.BLOCKED) {
      showBlockedPermissionAlert("ไมโครโฟน", requestMicrophonePermission);
    } else {
      setMicrophonePermission(false);
    }
  }

  async function checkGalleryPermission() {
    let permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    if (Platform.OS === 'ios') {
      permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    const result = await check(permission);
    console.log("Gallery Permission Status:", result);

    switch (result) {
      case RESULTS.GRANTED:
        setGalleryPermission(true);
        break;
      case RESULTS.DENIED:
        requestGalleryPermission();
        break;
      case RESULTS.BLOCKED:
      case RESULTS.UNAVAILABLE:
        setGalleryPermission(false);
        showBlockedPermissionAlert("คลังวิดีโอ", requestGalleryPermission);
        break;
    }
  }

  async function requestGalleryPermission() {
    let permission =
      Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_VIDEO
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    console.log("Requesting Permission:", permission);
    const response = await request(permission);
    console.log("Gallery Permission Response:", response);

    if (response === RESULTS.GRANTED) {
      setGalleryPermission(true);
    } else if (response === RESULTS.BLOCKED) {
      showBlockedPermissionAlert("คลังวิดีโอ", requestGalleryPermission);
    } else {
      setGalleryPermission(false);
    }
  }

  function showBlockedPermissionAlert(permissionName, retryFunction) {
    Alert.alert(
      `ต้องการสิทธิ์เข้าถึง ${permissionName}`,
      `คุณได้บล็อกการเข้าถึง ${permissionName} กรุณาเปิดสิทธิ์ในการตั้งค่า`,
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "แก้ไขการอนุญาต", onPress: () => Linking.openSettings() },
      ]
    );
  }

  if (!cameraPermission || !microphonePermission || !galleryPermission) {
    let permissionArr = [];
    if (!cameraPermission) {
      permissionArr.push({
        permissionText: "เราจำเป็นต้องเข้าถึงกล้องของคุณเพื่อโพสต์วิดีโอ",
        requestPermission: requestCameraPermission,
      });
    }
    if (!microphonePermission) {
      permissionArr.push({
        permissionText: "เราจำเป็นต้องเข้าถึงไมโครโฟนของคุณเพื่อบันทึกวิดีโอ",
        requestPermission: requestMicrophonePermission,
      });
    }
    if (!galleryPermission) {
      permissionArr.push({
        permissionText: "เราจำเป็นต้องเข้าถึงคลังวิดีโอของคุณเพื่อโพสต์วิดีโอ",
        requestPermission: requestGalleryPermission,
      });
    }

    return (
      <PermissionScreen
        backable={true}
        permissionArr={permissionArr}
        navigation={navigation}
      />
    );
  }

  // if(!microphone.hasPermission) return (
  //   <PermissionScreen 
  //     permissionText="เราจำเป็นต้องเข้าถึงไมค์ของคุณเพื่อโพสต์วิดีโอ"
  //     requestPermission={microphone.requestPermission}
  //     navigation={navigation}
  //   />
  // )

  return (
    <View style={styles.container}>
      {device != null ? (
          <Reanimated.View onTouchEnd={onFocusTap} style={StyleSheet.absoluteFill}>
            <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
              <ReanimatedCamera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={isActive}
                ref={camera}
                onInitialized={onInitialized}
                onError={onError}
                onStarted={() => console.log('Camera started!')}
                onStopped={() => console.log('Camera stopped!')}
                onPreviewStarted={() => console.log('Preview started!')}
                onPreviewStopped={() => console.log('Preview stopped!')}
                onOutputOrientationChanged={(o) => console.log(`Output orientation changed to ${o}!`)}
                onPreviewOrientationChanged={(o) => console.log(`Preview orientation changed to ${o}!`)}
                onUIRotationChanged={(degrees) => console.log(`UI Rotation changed: ${degrees}°`)}
                format={format}
                fps={fps}
                photoQualityBalance="speed"
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                exposure={0}
                outputOrientation="device"
                video={true}
                audio={microphone.hasPermission}
                enableLocation={location.hasPermission}
                // frameProcessor={frameProcessor}
              />
            </TapGestureHandler>
          </Reanimated.View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.text}>Your phone does not have a Camera.</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.captureButton, 
          { 
            left: SAFE_AREA_PADDING.paddingLeft 
            + CONTROL_BUTTON_SIZE 
            + CONTENT_SPACING,
            bottom: CONTROL_BUTTON_SIZE
          }
        ]} 
        onPress={openVideoGallery} 
        disabledOpacity={0.4}
      >
        <IonIcon name="cloud-upload" color="white" size={24} />
      </TouchableOpacity>
      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={'off'}
        enabled={isCameraInitialized && isActive}
      />
      <TouchableOpacity 
        style={[
          styles.captureButton, 
          { 
            right: SAFE_AREA_PADDING.paddingRight 
            + CONTROL_BUTTON_SIZE 
            + CONTENT_SPACING,
            bottom: CONTROL_BUTTON_SIZE
          }
        ]} 
        onPress={onFlipCameraPressed} 
        disabledOpacity={0.4}>
        <IonIcon name="camera-reverse" color="white" size={24} />
      </TouchableOpacity>
      <StatusBarBlurBackground />
      {/* <View style={styles.rightButtonRow}>
        <TouchableOpacity 
          // onPress={async () => {
          //   const files = await listFiles()
          //   // await cleanFiles()
          //   console.log("-----------POstVideoScreen----listFiles")
          //   console.log(files);
          //   BackgroundService.stop();
          //   handleUpload(files[0])
          // }}
          onPress={openVideoGallery}
          disabledOpacity={0.4}
        >
          <IonIcon name="cloud-upload" color="white" size={24} />
        </TouchableOpacity>
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: SAFE_AREA_PADDING.paddingBottom,
  },
  rightButtonRow: {
    position: 'absolute',
    right: SAFE_AREA_PADDING.paddingRight,
    top: SAFE_AREA_PADDING.paddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default PostVideoScreen;
