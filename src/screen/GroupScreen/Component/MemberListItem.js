import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {
  Avatar,
  Icon,
  Overlay,
  Divider
} from 'react-native-elements';

import { colors } from '../../../utils/constants';
import { useQuery, useMutation } from '@apollo/client';
import GET_GROUP_MEMBER from '../../../graphql/queries/getGroupMember';
import REMOVE_FROM_GROUP_MUTATION from '../../../graphql/mutations/removeFromGroup';
import CHANGE_ADMIN_MUTATION from '../../../graphql/mutations/changeAdmin';
import ADD_MOD_MUTATION from '../../../graphql/mutations/addMod';
import REMOVE_MOD_MUTATION from '../../../graphql/mutations/removeMod';
import AvatarWrapper from '../../../component/AvatarWrapper';

const width = Dimensions.get('window').width;

const OptionList = (props) => {
    return(
        <View>
            <TouchableOpacity onPress={() => props.adminPress()} style={styless.listItem}>
                <Icon size={40} type="material-community" name="account-star"  />
                <Text style={styless.optionText}>แต่งตั้งเป็นแอดมิน</Text>
            </TouchableOpacity>
            {props.isMod? 
            <TouchableOpacity onPress={() => props.removeModPress()} style={styless.listItem}>
                <Icon size={40} type="material-community" name="account-remove"  />
                <Text style={styless.optionText}>ปลดออกจากผู้ดูแล</Text>
            </TouchableOpacity>
            : 
            <TouchableOpacity onPress={() => props.addModPress()} style={styless.listItem}>
                <Icon size={40} type="material-community" name="account-plus"  />
                <Text style={styless.optionText}>แต่งตั้งเป็นผู้ดูแล</Text>
            </TouchableOpacity>
            }
            <Divider />
            <TouchableOpacity onPress={() => props.blockPress()} style={styless.listItem}>
                <Icon size={40} name="block"  />
                <Text style={styless.optionText}>ไล่ออกจากกลุ่ม</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => props.setVisible(false)}>
                <View style={styless.cancelButton}>
                    <Text style={styless.cancelText}>ยกเลิก</Text>
                </View>
            </TouchableOpacity>
            
        </View>
    );
}

const styless = StyleSheet.create({
  listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingLeft: 20
  },
  optionText: {
      marginLeft: 25,
      fontSize: 25
  },
  cancelButton: {
      alignItems: 'center',
      paddingVertical: 5,
  },
  cancelText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: colors.PRIMARY
  }
  })

