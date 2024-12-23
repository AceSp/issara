import React, { memo } from "react";
import { 
  StyleSheet, 
  View,
} from "react-native";
import {
    SearchBar
} from 'react-native-elements';
import 'moment/locale/th';



function SearchHeader(props) {

  return (
    <View style={styles.Root}>
      <SearchBar />
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

export default memo(SearchHeader);