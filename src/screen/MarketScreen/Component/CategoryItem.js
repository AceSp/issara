import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { materialTall } from 'react-native-typography';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CategoryItem = (props) => {
  return (
    <TouchableOpacity key={props.name} style={styles.itemView} onPress={props.onPress}>
    <View>
      <View style={styles.catePic}>
        <Image source={ props.picture } style={styles.catePic} />
      </View>
      <Text style={[materialTall.subheading, { fontWeight: 'bold' }]}>{props.name}</Text>
    </View>
  </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cateHeader: {
    paddingVertical: 10,
    alignSelf: 'stretch',
  },
  catePic: {
    width: width*0.3,
    height: width*0.3,
    borderRadius: 5,
    overflow: 'hidden'
  },
  itemView: {
    alignItems: 'center',
    marginTop: 20,
    width: width*0.3
  }
})

export default memo(CategoryItem);