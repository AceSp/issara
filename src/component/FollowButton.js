import React from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from "react-native";
import 'moment/locale/th';

import { colors } from '../utils/constants';

function FollowButton(props) {

    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            {props.follow ?
                <View style={[styles.followedButton, props.style]}>
                    <Text style={[styles.followedText, props.textStyle]}>{props.unfollowText}</Text>
                </View>
                :
                <View style={[styles.followButton, props.style]}>
                    <Text style={[styles.followText, props.textStyle]}>{props.followText}</Text>
                </View>
            }

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    followText: {
        fontSize: 15
    },
    followedText: {
        fontSize: 17,
        color: 'white'
    },
    boldText: {
        fontWeight: 'bold',
    },
    followButton: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    followedButton: {
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 1,
        backgroundColor: colors.BUTTON_RED,
        alignItems: 'center',
        justifyContent: 'center',
        // width: 100
    },

})

export default FollowButton;