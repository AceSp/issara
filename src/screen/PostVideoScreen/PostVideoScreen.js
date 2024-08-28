import * as React from 'react'
import { 
  useRef, 
  useState, 
  useCallback, 
  useMemo
} from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  TouchableOpacity
} from 'react-native'
import { TapGestureHandler } from 'react-native-gesture-handler'
import {
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
  useLocationPermission,
} from 'react-native-vision-camera'
import { Camera } from 'react-native-vision-camera'
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

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const SCALE_FULL_ZOOM = 3

function PostVideoScreen({ navigation }) {
  const camera = useRef(null)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const microphone = Camera.getMicrophonePermissionStatus()
  const location = useLocationPermission()
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
      navigation.navigate('MediaScreen', {
        path: media.path,
        type: type,
      })
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
    const f =
      format != null
        ? `(${format.photoWidth}x${format.photoHeight} photo / ${format.videoWidth}x${format.videoHeight}@${format.maxFps} video @ ${fps}fps)`
        : undefined
    console.log(`Camera: ${device?.name} | Format: ${f}`)
  }, [device?.name, format, fps])

  useEffect(() => {
    location.requestPermission()
  }, [location])

  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet'

  //   runAtTargetFps(10, () => {
  //     'worklet'
  //     console.log(`${frame.timestamp}: ${frame.width}x${frame.height} ${frame.pixelFormat} Frame (${frame.orientation})`)
  //     examplePlugin(frame)
  //     exampleKotlinSwiftPlugin(frame)
  //   })
  // }, [])


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

      <StatusBarBlurBackground />

      <View style={styles.rightButtonRow}>
        <TouchableOpacity style={styles.button} onPress={onFlipCameraPressed} disabledOpacity={0.4}>
          <IonIcon name="camera-reverse" color="white" size={24} />
        </TouchableOpacity>
      </View>
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
  button: {
    marginBottom: CONTENT_SPACING,
    width: CONTROL_BUTTON_SIZE,
    height: CONTROL_BUTTON_SIZE,
    borderRadius: CONTROL_BUTTON_SIZE / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
