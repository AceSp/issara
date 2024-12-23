import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert
} from 'react-native';
import {
  Avatar,
  SearchBar,
  Icon
} from 'react-native-elements';

import { colors } from '../../utils/constants';
import { useQuery, useMutation } from '@apollo/client';
import GET_GROUP_MEMBER from '../../graphql/queries/getGroupMember';
import REMOVE_FROM_GROUP_MUTATION from '../../graphql/mutations/removeFromGroup';
import Loading from '../../component/Loading';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MemberListItem from './Component/MemberListItem';

const GroupMemberScreen = (props) => {
  
  const { 
    groupId,
    mod,
    admin, 
    isMod, 
    isAdmin 
  } = props.route.params;

  const [ text, setText ] = useState('');

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_GROUP_MEMBER,
    {
      variables: { 
          _id: groupId
        }
    }
  );

  const search = () => {
      refetch({
                _id: groupId,
                name: text
      });
  }

  if (loading) return <Loading />
  if (error) return <View style={styles.Root}><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) => <MemberListItem
    {...item} 
    navigation={props.navigation}
    mod={mod}
    admin={admin}
    isMod={isMod}
    isAdmin={isAdmin}
    refetch={refetch}
    groupId={groupId} 
  />
  return (
    <View style={styles.Root}>
        <FlatList
             ListHeaderComponent={
                 <View style={styles.header}>
                     <Icon type="antdesign" name="arrowleft" onPress={() => props.navigation.goBack()} />
                     <SearchBar 
                        placeholder="ค้นหาสมาชิก"
                        containerStyle={styles.search}  
                        value={text}
                        lightTheme
                        onChangeText={(value) => setText(value)}
                      />
                      {text !== ''? 
                        <TouchableOpacity onPress={() => search()} style={styles.searchButton}>
                            <Text style={styles.buttonText}>ค้นหา</Text>
                        </TouchableOpacity> 
                        : null }
                 </View>
             }
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={data.getGroupMember.member}
             keyExtractor={item => item._id}
             renderItem={_renderItem}
             onEndReachedThreshold={0.9}
             onEndReached={() => data.getGroupMember.pageInfo.hasNextPage? loadMore() : null}
             removeClippedSubviews={true}
             refreshing={networkStatus === 4}
             onRefresh={() => refetch({
                    _id: groupId,
                    name: text
          })}
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
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 15,
      backgroundColor: 'white',
      shadowColor: 'white',
      borderColor: 'white'
  },
  search: {
      flex: 1,
      marginLeft: 5,
      backgroundColor: 'white'
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
  userName: {
    marginLeft: 20,
    fontSize: 20
  },
  buttonText: {
      fontSize: 18,
      color: colors.PRIMARY,
      fontWeight: 'bold'
  },
  searchButton: {
      paddingHorizontal: 10,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
  },
  optionButtons: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end'
  },
  icon: {
    marginLeft: 15
  }

})

export default GroupMemberScreen;