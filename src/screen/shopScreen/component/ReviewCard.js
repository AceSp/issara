import React from 'react';
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
import { Icon } from 'react-native-elements';
import {
    Card,
    TouchableRipple,
    Divider,
    Avatar
} from 'react-native-paper';
import { materialTall, iOSColors } from 'react-native-typography';
import moment from 'moment';
import { Rating } from 'react-native-ratings';

import SAVE_PRODUCT_MUTATION from '../../../graphql/mutations/saveProduct';
import { useMutation } from '@apollo/client';
import { TouchableHighlight } from 'react-native-gesture-handler';
import AvatarWrapper from '../../../component/AvatarWrapper';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ReviewCard = (props) => {

    return (
        <Card style={styles.root}>
            <Card.Title
                style={{ minHeight: 0 }}
                title={props.author.username}
                subtitle={moment(props.createdAt).fromNow()}
                left={(p) => 
                    <AvatarWrapper
                        {...p}
                        uri={props.author.avatar}
                        label={props.author.itemName[0]}
                    />}
            />
            <Card.Content>
                {/* <Rating
                    readonly
                    style={styles.starButtonContainer}
                    startingValue={props.star}
                    imageSize={20}
                /> */}
                <Text style={materialTall.body1}>{props.text}</Text>
            </Card.Content>
        </Card>
    )
}


const styles = StyleSheet.create({
    root: {
        paddingTop: 10,
        marginVertical: 1,
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    starButtonContainer: {
        width: 100, 
        marginTop: 15
    }
  })

export default ReviewCard;