import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions
} from 'react-native';
import { iOSColors } from 'react-native-typography';
import { TouchableRipple } from 'react-native-paper';

import ProductArea from './ProductArea';
import Type from './Type';
import Category from './Category';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProductFeedHeader = (props) => {
    
    const [ areaVisible, setAreaVis ] = useState(false);
    const [ typeVisible, setTypeVis ] = useState(false);
    const [ categoryVisible, setCateVis ] = useState(false); 

    const renderArea = () => {
        if(props.tambon !== '') return <Text style={[styles.redText, styles.bottomText]}>{props.tambon}</Text>
        else if(props.amphoe !== '') return <Text style={[styles.redText, styles.bottomText]}>{props.amphoe}</Text>
        else if(props.changwat !== '') return <Text style={[styles.redText, styles.bottomText]}>{props.changwat}</Text>
        else return <Text style={[styles.greyText, styles.bottomText]}>ทุกจังหวัด</Text>
    }

    const renderType = () => {
        if(props.type === '') return <Text style={[styles.greyText, styles.bottomText]}>ทุกประเภท</Text>
        else return <Text style={[styles.redText, styles.bottomText]}>{props.type}</Text>
    }

    return (
        <View style={styles.Root}>
                <TouchableRipple style={styles.menuView} onPress={() => setAreaVis(true) }>
                    <View>
                        <Text style={[styles.greyText, styles.topText]}>พื้นที่</Text>
                        <Text style={[styles.greyText, styles.bottomText]}>
                            {renderArea()}
                        </Text>
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
                        <Text style={[styles.redText, styles.bottomText]}>{props.category}</Text>
                    </View>
                </TouchableRipple>
                <Category
                    visible={categoryVisible}
                    setVisible={setCateVis}
                    setCategory={props.setCategory}
                    setType={props.setType}
                />
                <TouchableRipple style={styles.menuView} onPress={() => setTypeVis(true) }>
                    <View>
                        <Text style={[styles.greyText, styles.topText]}>ประเภท</Text>
                        {renderType()}
                    </View>
                </TouchableRipple>
                <Type
                    category={props.category}
                    visible={typeVisible}
                    setVisible={setTypeVis}
                    setType={props.setType}
                />            
        </View>
    )
}


const styles = StyleSheet.create({
    Root: {     
      flexDirection: 'row',
      borderBottomWidth: 0.2,
      borderColor: iOSColors.gray,
      shadowColor: "#000",
shadowOffset: {
	width: 0,
	height: 1,
},
shadowOpacity: 0.18,
shadowRadius: 1.00,

elevation: 1,
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
        borderLeftWidth: 0.2
    },
    greyText: {
        color: iOSColors.gray
    },
    redText: {
        color: iOSColors.orange
    },
    topText: {
        fontSize: 14
    },
    bottomText: {
        fontSize: 17
    }
  })

export default ProductFeedHeader;