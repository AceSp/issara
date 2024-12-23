import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Dimensions,
    Image
} from 'react-native';
import {
    Icon
} from 'react-native-elements';
import {
    Card,
    TouchableRipple
} from 'react-native-paper';
import { materialTall, iOSColors } from 'react-native-typography';
import moment from 'moment';
import { useMutation } from '@apollo/client';

import { colors } from '../../../utils/constants';
import SAVE_PRODUCT_MUTATION from '../../../graphql/mutations/saveProduct';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProductCard = (props) => {
    const [isSaved, setIsSaved] = useState(props.meSaved ? true : false);

    const [saveProduct, { data }] = useMutation(SAVE_PRODUCT_MUTATION);

    const bookmark = () => {
        setIsSaved(!isSaved);
        saveProduct({
            variables: { productId: props.id }
        });
    }

    return (
        <TouchableOpacity onPress={() => props.navigation.navigate('Product', { productId: props.id })} >
            <Card style={{ marginTop: 5, height: 200 }}  >
                <Card.Title title={props.itemName} />
                <Card.Content style={styles.rowView}>
                    <View style={styles.image}>
                        <TouchableOpacity style={styles.save} onPress={bookmark}>
                            {isSaved ?
                                <Icon size={32} name="bookmark" color={iOSColors.orange} />
                                :
                                <Icon size={32} name="bookmark-border" color="white" />
                            }

                        </TouchableOpacity>
                        <Image 
                            style={styles.image} 
                            source={{ uri: props.pictures[0] }}
                            // source={props.picture
                            //     ? {uri: props.picture[0]}
                            //     : require('../../../assets/pic/rose-blue-flower-rose-blooms-67636.jpeg')} 
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            numberOfLines={1}
                            style={[materialTall.headline, { color: iOSColors.orange }]}
                        >
                            {(props.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                        <Text numberOfLines={1} style={materialTall.body1}>{props.amphoe}  {props.province}</Text>
                        <Text numberOfLines={1} style={materialTall.body1}>{moment(props.createdAt).fromNow()}</Text>
                        <View style={[styles.rowView, styles.buttonView]}>
                            <TouchableRipple
                                style={[styles.rowView, styles.button]}
                                onPress={() => props.navigation.navigate('NewChatRoom', {
                                    user: props.author
                                })}
                            >
                                <View style={{ alignItems: 'center' }} >
                                    <Icon color={iOSColors.gray} type="simple-line-icon" name="bubble" />
                                    <Text style={styles.buttonText}>คุยกับผู้ขาย</Text>
                                </View>
                            </TouchableRipple>
                            <TouchableRipple style={[styles.rowView, styles.button]}>
                                <View style={{ alignItems: 'center' }}>
                                    <Icon color={iOSColors.gray} name="phone" />
                                    <Text style={styles.buttonText}>โทรหาผู้ขาย</Text>
                                </View>
                            </TouchableRipple>
                        </View>
                    </View>
                </Card.Content>
                <Card.Actions>
                </Card.Actions>
            </Card>
        </TouchableOpacity>

    )
}


const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
    },
    image: {
        height: height * 0.17,
        flex: 1.2,
        marginRight: 10,
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
    priceText: {
        fontSize: 20,
        color: iOSColors.green,
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    buttonText: {
        color: iOSColors.gray,
    },
    topAd: {
        marginTop: 4,
        marginLeft: 5,
        borderColor: iOSColors.orange,
        borderWidth: 0.6,
        alignSelf: 'baseline',
        borderRadius: 5,
        padding: 2
    },
    nameView: {
        flexWrap: 'wrap'
    },
    save: {
        position: 'absolute',
        backgroundColor: colors.FOB,
        width: height * 0.05,
        height: height * 0.05,
        zIndex: 1,
        left: 5,
        top: 5,
        borderRadius: 5,
        justifyContent: 'center'
    },
    buttonView: {
        flex: 1,
        justifyContent: 'space-around',
        alignSelf: 'stretch',
    }
})

export default ProductCard;

//<View style={styles.topAd}><Text style={{color: colors.PRIMARY}}>Top Ad</Text></View>
/*
<TouchableOpacity onPress={() => props.navigation.navigate('Product', { id: props.id })} >
            <Card style={{ marginTop: 5 }}  >
                <Card.Title title={props.name} />
                <Card.Cover />
                <Card.Content style={styles.rowView}>
                    <View style={styles.image}>
                        <TouchableOpacity style={styles.save} onPress={bookmark}>
                            {props.meSaved?
                            <Icon size={32} name="bookmark" color={colors.PRIMARY} />
                            :
                            <Icon size={32} name="bookmark-border" color="white" />
                            }

                        </TouchableOpacity>
                        <Image style={styles.image} source={require('../../../assets/pic/rose-blue-flower-rose-blooms-67636.jpeg')} />
                    </View>
                    <View style={{flex: 1}}>
                        <Text
                            numberOfLines={2}
                            style={[materialTall.headline, { fontWeight: 'bold' }]}
                        >
                            {props.name}
                        </Text>
                        <Text numberOfLines={1} style={materialTall.body1}>{props.amphoe}  {props.province}</Text>
                        <Text
                            numberOfLines={1}
                            style={[materialTall.headline, { color: iOSColors.orange }]}
                        >
                            {(props.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                    </View>
                </Card.Content>
                <Card.Actions>
                    <TouchableRipple onPress={() => console.log('j')} style={[styles.rowView, styles.button]}>
                        <View>
                            <Icon color={colors.SECONDARY} type="simple-line-icon" name="bubble" />
                            <Text style={styles.buttonText}>คุยกับผู้ขาย</Text>
                        </View>
                    </TouchableRipple>
                    <TouchableRipple style={[styles.rowView, styles.button]}>
                        <View>
                            <Icon color={colors.SECONDARY} name="phone" />
                            <Text style={styles.buttonText}>โทรหาผู้ขาย</Text>
                        </View>
                    </TouchableRipple>
                </Card.Actions>
            </Card>
        </TouchableOpacity>*/