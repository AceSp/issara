import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
  IconButton
} from 'react-native-paper';

const Header = (props) => {
    return (
        <View style={styles.Root}>
            <IconButton  
                icon="arrow-left" 
                onPress={() => props.navigation.goBack()} 
            />
            <IconButton 
                icon="tune"
                onPress={() => props.navigation.navigate('ProductOption', 
                    { 
                        cateParam: props.category,
                        typeParam: props.type,
                        tambonParam: props.tambon,
                        amphoeParam: props.amphoe,
                        changwatParam: props.changwat,
                    //     paramSet: {
                    //         setCategory: props.setCategory,
                    //         setType: props.setType,
                    //         setBrand: props.setBrand,
                    //         setModel: props.setModel,
                    //         setFuel: props.setFuel,
                    //         setGear: props.setGear,
                    //         setColor: props.setColor,
                    //         setMemory: props.setMemory,
                    //         setTruckType: props.setTruckType,
                    //         setJobType: props.setJobType,
                    //         setPayment: props.setPayment,
                    //         setMinMiles: props.setMinMiles,
                    //         setMaxMiles: props.setMaxMiles,
                    //         setMinYear: props.setMinYear,
                    //         setMaxYear: props.setMaxYear,
                    //         setBedroom: props.setBedroom,
                    //         setBathroom: props.setBathroom,
                    //         setTambon: props.setTambon,
                    //         setAmphoe: props.setAmphoe,
                    //         setChangwat: props.setChangwat,
                    //         setMinPrice: props.setMinPrice,
                    //         setMaxPrice: props.setMaxPrice,
                    //         setSecondHand: props.setSecondHand
                    // }
                    })
                }
            />
        </View>
    )
}


const styles = StyleSheet.create({
    Root: {     
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
      paddingLeft: 20,
      paddingRight: 30,
    },
    container: {
        borderRadius: 50,
        padding: 5
    },
    icon: {
        width: 30,
        height: 30
    }
})

export default Header;