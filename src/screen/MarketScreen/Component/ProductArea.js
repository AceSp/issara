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

import { useQuery } from '@apollo/client';
import GET_AREA_QUERY from '../../../graphql/queries/getArea';
import Loading from '../../../component/Loading';
import { TouchableRipple } from 'react-native-paper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProductArea = (props) => {

  const [ amphoe, setAmphoe ] = useState('');
  const [ changwat, setChangwat ] = useState('');

  const [ modelArr, setModelArr ] = useState([]);

  const {data, loading, error, refetch} = useQuery(GET_AREA_QUERY);

  useEffect(() => {
    refetch({ changwat });
  },[changwat]);

  useEffect(() => {
    refetch({ changwat, amphoe });
  },[amphoe]);

  const tambonSubmit = (value) => {
    props.setTambon(value)
    props.setAmphoe(amphoe);
    props.setChangwat(changwat);
    setAmphoe('');
    setChangwat('');
    props.setVisible(false);
  }

  const submit = () => {
    props.setTambon('');
    props.setAmphoe(amphoe);
    props.setChangwat(changwat);
    setAmphoe('');
    setChangwat('');
    props.setVisible(false);
  }

  const chooseItem = (value) => {
      if(changwat === '') setChangwat(value);
      else if(amphoe === '') setAmphoe(value);
      else tambonSubmit(value)
  }

  const renderModel = () => {
    let arr = [];
    for(const i of data.getArea) {
      arr.push(
          <TouchableRipple key={i} onPress={() => chooseItem(i) }>
            <View style={styles.itemView}>
              <Text style={materialTall.headline}>{i}</Text>
              {amphoe === ''? <Icon name="chevron-right" /> : null } 
            </View>
          </TouchableRipple>
      )
    }
    return arr;
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  return (
    <Overlay 
        onRequestClose={() => props.setVisible(false)} 
        isVisible={props.visible}
        overlayStyle={{padding: 0, marginTop: 50}}
        onBackdropPress={() => props.setVisible(false)}
        height="auto"
    >
        <View>
            <View style={styles.header}>
                <Text style={[materialTall.title, styles.headerText ]}>พื้นที่</Text>
                <TouchableRipple underlayColor={iOSColors.lightGray} style={styles.closeOverlay} onPress={() => props.setVisible(false)}>
                    <Icon name="close" size={25} /> 
                </TouchableRipple>
            </View>
            {data.getArea.length > 12?
            <ScrollView>
              <TouchableRipple onPress={() => submit() }>
                <View style={styles.itemView}>
                  <Text style={materialTall.headline}>ทั้งหมด</Text>
                </View>
              </TouchableRipple>
              <View style={{overflow: 'hidden'}}>
                {renderModel()}
              </View>
            </ScrollView>
            :
            <View>
                <TouchableRipple onPress={() => submit() }>
                  <View style={styles.itemView}>
                    <Text style={materialTall.headline}>ทั้งหมด</Text>
                  </View>
                </TouchableRipple>
                <View style={{overflow: 'hidden'}}>
                  {renderModel()}
                </View>
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
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  closeOverlay: {
    paddingBottom: 5,
    marginRight: 20
  },
})

export default ProductArea;