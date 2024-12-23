import React, { 
  useState, 
  useEffect 
} from 'react';
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
import { 
  iOSColors, 
  materialTall 
} from 'react-native-typography';
import { TouchableRipple } from 'react-native-paper';

import { 
  carBrandAndModel,
  bikeBrandAndModel,
  cameraBrand,
  phoneBrand,
  tabletBrand,
  truckBrand
} from '../../../utils/constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Brand = (props) => {

  const [ list, setList ] = useState([]);

  const select = (value) => {
    if(value === "ทุกยี่ห้อ") {
      props.setBrand('');
      props.setVisible(false);
    } else {
      props.setBrand(value);
      props.setVisible(false);
    } 
  }

  useEffect(() => {
    if(props.category === "รถยนต์") setList(carBrandAndModel);
    if(props.type === "มอเตอร์ไซค์") setList(bikeBrandAndModel);
    if(props.type === "กล้องดิจิตอล") setList(cameraBrand);
    if(props.type === "โทรศัพท์มือถือ") setList(phoneBrand);
    if(props.type === "แท็บเล็ต") setList(tabletBrand);
    if(props.type === "รถบรรทุก") setList(truckBrand);
  },[props.category, props.type])

  const renderBrand = () => {
    let arr = [];
    if(!props.posting) {
      arr.push(
        <TouchableRipple key={"ทุกยี่ห้อ"} style={styles.itemView} onPress={() => select("ทุกยี่ห้อ") }>
          <Text style={materialTall.headline}>ทุกยี่ห้อ</Text>
        </TouchableRipple>
    )
    }
    for(const t of list) {
      arr.push(
          <TouchableRipple key={t.name} style={styles.itemView} onPress={() => select(t.name) }>
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
        overlayStyle={{padding: 0, marginTop: 50, overflow: 'hidden', minWidth: 300}}
        onBackdropPress={() => props.setVisible(false)}
    >
        <View>
            <View style={styles.header}>
                <Text style={[materialTall.title, styles.headerText ]}>ยี่ห้อ</Text>
                <TouchableRipple underlayColor={iOSColors.lightGray} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
                    <Icon name="close" size={25} /> 
                </TouchableRipple>
            </View>
            {list.length > 12?
            <ScrollView>
              <View>
                {renderBrand()}
              </View>
            </ScrollView>
            :
            <View>
              {renderBrand()}
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

export default Brand;