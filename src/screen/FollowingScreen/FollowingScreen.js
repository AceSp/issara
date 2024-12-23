
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import {
  Button
} from 'react-native-paper';

import { colors } from '../../utils/constants';
import { iOSColors } from 'react-native-typography';

const FollowingScreen = (props) => {
  return (
          <TouchableOpacity onPress={() => props.onPress() } style={styles.row}>
            <View style={styles.menuRow}>
              <View style={styles.icon}>
                {props.iconName === 'alpha-v'? 
                  <Icon
                  name="alpha-v" 
                  type="material-community" 
                  iconStyle={{ 
                    backgroundColor: iOSColors.yellow, 
                    borderRadius: 50
                  }}
                  containerStyle={{ 
                    padding: 3, 
                    margin: 0, 
                    backgroundColor: 'yellow', 
                    borderRadius: 50, 
                    borderWidth: 0.5, 
                    borderColor: iOSColors.lightGray2 
                  }}
                  color={'red'} 
                  size={30}
                  />
                  :
                  <Icon 
                  size={30}
                  color={colors.SECONDARY}
                  type={props.iconType}
                  name={props.iconName}
                  />
                }
                
              </View>
              <Text>{props.name}</Text>

            </View>
              {
                props.buttonLabel?
                <Button
                  mode="outlined"
                  style={styles.button}
                  onPress={props.buttonPress}
                >
                  {props.buttonLabel}
                </Button>
                : null
              }
          </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between'
  },
  menuRow: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center'
  },
  icon: {
    backgroundColor: colors.LIGHT_GREY_2,
    borderRadius: 20,
    padding: 5,
    marginRight: 15
  },
  button: {
    marginRight: 20
  }
})

export default FollowingScreen;