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
import { useMutation } from '@apollo/client';

import REPORT_POST_MUTATION from '../../graphql/mutations/reportPost';

function ReportModal(props) {
  const [report, { report_data }] = useMutation(REPORT_POST_MUTATION);

  function reportPost(reason) {
    report({
      variables: {
        pk: props.pk,
        id: props.id,
        reason: reason
      }
    })
  }
    return (
        <View>
            <Button
                onPress={() => reportPost(0)}
                labelStyle={iOSUIKitTall.title3}
                contentStyle={styles.shareOptionLabel}
                style={styles.shareOption}
            >
                แสปมหรือขายของ
            </Button>
            <Button
                onPress={() => reportPost(1)}
                labelStyle={iOSUIKitTall.title3}
                contentStyle={styles.shareOptionLabel}
                style={styles.shareOption}
            >
                ข้อมูลเท็จ
            </Button>
            <Button
                onPress={() => reportPost(2)}
                labelStyle={iOSUIKitTall.title3}
                contentStyle={styles.shareOptionLabel}
                style={styles.shareOption}
            >
                ผิดหมวดหมู่
            </Button>
        </View>
    )
}

export default ReportModal;

const styles = StyleSheet.create({
    shareOption: {
        marginLeft: 10,
        alignSelf: 'stretch'
    },
    shareOptionLabel: {
        alignSelf: 'flex-start'
    }
});