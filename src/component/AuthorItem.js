import React from 'react';
import {
  Card,
} from 'react-native-paper';

import { 
    DEFAULT_AVATAR
} from '../utils/constants';
import AvatarWrapper from './AvatarWrapper';

const AuthorItem = (props) => {
  return (
      <Card 
        onPress={() => props.navigation.navigate('Shop', {
            shopId: props.id
        })}
      >
          <Card.Title 
            title={props.itemName}
            left={(props) => <AvatarWrapper
                {...props} 
                uri={props.avatar}
                label={props.itemName}
                />
            }
          />
      </Card>
  )
}

export default AuthorItem;