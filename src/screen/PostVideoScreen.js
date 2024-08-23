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
  runAtTargetFps,
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
} from '../utils/constants'
import Reanimated, { useAnimatedProps, useSharedValue } from 'react-native-reanimated'
import { useEffect } from 'react'
import { useIsForeground } from '../utils/hooks/useIsForeground'
// import { StatusBarBlurBackground } from '../utils/views/StatusBarBlurBackground'
import { CaptureButton } from '../utils/views/CaptureButton'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/core'
import { usePreferredCameraDevice } from '../utils/hooks/usePreferredCameraDevice'
import { examplePlugin } from '../utils/frame-processors/ExamplePlugin'
import { exampleKotlinSwiftPlugin } from '../utils/frame-processors/ExampleKotlinSwiftPlugin'

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera)
Reanimated.addWhitelistedNativeProps({
  zoom: true,
})

const SCALE_FULL_ZOOM = 3

function PostVideoScreen({ navigation }) {
  const camera = useRef(null)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const microphone = Camera.getMicrophonePermissionStatus()
  console.log("microphone:", microphone)
  const location = useLocationPermission()
  console.log("location:", location)
  const zoom = useSharedValue(1)
  console.log("zoom:", zoom)
  const isPressingButton = useSharedValue(false)
  console.log("isPressingButton:", isPressingButton)

  // check if camera page is active
  const isFocussed = useIsFocused()
  console.log("isFocussed:", isFocussed)
  const isForeground = useIsForeground()
  console.log("isForeground:", isForeground)
  const isActive = isFocussed && isForeground
  console.log("isActive:", isActive)

  const [cameraPosition, setCameraPosition] = useState('back')
  console.log("cameraPosition:", cameraPosition)
  const [enableHdr, setEnableHdr] = useState(false)
  console.log("enableHdr:", enableHdr)
  const [flash, setFlash] = useState('off')
  console.log("flash:", flash)
  const [enableNightMode, setEnableNightMode] = useState(false)
  console.log("enableNightMode:", enableNightMode)

  // camera device settings
  const [preferredDevice] = usePreferredCameraDevice()
  console.log("preferredDevice:", preferredDevice)
  let device = useCameraDevice(cameraPosition)
  console.log("device:", device)

  if (preferredDevice != null && preferredDevice.position === cameraPosition) {
    // override default device with the one selected by the user in settings
    device = preferredDevice
    console.log("device (overridden):", device)
  }

  const [targetFps, setTargetFps] = useState(60)
  console.log("targetFps:", targetFps)

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ])
  console.log("format:", format)

  const fps = Math.min(format?.maxFps ?? 1, targetFps)
  console.log("fps:", fps)

  const supportsFlash = device?.hasFlash ?? false
  console.log("supportsFlash:", supportsFlash)
  const supportsHdr = format?.supportsPhotoHdr
  console.log("supportsHdr:", supportsHdr)
  const supports60Fps = useMemo(() => device?.formats.some((f) => f.maxFps >= 60), [device?.formats])
  console.log("supports60Fps:", supports60Fps)
  const canToggleNightMode = device?.supportsLowLightBoost ?? false
  console.log("canToggleNightMode:", canToggleNightMode)

  //#region Animated Zoom
  const minZoom = device?.minZoom ?? 1
  console.log("minZoom:", minZoom)
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)
  console.log("maxZoom:", maxZoom)

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom)
    return {
      zoom: z,
    }
  }, [maxZoom, minZoom, zoom])
  console.log("cameraAnimatedProps:", cameraAnimatedProps)
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton) => {
      isPressingButton.value = _isPressingButton
    },
    [isPressingButton],
  )
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
      navigation.navigate('MediaPage', {
        path: media.path,
        type: type,
      })
    },
    [navigation],
  )
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
  }, [])
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'))
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

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'

    runAtTargetFps(10, () => {
      'worklet'
      console.log(`${frame.timestamp}: ${frame.width}x${frame.height} ${frame.pixelFormat} Frame (${frame.orientation})`)
      examplePlugin(frame)
      exampleKotlinSwiftPlugin(frame)
    })
  }, [])

  const videoHdr = format?.supportsVideoHdr && enableHdr
  const photoHdr = format?.supportsPhotoHdr && enableHdr && !videoHdr

  console.log("---------POstVideoScreen-------------")
  console.log("location:", location)
  console.log("microphone:", microphone)
  console.log("isFocussed:", isFocussed)
  console.log("isForeground:", isForeground)
  console.log("cameraPosition:", cameraPosition)
  console.log("enableHdr:", enableHdr)
  console.log("flash:", flash)
  console.log("enableNightMode:", enableNightMode)
  console.log("preferredDevice:", preferredDevice)
  console.log("device:", device)
  console.log("targetFps:", targetFps)
  console.log("format:", format)
  console.log("fps:", fps)
  console.log("supportsFlash:", supportsFlash)
  console.log("supportsHdr:", supportsHdr)
  console.log("supports60Fps:", supports60Fps)
  console.log("canToggleNightMode:", canToggleNightMode)
  console.log("minZoom:", minZoom)
  console.log("maxZoom:", maxZoom)

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
                photoHdr={photoHdr}
                videoHdr={videoHdr}
                photoQualityBalance="quality"
                lowLightBoost={device.supportsLowLightBoost && enableNightMode}
                enableZoomGesture={false}
                animatedProps={cameraAnimatedProps}
                exposure={0}
                enableFpsGraph={true}
                outputOrientation="device"
                photo={true}
                video={true}
                audio={microphone.hasPermission}
                enableLocation={location.hasPermission}
                frameProcessor={frameProcessor}
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
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

      {/* <StatusBarBlurBackground /> */}

      <View style={styles.rightButtonRow}>
        <TouchableOpacity style={styles.button} onPress={onFlipCameraPressed} disabledOpacity={0.4}>
          <IonIcon name="camera-reverse" color="white" size={24} />
        </TouchableOpacity>
        {supportsFlash && (
          <TouchableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
            <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
          </TouchableOpacity>
        )}
        {supports60Fps && (
          <TouchableOpacity style={styles.button} onPress={() => setTargetFps((t) => (t === 30 ? 60 : 30))}>
            <Text style={styles.text}>{`${targetFps}\nFPS`}</Text>
          </TouchableOpacity>
        )}
        {supportsHdr && (
          <TouchableOpacity style={styles.button} onPress={() => setEnableHdr((h) => !h)}>
            <MaterialIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
          </TouchableOpacity>
        )}
        {canToggleNightMode && (
          <TouchableOpacity style={styles.button} onPress={() => setEnableNightMode(!enableNightMode)} disabledOpacity={0.4}>
            <IonIcon name={enableNightMode ? 'moon' : 'moon-outline'} color="white" size={24} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Devices')}>
          <IonIcon name="settings-outline" color="white" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CodeScannerPage')}>
          <IonIcon name="qr-code-outline" color="white" size={24} />
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
