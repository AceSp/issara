import React, { memo } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import {
  Card,
  Text
} from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/th';
import { 
    materialTall, 
    iOSColors 
} from 'react-native-typography';

moment.locale('th');

function FullSponsor(props) {
    const sponsor = props.shop? props.shop 
                    : props.product ? props.product
                    : null;
    return (
        <Card 
            onPress={() => props.navigation? 
                props.navigation.navigate('Shop', { id: sponsor? sponsor.id : null })
                :
                null
            }
            style={{margin: 5, borderWidth: 0.5}}>
            <Card.Cover source={sponsor ? sponsor.avatar : null} />
            <Card.Content>
                    <Text style={materialTall.title}>{sponsor? sponsor.name : null}</Text>
                    <View style={styles.sponsorTag}>
                        <Text style={materialTall.captionWhite}>ผู้สนับสนุนคอลัมน์</Text>
                    </View>
                <Text style={materialTall.subheading}>{props.text}</Text>
            </Card.Content>
        </Card>   
    )
}

const styles = StyleSheet.create({
    root: {
        alignItems: "flex-start", 
        paddingLeft: 10,
        paddingBottom: 15,
        backgroundColor: 'white'
    },
    image: {
        height: 80,
        width: 120,
        marginRight: 5,
        borderRadius: 5,
        overflow: 'hidden'
    },
    sponsorTag: {
        borderRadius: 5,
        alignSelf: 'baseline',
        marginTop: 2,
        paddingHorizontal: 10,
        paddingVertical: 1,
        backgroundColor: iOSColors.orange
    },
    leftStyle: {
        marginRight: 85, 
        marginTop: 25, 
        marginBottom: 10
    },
    rightStyle: {
        position: 'absolute', 
        top: 58, 
        left: 115
    },
    rowView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default memo(FullSponsor);