const MemberListItem = (props) => {

    const [ overlayVisible , setVisible ] = useState(false);

    const [removeFromGroup, {data}] = useMutation(REMOVE_FROM_GROUP_MUTATION);
    const [changeAdmin, {data: changeAdmin_data}] = useMutation(CHANGE_ADMIN_MUTATION);
    const [addMod, {data: addMod_data}] = useMutation(ADD_MOD_MUTATION);
    const [removeMod, {data: removeMod_data}] = useMutation(REMOVE_MOD_MUTATION);

    let modArr = []
    for(const m of props.mod) {
        modArr.push(m._id);
    }
    const isMod = modArr.includes(props._id);

    const isAdmin = (props.admin._id == props._id);

    const modAdd = () => {
        addMod({
          variables: {
            _id: props.groupId,
            member_id: props._id
          }
        });
        setVisible(false);
    }

    const unMod = () => {
        removeMod({
          variables: {
            _id: props.groupId,
            member_id: props._id
          }
        });
        setVisible(false);
    }
  
    const remove = () => {
      removeFromGroup({
        variables: {
          _id: props.groupId,
          member_id: props._id
        },
        update: (store, { data: { removed } }) => {
          const storedData = store.readQuery({ query: GET_GROUP_MEMBER,
              variables: { _id: props.groupId }
           });

          const data = JSON.parse(JSON.stringify(storedData));
           let arr = [];
           for(const m of data.getGroupMember.member) {
               if(m._id !== props._id) {
                   arr.push(m)
               }
           };
           
              store.writeQuery({ query: GET_GROUP_MEMBER, 
                  variables: { _id: props.groupId },
                  data: { 
                      getGroupMember: {
                      __typename: 'getGroupMember',
                      pageInfo: {...data.getGroupMember.pageInfo},
                      member: arr
                    }  
                  } 
              })
      }
      });
      setVisible(false);
    }

    const adminPress = () => {
        Alert.alert(
          'คุณจะปลดสิทธิความเป็นแอดมินของคุณ',
          'ใน 1 กลุ่ม สามารถมีแอดมินได้เพียง 1 คน \nหากคุณแต่งตั้งคนนี้เป็นแอดมินคุณจะส่งต่อตำแหน่งของคุณไปให้ \n\nคุณแน่ใจแล้วหรือไม่',
          [
            {text: 'ใช่', onPress: () => console.log('admin')},
            {text: 'ไม่', onPress: () => {}, style: 'cancel'},
            
          ]
        )
    }

    const addModPress = () => {
        Alert.alert(
          'แต่งตั้งเป็นผู้ดูแล',
          'ต้องการแต่งตั้งสมาชิกคนนี้เป็นผู้ดูแลกลุ่ม',
          [
            {text: 'ใช่', onPress: () => modAdd()},
            {text: 'ไม่', onPress: () => {}, style: 'cancel'},
            
          ]
        )
    }

    const removeModPress = () => {
        Alert.alert(
          'ปลดออกจากผู้ดูแล',
          'ต้องการเปลี่ยนผู้ดูแลคนนี้เป็นสมาชิก',
          [
            {text: 'ใช่', onPress: () => unMod()},
            {text: 'ไม่', onPress: () => {}, style: 'cancel'},
            
          ]
        )
    }
  
    const blockPress = () => {
      Alert.alert(
        'ลบสมาชิก',
        'ต้องการไล่สมาชิกคนนี้ออกจากลุ่มหรือไม่',
        [
          {text: 'ใช่', onPress: () => remove()},
          {text: 'ไม่', onPress: () => {}, style: 'cancel'},
          
        ]
      )
    }

    const renderIcon = () => {
        if(isAdmin) return;
        if(props.isMod) {
            if(props.isAdmin) {
                return (
                    <TouchableOpacity onPress={() => setVisible(true)}>
                        <Icon 
                            containerStyle={styles.icon} 
                            name="more-vert" 
                            /> 
                    </TouchableOpacity>
                    
                )
            }

            return(
                <Icon 
                    onPress={() => blockPress()}
                    containerStyle={styles.icon} 
                    name="block" 
                    /> 
            )
        }
    }
  
    return(
        <View style={styles.listItem}>
          <AvatarWrapper 
            uri={props.avatar}
            label={props.itemName}
            style={styles.avatar}
          />
          <Text style={styles.userName} >{props.username}</Text>
          <View style={styles.optionButtons}>
            {isAdmin? <Text style={styles.positionText}>แอดมิน</Text> : 
            isMod? <Text style={styles.positionText}>ผู้ดูแล</Text> : null}
            <Icon 
              containerStyle={styles.icon} 
              name="chat-bubble" 
            />
            
            {renderIcon()}
            <Overlay
                isVisible={overlayVisible}
                onBackdropPress={() => setVisible(false)}
                height='auto'
            >
                <OptionList 
                    isMod={isMod}
                    setVisible={setVisible}
                    adminPress={adminPress}
                    addModPress={addModPress}
                    removeModPress={removeModPress} 
                    blockPress={blockPress}
                />
            </Overlay>
            
          </View>
        </View>
    );
  }

  const styles = StyleSheet.create({

    listItem: {
      flexDirection: 'row',
      backgroundColor: 'white',
      borderWidth: 0.25,
      borderColor: colors.LIGHT_GRAY,
      paddingVertical: 4,
      paddingHorizontal: 30,
      alignItems: 'center'
    },
    avatar: {
      borderWidth: 0.25,
    },
    userName: {
      marginLeft: 20,
      fontSize: 20
    },
    optionButtons: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end'
    },
    icon: {
      marginLeft: 15
    },
    positionText: {
        fontWeight: 'bold',
        color: colors.PRIMARY,
        fontSize: 15,
        marginLeft: 15
    }
  
  })

  export default MemberListItem;