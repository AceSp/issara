import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import RNFS from 'react-native-fs';
import { Modal, Portal } from 'react-native-paper';

import { PlayerControls, ProgressBar } from '../components';

// interface State {
//   fullscreen: boolean;
//   play: boolean;
//   currentTime: number;
//   duration: number;
//   showControls: boolean;
// }
// https://github.com/mdebelj1/RN-video

const FullscreenWrapper = ({ fullscreen, children }) =>
  fullscreen ? <Portal>{children}</Portal> : children;

export const VideoPlayer = ({ uri }) => {
  const videoRef = useRef();
  const fullVideoRef = useRef();
  const [state, setState] = useState({
    uri: uri,
    fullscreen: false,
    play: false,
    currentTime: 0,
    duration: 0,
    showControls: true,
    start: 0,
    timeBeforeScreenChange: 0
  });

  useEffect(() => {
    Orientation.addDeviceOrientationListener(handleOrientation);

    return () => {
      Orientation.removeDeviceOrientationListener(handleOrientation);
    };
  }, [state.play]);

  useEffect(() => {
    if (state.currentTime)
      setState(s => ({ ...s, timeBeforeScreenChange: state.currentTime }));
  }, [state.fullscreen]);

  useEffect(() => {
    let nameArr = uri.split('/');
    let filename = nameArr[nameArr.length - 1];
    let path_name = RNFS.DocumentDirectoryPath + '/' + filename;

    RNFS.exists(path_name).then(exists => {
      if (exists) {
        getVideoUrl(uri, filename)
          .then(res => {
            setState(s => ({ ...s, uri: res }));
          })
          .catch(url => {
            setState(s => ({ ...s, uri: uri }));
          });
      } else {
        RNFS.downloadFile({
          fromUrl: uri,
          toFile: path_name.replace(/%20/g, "_"),
          background: true
        })
          .promise.then(res => {
            console.log("File Downloaded", res);
          })
          .catch(err => {
            console.log("err downloadFile", err);
          });
      }
    });
  }, [uri])

  return (
    <View >
      <FullscreenWrapper fullscreen={state.fullscreen}>
        <TouchableWithoutFeedback onPress={showControls}>
          <View>
            <Video
              ref={state.fullscreen ? fullVideoRef : videoRef}
              source={{
                uri: state.uri
              }}
              style={state.fullscreen ? styles.fullscreenVideo : styles.video}
              controls={false}
              poster=''
              posterResizeMode='contain'
              resizeMode='contain'
              // onReadyForDisplay={onReadyForDisplay}
              onLoad={onLoadEnd}
              onProgress={onProgress}
              onEnd={onEnd}
              paused={!state.play}
            />
            {state.showControls && (
              <View style={styles.controlOverlay}>
                <TouchableOpacity
                  onPress={handleFullscreen}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.fullscreenButton}>
                  {state.fullscreen ?
                    <Icon name="fullscreen-exit" color="white" />
                    :
                    <Icon name="fullscreen" color="white" />}
                </TouchableOpacity>
                <PlayerControls
                  onPlay={handlePlayPause}
                  onPause={handlePlayPause}
                  playing={state.play}
                  showPreviousAndNext={false}
                  showSkip={true}
                  skipBackwards={skipBackward}
                  skipForwards={skipForward}
                />
                <ProgressBar
                  currentTime={state.currentTime}
                  duration={state.duration > 0 ? state.duration : 0}
                  onSlideStart={handlePlayPause}
                  onSlideComplete={handlePlayPause}
                  onSlideCapture={onSeek}
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </FullscreenWrapper>
    </View>
  );

  function onReadyForDisplay() {
    if (state.timeBeforeScreenChange) {
      onSeek({ seekTime: state.timeBeforeScreenChange });
      setState(s => ({ ...s, timeBeforeScreenChange: 0 }));
    }
  }

  function handleOrientation(orientation) {
    if (
      (orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT') 
      && state.play
      ) {
        (setState(s => ({ ...s, fullscreen: true })),
          StatusBar.setHidden(true));
    } else {
      (setState(s => ({ ...s, fullscreen: false })),
        StatusBar.setHidden(false));
    }
  }

  function handlePlayAfterFullscreen(current) {
    videoRef.current.seek(current);
  }

  function handleFullscreen() {
    state.fullscreen
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToLandscapeLeft();
  }

  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({ ...state, play: false, showControls: true });
      return;
    }

    setState({ ...state, play: true });
    setTimeout(() => setState(s => ({ ...s, showControls: false })), 2000);
  }

  function skipBackward() {
    setState({ ...state, currentTime: state.currentTime - 15 });
    videoRef.current.seek(state.currentTime - 15);
  }

  function skipForward() {
    videoRef.current.seek(state.currentTime + 15);
    setState({ ...state, currentTime: state.currentTime + 15 });
  }

  function onSeek(data) {
    if (videoRef.current) {
      console.log(data.seekTime)
      videoRef.current.seek(data.seekTime);
      setState({ ...state, currentTime: data.seekTime });
    }
    if (fullVideoRef.current) {
      console.log(data.seekTime)
      fullVideoRef.current.seek(data.seekTime);
      setState({ ...state, currentTime: data.seekTime });
    }
  }

  function onLoadEnd(data) {
    if (state.timeBeforeScreenChange) {
      onSeek({ seekTime: state.timeBeforeScreenChange });
      setState(s => ({ ...s, timeBeforeScreenChange: 0 }));
    }
    setState(s => ({
      ...s,
      duration: data.duration,
      currentTime: data.currentTime,
    }));
  }

  function onProgress(data) {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onEnd() {
    setState({ ...state, play: false });
    videoRef.current.seek(0);
  }

  function showControls() {
    state.showControls
      ? setState({ ...state, showControls: false })
      : setState({ ...state, showControls: true });
  }

  function getVideoUrl(url, filename) {
    return new Promise((resolve, reject) => {
      RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then(result => {
          result.forEach(element => {
            if (element.name == filename.replace(/%20/g, "_")) {
              resolve(element.path);
            }
          });
        })
        .catch(err => {
          reject(url);
        });
    });
  }
};

const styles = StyleSheet.create({
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('screen').width,
    width: Dimensions.get('screen').height,
    backgroundColor: 'black',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
});