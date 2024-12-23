import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import {
  Icon, 
  Divider,
  Image,
  Overlay
} from 'react-native-elements';
import { materialTall } from 'react-native-typography';

import { shopCategory, colors } from '../../../utils/constants';
import { TouchableRipple } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Category = (props) => {

  const select = (value) => {
    props.setCategory(value);
    props.setVisible(false);
  }

  const renderCategory = () => {
    let arr = [];
    for(const c of shopCategory) {
      arr.push(
          <TouchableRipple key={c.name}  onPress={() => select(c.name) }>
            <View style={styles.itemView}>
              <View style={styles.icon}>
                  <Icon type={c.iconType} name={c.iconName} color={colors.PRIMARY} />
              </View>
              <Text style={materialTall.headline}>{c.name}</Text>
            </View>
          </TouchableRipple>
      )
    }
    return arr;
  }
  
  return (
    <Overlay 
        onRequestClose={() => props.setVisible(false)} 
        fullScreen 
        isVisible={props.visible}
        animationType='slide'
        overlayStyle={{padding: 0}}
    >
      <View>
        <View style={styles.header}>
              <Text style={[materialTall.title, styles.headerText ]}>หมวดหมู่</Text>
              <TouchableRipple underlayColor={colors.LIGHT_GRAY} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
                  <Icon name="close" size={25} color="white" /> 
              </TouchableRipple>
        </View>
        <ScrollView>
          <View style={{paddingBottom: 70}}>
            {renderCategory()}
          </View>
        </ScrollView>
      </View> 
    </Overlay>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.LIGHT_GRAY,
    backgroundColor: colors.PRIMARY
  },
  headerText: {
    marginLeft: 25, 
    color: 'white'
  },
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
  icon: {
    backgroundColor: colors.LIGHT_GREY_2,
    borderRadius: 20,
    padding: 5,
    marginRight: 15
  },
  itemView: {
    flexDirection: 'row',
    paddingHorizontal: 25,
    paddingVertical: 8,
    alignItems: 'center'
  },
  closeOverlay: {
    paddingBottom: 5,
    marginRight: 20
  },
})

export default Category;