import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';
import {
    Icon,
} from 'react-native-elements';
import {
    Button
} from 'react-native-paper';
import { iOSColors, iOSUIKitTall } from 'react-native-typography';

function MoreOptionModal({
    save,
    saved,
    showReportOption
}) {
    return (
        <View>
            <Button
                onPress={save}
                icon={() => <Icon
                    name={saved ? "bookmark" : "bookmark-border"}
                    size={30}
                    color={saved ? iOSColors.orange : iOSColors.gray}
                />}
                labelStyle={iOSUIKitTall.title3}
                contentStyle={styles.shareOptionLabel}
                style={styles.shareOption}
            >
                {saved ? "ยกเลิกบันทึก" : "บันทึกโพสต์"}
            </Button>
            <Button
                onPress={showReportOption}
                icon={() => <Icon
                    name="report"
                    size={30}
                    color={iOSColors.gray}
                />}
                labelStyle={iOSUIKitTall.title3}
                contentStyle={styles.shareOptionLabel}
                style={styles.shareOption}
            >
                รายงาน
            </Button>
        </View>
    )
}

export default MoreOptionModal;

const styles = StyleSheet.create({
    shareOption: {
        marginLeft: 10,
        alignSelf: 'stretch'
    },
    shareOptionLabel: {
        alignSelf: 'flex-start'
    }
});