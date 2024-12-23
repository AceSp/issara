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
    <TouchableHighlight onPress={() => props.navigation.navigate('GroupRoom', 
        { 
          group: props.group, 
        })}  
      underlayColor={colors.LIGHT_RED_2} 
      >
      <View style={styles.listItem}>
        <AvatarWrapper 
          uri={props.group.groupPic}
          label={props.group.itemName[0]}
          style={styles.avatar}
        />
        <Text style={styles.groupName} >{props.group.name}</Text>
      </View>
    </TouchableHighlight>
    
  );
}

const GroupListScreen = (props) => {
  
  const { group } = props.route.params;

  const _renderItem = ({ item }) => <ListItem group={item} navigation={props.navigation} />
  return (
    <View style={styles.Root}>
        <FlatList
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={group}
             keyExtractor={item => item.name}
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

export default GroupListScreen;