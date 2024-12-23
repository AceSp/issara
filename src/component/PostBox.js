import React from 'react';
import {
    View,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import {
  Avatar,
} from 'react-native-elements';
import { iOSColors } from 'react-native-typography';
import AvatarWrapper from './AvatarWrapper';

const PostBox = (props) => {
    return (
      <View style={styles.box}>
          <TouchableOpacity onPress={() => props.navigation.navigate('MyProfile')}>
          <AvatarWrapper
              size={80}
              uri={props.avatar}
              label={props.itemName[0]}
          />
          </TouchableOpacity>
          <View style={styles.commentBox}>
              <TextInput 
                  style={styles.inputBox}
                  placeholder='เขียนความคิดเห็น..'
                  onFocus={() => props.onFocus()}
              />
          </View>
      </View>        
    )
}


const styles = StyleSheet.create({
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
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: iOSColors.lightGray,
      marginTop: 2
    }
  })

export default PostBox;