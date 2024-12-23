import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import {
  Avatar
} from 'react-native-elements';

import { colors } from '../../utils/constants';
import AvatarWrapper from '../../component/AvatarWrapper';


const ListItem = (props) => {
  return(
    <TouchableHighlight onPress={() => props.navigation.navigate('UserProfile', 
        { 
          userId: props.id
        })}  
      underlayColor={colors.LIGHT_RED_2} 
      >
      <View style={styles.listItem}>
        <AvatarWrapper 
          uri={props.avatar}
          label={props.itemName[0]}
          style={styles.avatar}
        />
        <Text style={styles.groupName} >{props.itemName}</Text>
      </View>
    </TouchableHighlight>
    
  );
}

const FollowedListScreen = (props) => {
  
  const { following } = props.route.params;

  const _renderItem = ({ item }) => {
  return <ListItem {...item} navigation={props.navigation} />
  }
  return (
    <View style={styles.Root}>
        <FlatList
          contentContainerStyle={{ alignSelf: 'stretch' }}
          data={following}
          keyExtractor={item => item._id}
          renderItem={_renderItem}
        />
    </View>
    
        
  )
}

const styles = StyleSheet.create({
  Root: {     
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center', 
  },
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
  groupName: {
    marginLeft: 20,
    fontSize: 20
  }
})

export default FollowedListScreen;