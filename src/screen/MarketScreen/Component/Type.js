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

import { marketCategory } from '../../../utils/constants';
import { TouchableRipple } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Type = (props) => {

  const [ typeArr, setTypeArr ] = useState([]);

  const select = (value, display) => {
    if(value === "ทั้งหมด") {
      props.setType('');
      props.setVisible(false);
    } else {
      props.setType(value);
      props.setDisplayType(display);
      props.setVisible(false);
    } 
  }
  
  useEffect(() => {
      for(const c of marketCategory) {
        if(c.engName === props.category) setTypeArr(c.type);
      }
  },[props.category])

  const renderType = () => {
    let arr = [];
    if(!props.posting) {
      arr.push(
        <TouchableRipple key={"ทั้งหมด"} style={styles.itemView} onPress={() => select("ทั้งหมด") }>
          <Text style={materialTall.headline}>ทั้งหมด</Text>
        </TouchableRipple>
    )
    }
    for(const t of typeArr) {
      arr.push(
          <TouchableRipple key={t.engName} style={styles.itemView} onPress={() => select(t.engName, t.name) }>
            <Text style={materialTall.headline}>{t.name}</Text>
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
        height="auto"
    >
        <View>
            <View style={styles.header}>
                <Text style={[materialTall.title, styles.headerText ]}>ประเภท</Text>
                <TouchableRipple underlayColor={iOSColors.lightGray} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
                    <Icon name="close" size={25} /> 
                </TouchableRipple>
            </View>
            {typeArr.length > 12?
            <ScrollView>
                
              <View>
                {renderType()}
              </View>
            </ScrollView>
            :
            <View>
              {renderType()}
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

export default Type;