import React, { Component, useState, useEffect } from 'react';
import { 
    View,
    StyleSheet
 } from 'react-native';

import { Avatar, Text, Divider, Button } from 'react-native-elements';
import ProfileButtonGroup from '../../../component/ProfileButtonGroup';
import { useQuery, useSubscription } from '@apollo/client';
import GET_ME_QUERY from '../../../graphql/queries/getMe';
import Loading from '../../../component/Loading';
import { TextInput } from 'react-native-paper';
import { getMeData } from '../../../utils/store';
import formatNumber from '../../../utils/formatNumber';
import { colors } from '../../../utils/constants';
import AvatarWrapper from '../../../component/AvatarWrapper';

export default function ProfileHeader(props) {
    return (
        <View style={styles.Root}>
            <AvatarWrapper 
                uri={props.avatar}
                label={props.itemName}
            />
             <Text style={[styles.usernameText, styles.textBold]}>{props.username}</Text>
             <Text style={styles.realNameText} >{props.firstName}     {props.lastName}</Text>
             <View style={styles.metaHead}>
                
                <Text style={styles.textBold} >จำนวนโพสต์   </Text>
                <Text style={[styles.textMetaNumber, styles.textBold]}>
                    {formatNumber(props.userHavePost) }      
                </Text>
                
                <Text style={styles.textBold} >ดาวที่ได้รับ </Text>
                <Text style={[styles.textMetaNumber, styles.textBold]} > 
                    {formatNumber(props.userReceiveCoin) }      
                </Text>
               
                <Text style={styles.textBold} >ดาวที่มี </Text>
                <Text style={[styles.textMetaNumber, styles.textBold]} > 
                    {formatNumber(props.userHaveCoin) }     
                </Text>
               
             </View>
             <Divider />
             <Button title='ที่บันทึกไว้' />
             <Button  title='ซื้อดาว' onPress={() => props.navigation.navigate('BuyCoin')} />
             <Text style={styles.textBold} >กลุ่ม</Text>
             <Divider />
             <ProfileButtonGroup />
        </View>
    )
}

const styles = StyleSheet.create({
    Root: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
        backgroundColor: '#f1f6f8'
    },
    metaHead: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 10
    },
    textBold: {
        fontWeight: 'bold'
    },
    textMetaNumber: {
        fontSize: 20
    },
    realNameText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.SECONDARY
    },
    usernameText: {
        fontSize: 24
    }
  })

