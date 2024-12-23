import React, { memo } from 'react';
import {
  StyleSheet,
  Dimensions
} from 'react-native';
import {
  List,
  Divider,
} from 'react-native-paper';

import { iOSColors, materialTall } from 'react-native-typography';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ShopCate = (props) => {

  const renderType = () => {
    let arr = [];
    for(const t of props.type) {
      arr.push(
        <List.Item
          key={t}
          title={t}
          onPress={() => console.log('hi')}
       />
      )
    }
    return arr;
  }

  return (
    <List.Section key={props.name} style={{ width: width*0.49 }}>
        <List.Subheader style={[materialTall.subheading, { color: iOSColors.orange }]} >{props.name}</List.Subheader>
        <Divider />
        {renderType()}
    </List.Section>
  )
}

const styles = StyleSheet.create({
  cateView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  }
})

export default memo(ShopCate);