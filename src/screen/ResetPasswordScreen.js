import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    TouchableWithoutFeedback,
} from 'react-native';
import {
    Button,
    TextInput
} from 'react-native-paper';
import { useMutation } from '@apollo/client';
import {
    materialTall
} from 'react-native-typography';

import Loading from '../component/Loading';
import LOGIN_MUTATION from '../graphql/mutations/login';
import { AuthContext } from '../utils/context';
import { StyleSheet } from 'react-native';
import { iOSColors } from 'react-native-typography';
import VERIFY_TOKEN_MUTATION from '../graphql/mutations/verifyPassToken';
import RESET_PASSWORD_MUTATION from '../graphql/mutations/resetPassword';

const ResetPasswordScreen = (props) => {
    const {
        userId,
        token
    } = props.route.params

    console.log(props.route.params)
    //    cannot find user
    //    jwt malformed
    // incorrect token
    // jwt expired

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errorText, setErrorText] = useState('');
    const [passwordError, setPasswordError] = useState(false);

    const [verifyToken, { data, error, loading }] = useMutation(VERIFY_TOKEN_MUTATION);
    const [resetPassword, { data: reset_data }] = useMutation(RESET_PASSWORD_MUTATION);

    useEffect(() => {
        verifyToken({
            variables: {
                userId,
                token,
            }
        })
    }, []);

    function reset() {
        console.log(password.length)
        if(!password.length) {
            console.log("text")
            setErrorText('โปรดกรอกรหัสผ่าน');
            setPasswordError(true);
            return;
        }
        if(!confirm.length) {
            setErrorText('โปรดยืนยันรหัสผ่าน');
            setPasswordError(true);
            return;
        }
        if(password !== confirm) {
            setErrorText('รหัสผ่านไม่ตรงกับที่ยืนยัน กรุณาตรวจสอบอีกครั้ง');
            setPasswordError(true);
            return;
        }
        resetPassword({
            variables: {
                userId,
                token,
                password,
            }
        })
    }

    if(loading) return <Loading />

    if (error) {
        console.log(error.message)
        let verifyErrMsg = "";
        switch (error.message) {
            case "GraphQL error: cannot find user":
                verifyErrMsg = "ไม่พบผู้ใข้นี้ ลิงค์อาจไม่สมบูรณ์หรือผู้ใช้อาจถูกลบไปแล้ว"
                break;
            case "GraphQL error: jwt malformed":
                verifyErrMsg = "ลิงค์ไม่ถูกต้อง"
                break;
            case "GraphQL error: incorrect token":
                verifyErrMsg = "ไม่พบการร้องขอแก้ไขสำหรับบัญชีนี้ ลิงค์ที่คุณได้รับอาจเป็นของเก่า หรือลิงค์ไม่สมบูรณ์"
                break;
            case "GraphQL error: jwt expired":
                verifyErrMsg = "คำร้องขอหมดอายุ โปรดลองใหม่"
                break;
            default :
                verifyErrMsg = "พบข้อผิดพลาดในคำร้องขอ โปรดลองอีกครั้งภายหลัง"
                break;
        }

        return (
            <View style={[styles.root, styles.center]}>
                <Text style={[styles.verifyErrorText, materialTall.headline]}>
                    {verifyErrMsg}
                </Text>
            <Button
                style={styles.button}
                full
                onPress={() => props.navigation.navigate('ForgotPassword')}
            >
                ลองใหม่
      </Button>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            <Text style={[styles.headText, materialTall.headline]}>
                แก้ไขรหัสผ่าน
        </Text>
            <Text style={[materialTall.subheading, styles.descriptionText]}>

            </Text>
            <View>
                <TextInput
                    mode="outlined"
                    placeholder="รหัสผ่าน"
                    onChangeText={value => setPassword(value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setPasswordError(false)}
                    error={passwordError}
                    style={styles.input}
                />
                <TextInput
                    mode="outlined"
                    placeholder="ยืนยันรหัสผ่าน"
                    onChangeText={value => setConfirm(value)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setPasswordError(false)}
                    error={passwordError}
                    style={styles.input}
                />
            </View>
            {passwordError 
            && 
            <Text style={[materialTall.subheading, styles.errorText]}>
                {errorText}
            </Text>}
            <Button
                mode="contained"
                style={styles.button}
                full
                onPress={reset}
            >
                ตกลง
      </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        padding: 30,
        flex: 1,
        backgroundColor: iOSColors.white
    },
    headText: {
        alignSelf: 'center',
        marginTop: 120,
    },
    descriptionText: {
        color: iOSColors.gray,
        alignSelf: 'center',
    },
    input: {
        marginBottom: 20
    },
    button: {
        padding: 5
    },
    center: {
        justifyContent: 'center',
    },
    verifyErrorText: {
        textAlign: 'center'
    },
    errorText: {
        textAlign: 'center',
        marginBottom: 20,
        color: iOSColors.orange,
    }
})

export default ResetPasswordScreen;