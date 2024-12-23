import React from 'react';
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { 
    Card,
    ProgressBar,
    IconButton
} from 'react-native-paper';
import { iOSColors } from 'react-native-typography';

const UploadProgressCard = ({
    uploadError,
    uploadProgress,
    onClose,
}) => {
    console.log("----------UPloadProgressCard----------")
    console.log(uploadError)
    console.log(uploadProgress)
    return (
        <Card style={styles.card}>
            <View style={styles.container}> 
                <View style={styles.progress}>
                    <Text style={uploadError ? styles.errorText : styles.text}>
                        {uploadError 
                        ? "เกิดปัญหาขณะอัพโหลดไฟล์" 
                        : "กำลังอัพโหลดไฟล์..."}
                    </Text>
                    <ProgressBar progress={uploadProgress / 100} />
                </View>
                <IconButton 
                    style={styles.closeButton}
                    icon="close"
                    onPress={onClose}
                />
            </View>
        </Card>
    )
}


const styles = StyleSheet.create({
    card: {
        padding: 10,
        marginTop: 5,
    },
    closeButton: {
        backgroundColor: iOSColors.lightGray2
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    progress: {
        flex: 1
    },
    text:{},
    errorText: {
        color: iOSColors.orange
    }
  })

export default UploadProgressCard;