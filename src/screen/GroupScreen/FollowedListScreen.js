import React, { useEffect, useState, useRef, useContext } from 'react';
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
import { store } from '../../utils/store';
import GET_MY_FOLLOWING from '../../graphql/queries/getMyFollowing';
import Loading from '../../component/Loading';
import { useQuery } from '@apollo/client';


const ListItem = (props) => {
  console.log("--------FollowedListScreen ListItem---------")
  console.log(props)
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
          size={40}
        />
        <Text style={styles.groupName} >{props.itemName}</Text>
      </View>
    </TouchableHighlight>
    
  );
}

const FollowedListScreen = (props) => {
  
  const { state: { me } } = useContext(store);

  const { loading, error, data } = useQuery(GET_MY_FOLLOWING);

  const _renderItem = ({ item }) => {
    return <ListItem {...item} navigation={props.navigation} />
  }
  if (loading) return <Loading />;
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>;
  console.log("--------FollowedListScreen--------")
  console.log(data)

  return (
    <View style={styles.Root}>
      <FlatList
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={data.getMyFollowing}
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