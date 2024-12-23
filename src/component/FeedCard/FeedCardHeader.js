import React, { memo, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native';
import {
  Card,
  Avatar,
  Divider,
} from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/th';
import { useMutation } from '@apollo/client';

import FollowButton from '../FollowButton';
import FOLLOW_MUTATION from '../../graphql/mutations/follow';
import UNFOLLOW_MUTATION from '../../graphql/mutations/unfollow';
import { DEFAULT_AVATAR } from '../../utils/constants';
import { iOSUIKitTall } from 'react-native-typography';
import AvatarWrapper from '../AvatarWrapper';

moment.locale('th');

function FeedCardHeader(props) {
  const [followed, setFollowed] = useState(false);

  const [follow, { data }] = useMutation(FOLLOW_MUTATION);
  const [unfollow, { data: data_unfollow }] = useMutation(UNFOLLOW_MUTATION);

  useEffect(() => {
    if (followed != props.author?.meFollowed) {
      setFollowed(props.author?.meFollowed);
    }
  }, [props.author?.meFollowed])

  const onFollowPress = () => {
    if (!props.author?.meFollowed) {
      follow({
        variables: { userId: props.author?.id }
      });
      setFollowed(!followed);
    } else {
      unfollow({
        variables: { userId: props.author?.id }
      });
      setFollowed(!followed);
    }
  }

  return (
    <View style={styles.root}>
      <View style={[styles.row, styles.authorView]}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('UserProfile',
            {
              userId: props.author?.id
            })}
        >
            <AvatarWrapper
              size={40}
              uri={props.author?.avatar}
              label={props.author?.itemName[0]}
            />
        </TouchableOpacity>
        <View style={{ width: '60%' }}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{ marginLeft: 16 }}>
            {props.author?.itemName}
          </Text>
          <Text style={{ marginLeft: 16 }}>
            {moment(props.createdAt).fromNow()}
          </Text>
        </View>
        <View style={{ paddingRight: 16 }}>
          {
          props.me?.id === props.author?.id ?
            null
            :
            <FollowButton
              followText="ติดตาม" unfollowText="เลิกติดตาม"
              follow={followed} onPress={onFollowPress}
            />
          }
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorView: {
    justifyContent: 'space-between',
  }
});

export default memo(FeedCardHeader);
