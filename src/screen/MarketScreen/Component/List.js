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
import { TouchableRipple } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const List = (props) => {

  const select = (value) => {
    if(value === "ทั้งหมด") {
        props.setValue('');
        props.setVisible(false);
    } else {
        props.setValue(value);
        props.setVisible(false);
    } 
  }

  const renderList = () => {
    let arr = [];
    if(!props.posting) {
      arr.push(
        <TouchableRipple key={"ทั้งหมด"} style={styles.itemView} onPress={() => select("ทั้งหมด") }>
          <Text style={materialTall.headline}>ทั้งหมด</Text>
        </TouchableRipple>
    )
    }
    for(const i of props.list) {
      arr.push(
          <TouchableRipple key={i} style={styles.itemView} onPress={() => select(i) }>
            <Text style={materialTall.headline}>{i}</Text>
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
                <Text style={[materialTall.title, styles.headerText ]}>{props.listName}</Text>
                <TouchableRipple underlayColor={iOSColors.lightGray} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
                    <Icon name="close" size={25} /> 
                </TouchableRipple>
            </View>
            {props.list.length > 12?
            <ScrollView>
                
              <View>
                {renderList()}
              </View>
            </ScrollView>
            :
            <View>
              {renderList()}
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

export default List;