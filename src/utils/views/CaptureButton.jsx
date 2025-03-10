import React, { useCallback, useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler'
import Reanimated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedGestureHandler,
  useSharedValue,
  withRepeat,
} from 'react-native-reanimated'
import { CAPTURE_BUTTON_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from '../constants'

const BORDER_WIDTH = CAPTURE_BUTTON_SIZE * 0.1

const _CaptureButton = ({
  camera,
  onMediaCaptured,
  minZoom,
  maxZoom,
  cameraZoom,
  flash,
  enabled,
  style,
  ...props
}) => {
  const isRecording = useSharedValue(false)
  const recordingProgress = useSharedValue(0)

  //#region Camera Capture

  const onStoppedRecording = useCallback(() => {
    isRecording.current = false
    cancelAnimation(recordingProgress)
    console.log('stopped recording video!')
  }, [recordingProgress])
  const stopRecording = useCallback(async () => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!')

      console.log('calling stopRecording()...')
      await camera.current.stopRecording()
      console.log('called stopRecording()!')
    } catch (e) {
      console.error('failed to stop recording!', e)
    }
  }, [camera])
  const startRecording = useCallback(() => {
    try {
      if (camera.current == null) throw new Error('Camera ref is null!')

      console.log('calling startRecording()...')
      camera.current.startRecording({
        flash: flash,
        onRecordingError: (error) => {
          console.error('Recording failed!', error)
          onStoppedRecording()
        },
        onRecordingFinished: (video) => {
          console.log(`Recording successfully finished! ${video.path}`)
          onMediaCaptured(video, 'video')
          onStoppedRecording()
        },
      })
      // TODO: wait until startRecording returns to actually find out if the recording has successfully started
      console.log('called startRecording()!')
      isRecording.value = true
    } catch (e) {
      console.error('failed to start recording!', e, 'camera')
    }
  }, [camera, flash, onMediaCaptured, onStoppedRecording])
  //#endregion

  //#region Tap handler
  const tapHandler = useRef()
  const onHandlerStateChanged = () => {
    recordingProgress.value = 0
    console.log("----------CaptureButton------------")
    console.log(isRecording)
    if (!isRecording.value) {
      console.log("-------startRecording---------")
      startRecording()
      isRecording.value = true
    } else {
      console.log("-------stopRecording---------")
      stopRecording()
      isRecording.value = false
    }
    return
  }
  //#endregion
  //#region Pan handler
  const panHandler = useRef()
  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.startY = event.absoluteY
      const yForFullZoom = context.startY * 0.7
      const offsetYForFullZoom = context.startY - yForFullZoom

      // extrapolate [0 ... 1] zoom -> [0 ... Y_FOR_FULL_ZOOM] finger position
      context.offsetY = interpolate(cameraZoom.value, [minZoom, maxZoom], [0, offsetYForFullZoom], Extrapolate.CLAMP)
    },
    onActive: (event, context) => {
      const offset = context.offsetY ?? 0
      const startY = context.startY ?? SCREEN_HEIGHT
      const yForFullZoom = startY * 0.7

      cameraZoom.value = interpolate(event.absoluteY - offset, [yForFullZoom, startY], [maxZoom, minZoom], Extrapolate.CLAMP)
    },
  })
  //#endregion

  const shadowStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: withSpring(isRecording.value ? 1 : 0, {
            mass: 1,
            damping: 35,
            stiffness: 300,
          }),
        },
      ],
    }),
    [isRecording],
  )
  const buttonStyle = useAnimatedStyle(() => {
    let scale
    if (enabled) {
      if (isRecording.value) {
        scale = withRepeat(
          withSpring(1, {
            stiffness: 100,
            damping: 1000,
          }),
          -1,
          true,
        )
      } else {
        scale = withSpring(0.9, {
          stiffness: 500,
          damping: 300,
        })
      }
    } else {
      scale = withSpring(0.6, {
        stiffness: 500,
        damping: 300,
      })
    }

    return {
      opacity: withTiming(enabled ? 1 : 0.3, {
        duration: 100,
        easing: Easing.linear,
      }),
      transform: [
        {
          scale: scale,
        },
      ],
    }
  }, [enabled, isRecording])

  return (
    // <TapGestureHandler
    //   enabled={enabled}
    //   ref={tapHandler}
    //   onHandlerStateChange={onHandlerStateChanged}
    //   shouldCancelWhenOutside={false}
    //   maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to State.FAILED when the user moves his finger outside of the child view (to zoom)
    //   simultaneousHandlers={panHandler}>
      <Reanimated.View {...props} style={[buttonStyle, style]}>
        <PanGestureHandler
          enabled={enabled}
          ref={panHandler}
          failOffsetX={[-SCREEN_WIDTH, SCREEN_WIDTH]}
          activeOffsetY={[-2, 2]}
          onGestureEvent={onPanGestureEvent}
          simultaneousHandlers={tapHandler}>
          <Reanimated.View style={styles.flex}>
            <Reanimated.View style={[styles.shadow, shadowStyle]} />
              <TouchableOpacity
                onPress={onHandlerStateChanged}
              >
                <View style={styles.button} />
              </TouchableOpacity>
          </Reanimated.View>
        </PanGestureHandler>
      </Reanimated.View>
  )
}

export const CaptureButton = React.memo(_CaptureButton)

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  shadow: {
    position: 'absolute',
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: '#e34077',
  },
  button: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: 'white',
  },
})
