import React, { useState } from 'react';
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
import REQUEST_RESET_MUTATION from '../graphql/mutations/requestReset';
import { Keyboard } from 'react-native';

const ForgotPasswordScreen = (props) => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState(false);

  const [requestReset, { data, loading, error }] = useMutation(REQUEST_RESET_MUTATION);

  function request() {
    Keyboard.dismiss();
    requestReset({
      variables: { username }
    });
  }

  return (
    <View style={styles.root}>
        <Text style={[styles.headText, materialTall.headline]}>
            ค้นหาบัญชี
        </Text>
        <Text style={[materialTall.subheading, styles.descriptionText]}>
            กรอกชื่อผู้ใช้หรืออีเมลล์ของคุณ แล้วเราจะส่งอีเมลล์สำหรับแก้รหัสผ่านไปให้
        </Text>
      <View>
        <TextInput
          mode="outlined"
          placeholder="ชื่อผู้ใช้หรืออีเมลล์"
          onChangeText={value => setUsername(value)}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setUsernameError(false)}
          error={error}
          style={styles.input}
        />
      </View>
      <Button
        mode="contained"
        style={styles.button}
        full
        onPress={request}
        loading={loading}
      >
        ตกลง
      </Button>
      {
        error
        ? <Text style={[materialTall.subheading, styles.resultText]}>
            ไม่พบบัญชีที่ค้นหา
          </Text>
        : data?.requestReset
        ? <Text style={[materialTall.subheading, styles.resultText]}> 
            เราได้ส่งอีเมลล์ไปที่ {data?.requestReset} คลิกลิงต์ในนั้นเพื่อแก้ไขรหัสผ่าน
          </Text>
        : null
      }
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 30,
    flex: 1,
  },
  headText: {
    alignSelf: 'center',
    marginTop: 120,
  },
  descriptionText: {
    color: iOSColors.gray,
    alignSelf: 'center',
  },
  resultText: {
    alignSelf: 'center',
    marginTop: 30
  },
  input: {
      marginBottom: 20
  },
  button: {
      padding: 5
  }
})

export default ForgotPasswordScreen;