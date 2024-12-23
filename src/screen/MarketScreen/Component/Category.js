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
  Overlay
} from 'react-native-elements';
import { iOSColors, materialTall } from 'react-native-typography';
import { 
  TouchableRipple,
  Portal,
  Modal
} from 'react-native-paper';

import { marketCategory } from '../../../utils/constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Category = (props) => {
  const select = (value, display) => {
    props.setType('');
    props.setCategory(value);
    props.setDisplayCategory(display);
    props.setVisible(false);
  }

  const renderCategory = () => {
    let arr = [];
    for(const c of marketCategory) {
      arr.push(
          <TouchableRipple key={c.engName}  onPress={() => select(c.engName, c.name) }>
            <View style={styles.itemView}>
              {/* <View style={styles.icon}>
                  <Icon type={c.iconType} name={c.iconName} color={iOSColors.orange} />
              </View> */}
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
        useNativeDriver={true}
    >
      <View>
        <View style={styles.header}>
              <Text style={[materialTall.title, styles.headerText ]}>หมวดหมู่</Text>
              <TouchableRipple underlayColor={iOSColors.lightGray} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
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
  // return (
  //   <Portal>
  //     <Modal 
  //         onDismiss={() => props.setVisible(false)} 
  //         fullScreen 
  //         visible={props.visible}
  //         contentContainerStyle={styles.modalContainer}
  //     >
  //       <View>
  //         <View style={styles.header}>
  //               <Text style={[materialTall.title, styles.headerText ]}>หมวดหมู่</Text>
  //               <TouchableRipple underlayColor={iOSColors.lightGray} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
  //                   <Icon name="close" size={25} color="white" /> 
  //               </TouchableRipple>
  //         </View>
  //         <ScrollView>        
  //           <View style={{paddingBottom: 70}}>
  //             {renderCategory()}
  //           </View>
  //         </ScrollView>
  //       </View> 
  //     </Modal>
  //   </Portal>
  // )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: iOSColors.lightGray,
    backgroundColor: iOSColors.orange
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

export default Category;