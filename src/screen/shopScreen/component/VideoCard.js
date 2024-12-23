import React,
{
  memo,
} from 'react';
import {
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Card,
  Divider,
  Avatar,
} from 'react-native-paper';

const { height, width } = Dimensions.get('screen');

function VideoCard(props) {
    return (
      <Card
      >
          <VideoCard 
            uri={props.uri}
          />
      </Card>
    )
  }

  const styles = StyleSheet.create({
    name: {
      backgroundColor: 'red'
    },
    video: {
      width: width,
      height: 500,
      position: 'relative'
    },
    fullscreenContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  })

  export default memo(VideoCard);

 