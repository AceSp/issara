import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
} from 'react-native';
import {
  Icon
} from 'react-native-elements';
import { materialTall, iOSColors } from 'react-native-typography';

const SellButton = (props) => {
    return (
            <TouchableOpacity onPress={props.onPress} elevation={5} style={styles.box}>
                <Icon color="white" type="entypo" name="megaphone" />
                <Text style={[materialTall.button, styles.text]} >ลงขาย</Text>
            </TouchableOpacity>        
    )
}


const styles = StyleSheet.create({
    box: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: iOSColors.orange,
      padding: 12,
      borderRadius: 25,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 12,
      },
      shadowOpacity: 0.58,
      shadowRadius: 16.00,
      elevation: 24,
      position: 'absolute',
      zIndex: 1,
      bottom: 40
    },
    text: {
      fontSize: 20,
      marginLeft: 20,
      color: 'white'
    }
  })

export default SellButton;