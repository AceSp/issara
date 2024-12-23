import React, { memo } from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';
import {
    Button,
    IconButton,
    Chip,
} from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/th';

moment.locale('th');

function JobCardHeader({
    id,
    itemName,
    tag,
    meSaved,
    ratingScore,
    navigation,
    hideReview,
}) {

    function renderTag() {
        if(!tag) return;
        const arr = [];
        for (const [i, t] of tag.entries()) {
            arr.push(
            <Chip
                style={styles.tag}
                key={i}
            >
                {t}
            </Chip>
            )
        }
        return arr;
    }

    return (
        <View style={styles.root}>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>
                {itemName}
            </Text>
            <View style={styles.starContainer}>
                <View style={styles.rowView}>
                    {
                        hideReview 
                        ? null
                        : <Button 
                            onPress={() => navigation.navigate('JobDetail', {
                                productId: id,
                            })}
                        >
                            ดูรีวิว
                        </Button>
                    }

                    <IconButton
                        size={20}
                        onClick={() => console.log('bookmark')}
                        // style={{
                        //     // position: 'absolute',
                        //     color: isSaved ? colors.primary : 'white',
                        //     backgroundColor: colors.fob,
                        //     zIndex: 1,
                        //     height: 40,
                        //     width: 40,
                        //     marginRight: 20,
                        //     marginLeft: 20,
                        //     // right: 20,
                        //     // top: 15
                        //     // marginTop: 10,
                        //     // marginLeft: '60%',
                        // }}
                        icon={"heart-outline"}
                    />
                </View>
            </View>
            <View style={styles.tagContainer}>
                {renderTag()}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    commentContainer: {
        width: '25vw',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    root: {
        padding: 10,
    },
    rowView: {
        flexDirection: 'row'
    },
    starContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tag: {
        marginRight: 5,
        marginBottom: 5,
    },
    tagContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});

export default memo(JobCardHeader);

