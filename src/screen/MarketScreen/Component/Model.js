import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView
} from 'react-native';
import {
  Icon, 
  Overlay
} from 'react-native-elements';
import { iOSColors, materialTall } from 'react-native-typography';
import { TouchableRipple } from 'react-native-paper';

import { 
  carBrandAndModel,
  bikeBrandAndModel
} from '../../../utils/constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Model = (props) => {

  const [ modelArr, setModelArr ] = useState([]);

  const select = (value) => {
    if(value === "ทั้งหมด") {
        props.setModel('');
        props.setVisible(false);
    } else {
        props.setModel(value);
        props.setVisible(false);
    } 
  }
  
  useEffect(() => {
    if(props.category === "รถยนต์") {
      for(const c of carBrandAndModel) {
        if(c.name === props.brand) setModelArr(c.model);
      }
    }
    if(props.category === "มอเตอร์ไซค์") {
      for(const c of bikeBrandAndModel) {
        if(c.name === props.brand) setModelArr(c.model);
      }
    }
  },[props.category, props.brand])

  const renderModel = () => {
    let arr = [];
    if(!props.posting) {
      arr.push(
        <TouchableRipple key={"ทั้งหมด"} style={styles.itemView} onPress={() => select("ทั้งหมด") }>
          <Text style={materialTall.headline}>ทั้งหมด</Text>
        </TouchableRipple>
    )
    }
    for(const m of modelArr) {
      arr.push(
          <TouchableRipple key={m} style={styles.itemView} onPress={() => select(m) }>
            <Text style={materialTall.headline}>{m}</Text>
          </TouchableRipple>
      )
    }
    return arr;
  }

  return (
    <Overlay 
        onRequestClose={() => props.setVisible(false)} 
        isVisible={props.visible}
        overlayStyle={{padding: 0, marginTop: 50, minWidth: 300}}
        onBackdropPress={() => props.setVisible(false)}
    >
        <View>
            <View style={styles.header}>
                <Text style={[materialTall.title, styles.headerText ]}>รุ่น</Text>
                <TouchableRipple underlayColor={iOSColors.lightGray} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
                    <Icon name="close" size={25} /> 
                </TouchableRipple>
            </View>
            {modelArr.length > 12?
            <ScrollView >
                
              <View>
                {renderModel()}
              </View>
            </ScrollView>
            :
            <View>
              {renderModel()}
            </View>
            }
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
    justifyContent: 'space-between'
  },
  headerText: {
    marginLeft: 25
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
    backgroundColor: iOSColors.lightGray2,
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

export default Model;