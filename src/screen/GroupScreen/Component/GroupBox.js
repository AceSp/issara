import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text
} from 'react-native';
import {
  Avatar,
  Icon
} from 'react-native-elements';
import {
  ToggleButton
} from 'react-native-paper';
import { useQuery } from '@apollo/client';

import { colors } from '../../../utils/constants';
import { ScrollView } from 'react-native-gesture-handler';
import { iOSColors } from 'react-native-typography';
import GET_MY_FOLLOWING_QUERY from '../../../graphql/queries/getMyFollowing';
import Loading from '../../../component/Loading';

const Button = (props) => {
  return (
    <TouchableOpacity onPress={() => props.buttonFunction()} >
      <View style={styles.button}>
        <Icon name={props.iconName} type={props.iconType} />
        <Text style={styles.buttonText}>{props.text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const GroupBox = (props) => {

  const { loading, error, data } = useQuery(GET_MY_FOLLOWING_QUERY);

  const renderFollowed = () => {
    const followField = [];
    let count = 0;
    for (const f of data.getMyFollowing) {
      if (count <= 9) {
        followField.push(
          <TouchableOpacity
            key={f.id}
            onPress={() => props.navigation.navigate('UserProfile',
              {
                userId: f.id
              })}
          >
            <View style={styles.userItem}>
              <Avatar
                rounded
                size="large"
                source={f.avatar ? { uri: f.avatar } : require('../../../assets/pic/profile.jpg')}
              />
              <View style={styles.groupName}>
                <Text numberOfLines={1} >{f.itemName}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
        count++;
      }
    }
    if (count > 9) {
      followField.push(
        <TouchableOpacity onPress={() => props.navigation.navigate('FollowingList', { following: data.getMyFollowing })} key="read-more">
          <View style={styles.viewMoreList}>
            <Icon name="more-horiz" />
            <Text>ดูเพิ่มเติม</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return followField;
  }

  const renderList = () => {
    return (
      <View style={styles.box}>
        <View style={styles.bottomBox}>
          <View style={props.following.length < 3 ? { width: props.following.length * 110 } : null}>
            <ScrollView horizontal>
              {renderFollowed()}
            </ScrollView>
          </View>
          <TouchableOpacity onPress={() => props.navigation.navigate('FollowingList', { following: data.getMyFollowing })}>
            <View style={styles.viewMore}>
              <Text style={{ fontWeight: 'bold' }}>ดูเพิ่มเติม</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    )
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  return (
    <View style={styles.Root}>
      {renderList()}
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: colors.LIGHT_GRAY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: colors.LIGHT_GRAY
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7
  },
  titleText: {
    marginLeft: 5,
    fontSize: 20,
    color: colors.PRIMARY,
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
  thumbnail: {
    borderTopRightRadius: 11,
    borderTopLeftRadius: 11,
    flex: 1,
    width: 100,
  },
  thumbnailBorder: {
    borderWidth: 0.25,
  },
  avatar: {
    borderTopRightRadius: 11,
    borderTopLeftRadius: 11,
    flex: 1,
    width: 100,
  },
  groupItem: {
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 0.25,
    borderRadius: 10,
    borderTopWidth: 0,
    width: 100,
    height: 100
  },
  topBox: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 5
  },
  bottomBox: {
    marginTop: 5
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.LIGHT_GRAY,
    borderRadius: 20,
    marginHorizontal: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignItems: 'center'
  },
  buttonText: {
    marginLeft: 5
  },
  groupName: {
    padding: 3
  },
  viewMore: {
    alignItems: 'center',
    padding: 10
  },
  viewMoreList: {
    justifyContent: 'center',
    backgroundColor: colors.LIGHT_RED,
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1
  },
  userItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 65,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default GroupBox;