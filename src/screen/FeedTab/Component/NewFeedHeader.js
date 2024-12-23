import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import { 
  Button, 
  Card, 
  Divider, 
  ProgressBar 
} from 'react-native-paper';
import { iOSColors } from 'react-native-typography';

import { colors } from '../../../utils/constants';
import PostBox from '../../../component/PostBox';
import UploadProgressCard from '../../../component/UploadProgressCard';

const NewFeedHeader = (props) => {
  return (
    <View style={styles.Root}>
      <PostBox
        avatar={props.avatar}
        navigation={props.navigation}
        onFocus={() => props.navigation.navigate('Post', {
          showNew: props.showNewPost,
          feedCategory: props.category,
          comeFrom: props.screen,
        })}
      />
      <View style={styles.postMenu}>
        <View style={styles.buttonContainer}>
          <Button
            icon={() => <Icon 
              color={iOSColors.orange}
              type="ionicon"
              name="videocam"
            />
            }
            style={styles.button}
            labelStyle={{ color: "black" }}
            onPress={() => props.navigation.navigate('Post', {
              showNew: props.showNewPost,
              feedCategory: props.category,
              comeFrom: props.screen,
              choose: 1
            })}
          >
            วิดีโอ
          </Button>
        </View>
        <Divider style={styles.divider}/>
        <View style={styles.buttonContainer}>
          <Button
            icon={() => <Icon 
              size={18}
              color={iOSColors.green} 
              type="ionicon" 
              name="images" />
            }
            style={styles.button}
            labelStyle={{ color: "black" }}
            onPress={() => props.navigation.navigate('Post', {
              showNew: props.showNewPost,
              feedCategory: props.category,
              comeFrom: props.screen,
              choose: 2
            })}
          >
            รูปภาพ
          </Button>
        </View>
      </View>
      {
        (props.uploadProgress >= 0 || props.uploadError) ?
        <UploadProgressCard
          uploadError={props.uploadError}
          onClose={() => {
            props.setUploadProgress(-1);
            props.setUploadError(false);
          }}
          uploadProgress={props.uploadProgress}
        />
        : null
      }
    </View>
  )
}


const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: iOSColors.white
  },
  inputBox: {
    flex: 1
  },
  commentBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 25,
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    margin: 2,
    marginLeft: 10
  },
  tab: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: iOSColors.lightGray,
    marginTop: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 5,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: iOSColors.lightGray
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  titleText: {
    marginLeft: 5,
    fontSize: 20,
    color: iOSColors.orange,
    fontWeight: 'bold'
  },
  optionButton: {
    flexDirection: 'row',
    borderRadius: 40,
    paddingHorizontal: 7,
    paddingVertical: 7,
    alignItems: 'center',
    backgroundColor: colors.LIGHT_RED
  },
  optionText: {
    marginRight: 5,
    //color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  },
  progressContainer: {
    padding: 10,
    marginTop: 5
  },
  postMenu: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  buttonContainer: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    flex: 1,
    alignSelf: 'stretch'
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 30
  }
})

export default NewFeedHeader;