import React  from 'react';
import { 
    View
} from 'react-native';
import {
    Text,
} from 'react-native-paper';
import { Icon } from 'react-native-elements';

import { useApnBadge } from '../../utils/BadgeProvider';

function IconWithBadge({ name, type, badgeCount, color, size }) {
    return (
      <View style={{ width: 24, height: 24 }}>
        <Icon name={name} type={type} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -6,
              top: -3,
              backgroundColor: 'red',
              borderRadius: 6,
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
              {badgeCount}
            </Text>
          </View>
        )}
      </View>
    );
  }

function NotificationIconWithBadge(props) {

  const { badge } = useApnBadge();

    return <IconWithBadge {...props} badgeCount={badge} />;
}

export default NotificationIconWithBadge;