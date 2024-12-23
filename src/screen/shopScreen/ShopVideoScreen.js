import React, { useEffect, useState, useRef, memo, useLayoutEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  TouchableRipple
} from 'react-native-paper';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';

import Loading from '../../component/Loading';
import { colors } from '../../utils/constants';
import VideoCard from './component/VideoCard';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ShopVideoScreen = (props) => {

//  const { videos } = props.route.params;

  return (
    <View style={styles.Root}>
        <VideoCard 
            uri="https://www.w3schools.com/html/mov_bbb.mp4"
        />
    </View>

  )
}

const styles = StyleSheet.create({
  Root: {     
      flex: 1,
      backgroundColor: iOSColors.white
  },
})

export default ShopVideoScreen;