import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import {
  Icon,
} from 'react-native-elements';
import 'moment/locale/th';
import IssaraLogo from '../assets/Images/IssaraLogo'

function MainHeader(props) {

  return (
    <View style={styles.Root}>
      <IssaraLogo
        width='100%'
        height={100}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        <Icon size={30} name='search' />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
        <Icon size={30} name='menu' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default MainHeader;