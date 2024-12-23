import React, { useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Dimensions,
    Text
} from 'react-native';
import {
  Avatar,
  Icon
} from 'react-native-elements';
import ReadMore from 'react-native-read-more-text';

import { colors } from '../../../utils/constants';
import JOIN_GROUP_MUTATION from '../../../graphql/mutations/joinGroup';
import LEAVE_GROUP_MUTATION from '../../../graphql/mutations/leaveGroup';
import { useMutation } from '@apollo/client';
import FollowButton from '../../../component/FollowButton';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const picHeight = height/6

const GroupHeader = (props) => {
  const [follow, setFollow] = useState(true);
  const [aboutLine, setAboutLine] = useState(3);
 
  let arr = [];
  for(const g of props.groupArr) {
    arr.push(g._id);
  }
  const isFollowed = arr.includes(props.group._id);

  let modArr = []
  for(const m of props.group.mod) {
    modArr.push(m._id);
  }
  const isMod = modArr.includes(props.myId);

  const isAdmin = (props.group.admin._id == props.myId)

  useEffect(() => {
    setFollow(isFollowed);
  }, [isFollowed]);

  const [joinGroup, {data_joinGroup}] = useMutation(JOIN_GROUP_MUTATION);
  const [leaveGroup, {data_leaveGroup}] = useMutation(LEAVE_GROUP_MUTATION);

  const joinPress = () => {
    setFollow(!follow);
    if(follow) {
      leaveGroup({
        variables: { _id: props.group._id }
      });
    } else {
      joinGroup({
        variables: { _id: props.group._id }
      });
    }
  }

    return (
        <View style={styles.Root}>
          <View style={styles.header}>
              <View style={{width: width, height: picHeight}}>
                <Image source={props.group.headerPic? {uri: props.group.headerPic} : {uri: props.group.groupPic} } 
                    style={styles.headerPic} 
                    resizeMode="cover" />
              </View>
              <Avatar 
                  rounded
                  size="large"
                  containerStyle={styles.groupPic}
                  source={{uri: props.group.groupPic}} 
                  showEditButton={isMod}
              />
              <View style={styles.topBox}>
                <View style={styles.topLeftBox}>
                  <Text style={[styles.nameText, styles.boldText]}>{props.group.name}</Text>
                </View>
                <FollowButton 
                  onPress={joinPress} 
                  follow={follow}
                  followText='เข้าร่วม'
                  unfollowText="ออกจากกลุ่ม" 
                />
              </View>
              <View style={styles.middleBox}>
                {props.group.public? <Text>กลุ่มสาธารณะ {'\u25CF'} </Text> : <Text>กลุ่มปิด</Text> }
                <Text>จำนวนสมาชิก {props.group.memberCount} คน</Text>
              </View>
              <View style={styles.bottomBox}>
                <View style={styles.bottomBoxHead}>
                  <Text style={[styles.boldText, styles.aboutText]}>เกี่ยวกับกลุ่มนี้</Text>
                  <TouchableOpacity>
                    <View style={styles.invite}>
                        <Icon name="plus" type="antdesign"/>
                        <Text style={styles.aboutText}>เชิญ</Text>
                    </View>
                  </TouchableOpacity>     
                </View>
                <TouchableOpacity onPress={() => aboutLine === 0? setAboutLine(3) : setAboutLine(0) }>
                  <View style={styles.aboutDetail}>
                  <ReadMore
                        numberOfLines={aboutLine}
                        renderTruncatedFooter={() => aboutLine === 0? 
                        <Text style={styles.readmoreText} >ซ่อน</Text> 
                        : 
                        <Text style={styles.readmoreText} >อ่านเพิ่มเติม</Text>}
                    >
                      <Text>{props.group.about}</Text>
                    </ReadMore>

                    {
                      isMod?
                      <View style={styles.editBox}>
                      <TouchableOpacity 
                          style={styles.editButton} 
                          onPress={() => props.navigation.navigate('GroupMember', 
                          { 
                            groupId: props.group._id,
                            mod: props.group.mod,
                            admin: props.group.admin,
                            isMod: isMod,
                            isAdmin: isAdmin
                          })} >
                        <Icon name="ios-people" type="ionicon"/>
                        <Text>จัดการสมาชิก</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                          style={styles.editButton} 
                          onPress={() => props.navigation.navigate('EditGroup', { group: props.group })} >
                        <Icon name="edit"/>
                        <Text>แก้ไขกลุ่ม</Text>
                      </TouchableOpacity>
                    </View> 
                    :
                    null
                    }
                    
                  </View>
                </TouchableOpacity>                     
              </View>
          </View>
          {isFollowed? 
          <View style={styles.box}>
            <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
              <Avatar rounded source={props.avatar? {uri: props.avatar} : require('../../../assets/pic/profile.jpg')}/>
            </TouchableOpacity>
            <View style={styles.commentBox}>
              <TextInput 
                style={styles.inputBox}
                placeholder='เขียนความคิดเห็น..'
                onFocus={() => props.navigation.navigate('GroupPost', { group: props.group })}
              />
            </View>
          </View>
          : null}
          
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
      borderWidth: 1 ,
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
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: colors.LIGHT_GRAY,
      marginTop: 2
    },
    header: {
      marginBottom: 15,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderColor: colors.LIGHT_GRAY,
      paddingBottom: 10
    },
    headerPic: {
        flex:1, 
        height: undefined, 
        width: undefined,
    },
    title: {
      flexDirection: 'row',
      alignItems: 'center'
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
      fontWeight: 'bold',
      fontSize: 15
    },
    groupPic: {
        position: 'absolute',
        marginTop: picHeight/1.3,
        marginLeft: width/18,
        borderWidth: 2,
        borderColor: 'white',
    },
    topBox: {
        marginLeft: width/4,
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'space-between',
        marginRight: 20,
    },
    topLeftBox: {
        marginLeft: 10,
    },
    nameText: {
         fontSize: 22,   
    },
    followText: {
         fontSize: 15
    },
    followedText: {
        fontSize: 17,
        color: 'white'
    },
    boldText: {
        fontWeight: 'bold',
    },
    followButton: {
         borderWidth: 1,
         borderRadius: 5,
         marginLeft: 20,
         marginTop: 2,
         paddingHorizontal: 7,
    },
    followedButton: {
        borderRadius: 5,
        marginLeft: 20,
        marginTop: 2,
        paddingHorizontal: 10,
        paddingVertical: 1,
        backgroundColor: colors.BUTTON_RED
    },
    middleBox: {
        flexDirection :'row',
        marginLeft: width/4 + 10,
        marginTop: 5
    },
    bottomBox: {
        marginLeft: width/18,
        marginTop: 10,
    },
    aboutText: {
        fontSize: 18
    },
    bottomBoxHead: {
        flexDirection: 'row',
        marginBottom: 5,
        marginTop: 5,
        justifyContent: 'space-between',
        paddingRight: 20
    },
    invite: {
        flexDirection: 'row',
        alignContent: 'center',
        backgroundColor: colors.LIGHT_GRAY,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    aboutDetail: {
      marginRight: 20
    },
    readmoreText: {
       fontWeight: 'bold',
       color: colors.PRIMARY,
    },
    editButton: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: colors.LIGHT_GRAY,
      borderRadius: 50,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginTop: 5
    },
    editBox: {
      flexDirection: 'row', 
      justifyContent: 'space-around'
    }
  })

export default GroupHeader;