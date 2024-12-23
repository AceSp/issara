import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    ColorPropType,
    Text,
    Dimensions
} from 'react-native';
import {
  Avatar,
  Icon,
  Overlay
} from 'react-native-elements';
import { materialTall, materialColors } from 'react-native-typography';
import { TouchableRipple } from 'react-native-paper';

import { colors } from '../../../utils/constants';
import ProductArea from '../../MarketScreen/Component/ProductArea';
import Type from './Type';
import Category from './Category';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ShopFeedHeader = (props) => {
    
    const [ areaVisible, setAreaVis ] = useState(false);
    const [ typeVisible, setTypeVis ] = useState(false);
    const [ categoryVisible, setCateVis ] = useState(false); 

    const renderArea = () => {
        if(props.tambon !== '') return <Text numberOfLines={1} style={[styles.redText, styles.bottomText]}>{props.tambon}</Text>
        else if(props.amphoe !== '') return <Text numberOfLines={1} style={[styles.redText, styles.bottomText]}>{props.amphoe}</Text>
        else if(props.changwat !== '') return <Text numberOfLines={1} style={[styles.redText, styles.bottomText]}>{props.changwat}</Text>
        else return <Text numberOfLines={1} style={[styles.greyText, styles.bottomText]}>ทุกจังหวัด</Text>
    }

    const renderType = () => {
        let shopPlace
        if(props.haveStoreFront && props.haveOnline) shopPlace = 'ทั้งหมด'
        else if(!props.haveStoreFront && props.haveOnline) shopPlace = 'ออนไลน์'
        else if(props.haveStoreFront && !props.haveOnline) shopPlace = 'มีหน้าร้าน'
        return <Text numberOfLines={1} style={[styles.redText, styles.bottomText]}>{props.shopType} {shopPlace}</Text>
    }

    return (
        <View style={styles.Root}>
                <TouchableRipple style={styles.menuView} onPress={() => setAreaVis(true) }>
                    <View>
                        <Text style={[styles.greyText, styles.topText]}>พื้นที่</Text>
                            {renderArea()}
                    </View>
                </TouchableRipple>
                <ProductArea 
                    visible={areaVisible}
                    setVisible={setAreaVis}
                    setTambon={props.setTambon}
                    setAmphoe={props.setAmphoe}
                    setChangwat={props.setChangwat}
                />
                <TouchableRipple style={[styles.menuView, styles.middle]} onPress={() => setCateVis(true) }>
                    <View>
                        <Text style={[styles.greyText, styles.topText]}>หมวดหมู่</Text>
                        <Text numberOfLines={1} style={[styles.redText, styles.bottomText]}>{props.category}</Text>
                    </View>
                </TouchableRipple>
                <Category
                    visible={categoryVisible}
                    setVisible={setCateVis}
                    setCategory={props.setCategory}
                />
                <TouchableRipple style={styles.menuView} onPress={() => setTypeVis(true) }>
                    <View>
                        <Text style={[styles.greyText, styles.topText]}>ประเภท</Text>
                        {renderType()}
                    </View>
                </TouchableRipple>
                <Type
                    visible={typeVisible}
                    setVisible={setTypeVis}
                    shopType={props.shopType}
                    haveStoreFront={props.haveStoreFront}
                    haveOnline={props.haveOnline}
                    setShopType={props.setShopType}
                    setHaveStoreFront={props.setHaveStoreFront}
                    setHaveOnline={props.setHaveOnline}
                />            
        </View>
    )
}


const styles = StyleSheet.create({
    Root: {     
      flexDirection: 'row',
      borderBottomWidth: 0.2,
      borderColor: colors.SECONDARY,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1
    },
    menuView: {
        backgroundColor: 'white',
        flex: 1,
        paddingLeft: 10,
        marginVertical: 8,
        paddingVertical: 5, 
    },
    middle: {
        borderRightWidth: 0.2,
        borderLeftWidth: 0.2,
        flex: 1
    },
    greyText: {
        color: colors.SECONDARY
    },
    redText: {
        color: colors.PRIMARY
    },
    topText: {
        fontSize: 14
    },
    bottomText: {
        fontSize: 17
    }
  })

export default ShopFeedHeader;