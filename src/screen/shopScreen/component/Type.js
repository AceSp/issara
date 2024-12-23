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
  Divider,
  Image,
  Overlay
} from 'react-native-elements';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';
import SwitchSelector from 'react-native-switch-selector';

import { marketCategory, colors } from '../../../utils/constants';
import { 
  TouchableRipple,
  Button
} from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Type = (props) => {
  
  const [ localShopType, setLocalShopType ] = useState(props.shopType);
  const [ localHaveStoreFront, setLocalHaveStoreFront ] = useState(props.haveStoreFront);
  const [ localHaveOnline, setLocalHaveOnline ] = useState(props.haveOnline);
  const [ typeInitial, setTypeInitial ] = useState(0);
  const [ placeInitial, setPlaceInitial ] = useState(0);

  useEffect(() => {
    if(props.shopType === 'ผลิต') setTypeInitial(0);
    else if(props.shopType === 'จำหน่าย') setTypeInitial(1);
    else setTypeInitial(2);
    if(!props.haveStoreFront && props.haveOnline) {
      setPlaceInitial(0)
    } else if(props.haveStoreFront && props.haveOnline) {
      setPlaceInitial(1)
    } else {
      setPlaceInitial(2)
    }
  },[props.shopType, props.haveStoreFront, props.haveOnline])

  const shopPlaceSwitch = (v) => {
    if(v === 'online') {
      setLocalHaveStoreFront(false);
      setLocalHaveOnline(true);
    } else if(v === 'all') {
      setLocalHaveStoreFront(true);
      setLocalHaveOnline(true);
    } else {
      setLocalHaveStoreFront(true);
      setLocalHaveOnline(false);
    }
  }

  const select = () => {
      props.setShopType(localShopType);
      props.setHaveStoreFront(localHaveStoreFront);
      props.setHaveOnline(localHaveOnline);
      props.setVisible(false)
  }

  return (
    <Overlay 
        onRequestClose={() => props.setVisible(false)} 
        isVisible={props.visible}
        overlayStyle={{padding: 0, marginTop: 50, minWidth: 300}}
        onBackdropPress={() => props.setVisible(false)}
        height="auto"
    >
        <View >
            <View style={styles.header}>
                <Text style={[materialTall.title, styles.headerText ]}>ประเภท</Text>
                <TouchableRipple underlayColor={colors.LIGHT_GRAY} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
                    <Icon name="close" size={25} /> 
                </TouchableRipple>
            </View>
            <View style={styles.switchContainer}>
              <SwitchSelector
                initial={typeInitial}
                buttonColor={colors.PRIMARY}
                selectedColor="black"
                style={{ margin: 10 }}
                textColor={materialColors.blackTertiary}
                selectedTextStyle={{fontWeight: 'bold'}}
                backgroundColor={colors.LIGHT_GREY_2}
                hasPadding
                options={[
                  { label: "ผลิต", value: 'ผลิต'},
                  { label: "จำหน่าย", value: 'จำหน่าย'}, 
                  { label: "บริการ", value: 'บริการ'}
                ]}
                onPress={(value) => setLocalShopType(value)}
              />
              <SwitchSelector
                initial={placeInitial}
                buttonColor={colors.PRIMARY}
                style={{ margin: 10 }}
                selectedColor="black"
                textColor={materialColors.blackTertiary}
                selectedTextStyle={{fontWeight: 'bold'}}
                backgroundColor={colors.LIGHT_GREY_2}
                hasPadding
                options={[
                  { label: "ออนไลน์", value: 'online'},
                  { label: "ทั้งหมด", value: 'all'}, 
                  { label: "มีหน้าร้าน", value: 'storeFront'}
                ]}
                onPress={(value) => shopPlaceSwitch(value)}
              />
              <Button
                labelStyle={[materialTall.button, { color: iOSColors.orange }]}
                onPress={select}
              >
                ตกลง
              </Button>
            </View>  
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
  }
})

export default Type;