import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ColorPropType,
    Text,
    Dimensions,
    Image
} from 'react-native';
import {
  Avatar,
  Icon
} from 'react-native-elements';
import {
    Card,
    TouchableRipple,
    Divider
} from 'react-native-paper';
import { materialTall, iOSColors } from 'react-native-typography';
import moment from 'moment';
import { Rating } from 'react-native-ratings';

import { 
    DEFAULT_IMAGE
} from '../../../utils/constants/image';
import SAVE_PRODUCT_MUTATION from '../../../graphql/mutations/saveProduct';
import { useMutation } from '@apollo/client';
import { TouchableHighlight } from 'react-native-gesture-handler';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ShopCard = (props) => {
    return (
        <TouchableOpacity onPress={() => props.navigation.navigate('Shop', { shopId: props.id })} >
            <Card style={{ marginTop: 5, height: 180 }}  >
                <Card.Title titleStyle={{alignSelf: 'center'}} title={props.itemName} />
                <Divider />
                <Card.Content style={styles.rowView}>
                    <View style={styles.image}>
                        <Image 
                            resizeMode='cover'
                            style={styles.image} 
                            source={props.headerPic
                                ? { uri: props.headerPic}
                                : DEFAULT_IMAGE} 
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <Text 
                            numberOfLines={2} 
                            style={[materialTall.subheading, { color: iOSColors.orange }]}
                        >
                            {props.phrase? props.phrase.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : ""}
                        </Text>
                        <View style={styles.rowView}>
                            <Text 
                                numberOfLines={1} 
                                style={[materialTall.body2, { color: iOSColors.orange }]}>
                                    {props.avgRating.toFixed(1)+'\t'}  
                            </Text>
                            <Rating
                                readonly
                                startingValue={props.avgRating}
                                imageSize={20}
                            />
                            <Text numberOfLines={1} style={[materialTall.body1, { marginLeft: 5, color: iOSColors.gray }]}>
                                ({
                                 props.fivestarCount
                                +props.fourstarCount
                                +props.threestarCount
                                +props.twostarCount
                                +props.onestarCount
                                })
                            </Text>
                        </View> 
                        <View style={styles.rowView}>
                        <Text style={materialTall.body1}>
                            {props.isOpen? 
                            <Text style={[materialTall.body2, styles.infoText, { color: iOSColors.green }]}>
                                เปิด
                            </Text>
                            :
                            props.isOpen === false?
                                <Text style={[materialTall.body2, styles.infoText, { color: iOSColors.orange }]}>
                                    ปิด
                                </Text>
                                :
                                null
                            }
                            {
                                props.isOpen !== null?
                                    props.isOpen? 'ถึง' : '\u25CFเปืด'
                                    :
                                    null
                            } 
                            {props.next? '\t'+props.next + "นาฬิกา" : null}
                        </Text>
                        </View>    
                    </View>
                </Card.Content>       
            </Card>
        </TouchableOpacity>
        
    )
}


const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        height: height*0.17,
        flex: 1,
        marginRight: 5,
        borderRadius: 5,
        overflow: 'hidden'
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold'
    },
    addressText: {
        fontSize: 20,
        color: iOSColors.gray,
        marginVertical: 8
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10
    },
    buttonText: {
        color: iOSColors.gray,
        marginLeft: 10
    },
    nameView: {
        flexWrap: 'wrap'
    },
    save: {
        position: 'absolute',
        backgroundColor: iOSColors.gray,
        width: height*0.05,
        height: height*0.05,
        zIndex: 1,
        left: 5,
        top: 5,
        borderRadius: 5,
        justifyContent: 'center'
    }
  })

export default ShopCard;