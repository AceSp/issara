import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements';

// interface Props {
//   playing: boolean;
//   showPreviousAndNext: boolean;
//   showSkip: boolean;
//   previousDisabled?: boolean;
//   nextDisabled?: boolean;
//   onPlay: () => void;
//   onPause: () => void;
//   skipForwards?: () => void;
//   skipBackwards?: () => void;
//   onNext?: () => void;
//   onPrevious?: () => void;
// }

export const PlayerControls = ({
  playing,
  showPreviousAndNext,
  showSkip,
  previousDisabled,
  nextDisabled,
  onPlay,
  onPause,
  skipForwards,
  skipBackwards,
  onNext,
  onPrevious,
}) => (
  <View style={styles.wrapper}>
    {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, previousDisabled && styles.touchableDisabled]}
        onPress={onPrevious}
        disabled={previousDisabled}>
        <Icon name="skip-previous" color="white" />
      </TouchableOpacity>
    )}

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipBackwards}>
        <Icon name="replay-10" color="white" />
      </TouchableOpacity>
    )}

    <TouchableOpacity
      style={styles.touchable}
      onPress={playing ? onPause : onPlay}>
      {playing ? 
        <Icon name="pause-circle-outline" color="white" /> 
        : 
        <Icon name="play-circle-filled" color="white" />}
    </TouchableOpacity>

    {showSkip && (
      <TouchableOpacity style={styles.touchable} onPress={skipForwards}>
        <Icon name="forward-10" color="white" />
      </TouchableOpacity>
    )}

    {showPreviousAndNext && (
      <TouchableOpacity
        style={[styles.touchable, nextDisabled && styles.touchableDisabled]}
        onPress={onNext}
        disabled={nextDisabled}>
        <Icon name="skip-next" color="white" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 3,
  },
  touchable: {
    padding: 5,
  },
  touchableDisabled: {
    opacity: 0.3,
  },
});
