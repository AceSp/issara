import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import { 
  Card,
  ProgressBar
} from 'react-native-paper';
import { iOSColors } from 'react-native-typography';

import { colors } from '../../../utils/constants';
import PostBox from '../../../component/PostBox';

const NewsFeedHeader = (props) => {
  return (
    <View style={styles.Root}>

      <View style={styles.header}>
        <View style={styles.title}>
          <Icon
            name={props.iconName}
            type={props.iconType}
            color={iOSColors.orange}
            size={25}
          />
          <Text style={styles.titleText}> {props.titleText}</Text>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('NewsCategory',
            {
              setShowNewfeed: props.setShowNewPost,
              showNew: props.showNewPost,
              setCate: props.setCategory,
              categ: props.category
            }
          )}>
          <View style={styles.optionButton}>
            <Text style={styles.optionText}>หมวดหมู่</Text>
            <Icon
              name="ios-options"
              type="ionicon"
              color='black'
              size={20}
            />
          </View>
        </TouchableOpacity>
      </View>
      <PostBox
        avatar={props.avatar}
        onFocus={() => props.navigation.navigate('Post', {
          showNew: props.showNewPost,
          feedCategory: props.category,
          comeFrom: "News"
        })}
      />
      {
        props.uploadProgress >= 0 &&
        <Card style={styles.progressContainer}>
          <Text>กำลังอัพโหลดไฟล์...</Text>
          <ProgressBar progress={props.uploadProgress / 100} />
        </Card>
      }
    </View>
  )
}


const styles = StyleSheet.create({
  Root: {
    flex: 1
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
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: iOSColors.lightGray,
    marginTop: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 7,
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
    fontWeight: 'bold'
  },
  progressContainer: {
    padding: 10,
    marginTop: 5
  }
})

export default NewsFeedHeader;