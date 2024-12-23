import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
  ScrollView
} from 'react-native';
import {
  Button,
  TextInput
} from 'react-native-paper';
import {
  Icon,
  SocialIcon
} from 'react-native-elements';
import { useMutation } from '@apollo/client';
// import {
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
//   LoginManager,
// } from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin';

import Loading from '../component/Loading';
import LOGIN_MUTATION from '../graphql/mutations/login';
import API_LOGIN_MUTATION from '../graphql/mutations/apiLogin';
import { AuthContext } from '../utils/context';
import { StyleSheet } from 'react-native';
import { 
  iOSColors,
  materialTall
} from 'react-native-typography';
import { HTTP_URL } from '../utils/apollo-client';
import IssaraLogoLong from '../assets/Images/IssaraLogoLong'

const width = Dimensions.get('window').width;

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { signIn } = React.useContext(AuthContext);

  const [login, { data }] = useMutation(LOGIN_MUTATION);
  const [apiLogin, { data: api_login_data }] = useMutation(API_LOGIN_MUTATION);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '373674619437-9ua4qdvlj293vel92q9fijof7adg5hq3.apps.googleusercontent.com',
      offlineAccess: false,
      androidClientId: '373674619437-b5rv61knih50ned01qh24rcnaqqnpc33.apps.googleusercontent.com'
    });
  }, [])

  async function handleSubmit() {
    setLoading(true);

    if (username.length === 0) {
      setErrorText('โปรดกรอกชื่อผู้ใช้')
      setLoading(false);
      return setUsernameError(true);
    }
    setUsernameError(false);

    if (password.length === 0) {
      setErrorText('โปรดกรอกรหัสผ่าน')
      setLoading(false);
      return setPasswordError(true);
    }
    setPasswordError(false);

    try {
      console.log("---------LoginScreen------------")
      console.log(HTTP_URL)
      const res = await fetch(HTTP_URL+"login", {
        method: "POST",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
        })
      });
      if(!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText)
      }
      const resJSON = await res.json();
      signIn(resJSON.accessToken);
      return;
    } catch (e) {
      if (e.message === 'could not find this username') {
        setErrorText('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setUsernameError(true);
        setLoading(false);
      }
      else if (e.message === 'incorrect password') {
        setErrorText('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
        setPasswordError(true);
        setLoading(false);
      }
      else {
        setErrorText('มีบางอย่างผิดพลาด... เรากำลังตรวจสอบอยู่')
        setUsernameError(true);
        setLoading(false);
        console.log(e.message)
        console.log(e)
      }
    }

    // console.log("-------login----------")
    // login({ variables: { username, password } })
    //   .then(({ data }) => {
    //     console.log("*********accessToken*******")
    //     console.log(data.login.accessToken);
    //     return signIn(data.login.accessToken/*, data.login.me*/);
    //   })
    //   .catch(e => {
    //     if (/username/i.test(e.message)) {
    //       setErrorText('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    //       setUsernameError(true);
    //       setLoading(false);
    //     }
    //     else if (/password/i.test(e.message)) {
    //       setErrorText('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    //       setPasswordError(true);
    //       setLoading(false);
    //     }
    //     else {
    //       console.log("----------LoginScreen----------")
    //       console.log(e);
    //       setErrorText('มีบางอย่างผิดพลาด... เรากำลังตรวจสอบอยู่')
    //       setUsernameError(true);
    //       setLoading(false);
    //     }
    //   });
  }

  // function getInfoFromToken(token) {
  //   const PROFILE_REQUEST_PARAMS = {
  //     fields: {
  //       string: 'id, name,  first_name, last_name',
  //     },
  //   };
  //   const profileRequest = new GraphRequest(
  //     '/me',
  //     { token, parameters: PROFILE_REQUEST_PARAMS },
  //     (error, result) => {
  //       if (error) {
  //         console.log('login info has error: ' + error);
  //       } else {
  //         console.log("----------LoginScreen----------")
  //         console.log(result)
  //         apiLogin({
  //           variables: {
  //             ...result
  //           }
  //         })
  //           .then(({ data }) => {
  //             return signIn(data.apiLogin.accessToken);
  //           });
  //         console.log('result:', result);
  //       }
  //     },
  //   );
  //   new GraphRequestManager().addRequest(profileRequest).start();
  // }

  // function loginWithFacebook() {
  //   // Attempt a login using the Facebook login dialog asking for default permissions.
  //   LoginManager.logInWithPermissions(['public_profile']).then(
  //     login => {
  //       if (login.isCancelled) {
  //         console.log('Login cancelled');
  //       } else {
  //         AccessToken.getCurrentAccessToken().then(data => {
  //           const accessToken = data.accessToken.toString();
  //           getInfoFromToken(accessToken);
  //         });
  //       }
  //     },
  //     error => {
  //       console.log('Login fail with error: ' + error);
  //     },
  //   );
  // };

  // async function loginWithGoogle() {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     let userInfo;
  //     // userInfo is
  //     // {
  //     //   idToken: string,
  //     //     serverAuthCode: string,
  //     //       scopes: Array < string >, // on iOS this is empty array if no additional scopes are defined
  //     //         user: {
  //     //     email: string,
  //     //       id: string,
  //     //         givenName: string,
  //     //           familyName: string,
  //     //             photo: string, // url
  //     //               name: string // full name
  //     //   }
  //     // }
  //     if(await GoogleSignin.isSignedIn()) 
  //       userInfo = await GoogleSignin.getCurrentUser()
  //     else
  //       userInfo = await GoogleSignin.signIn();
  //     await apiLogin({
  //       variables: {
  //         ...userInfo.user,
  //         first_name: userInfo.user.givenName,
  //         last_name: userInfo.user.familyName,
  //         avatar: userInfo.user.photo,
  //       }
  //     })
  //       .then(({ data }) => {
  //         console.log('login')
  //         return signIn(data.apiLogin.accessToken);
  //       });
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //       alert('Cancel');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       alert('Signin in progress');
  //       // operation (f.e. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       alert('PLAY_SERVICES_NOT_AVAILABLE');
  //       // play services not available or outdated
  //     } else {
  //       console.log(error)
  //       // some other error happened
  //     }
  //   }
  // }

  function resetError() {
    setErrorText('');
    setUsernameError(false);
    setPasswordError(false);
  }

  // if (loading) return <Loading />

  return (
    <View style={styles.root}>
      <ScrollView>
      <IssaraLogoLong
        width='100%'
        height={100}
      />
      <View>
        <TextInput
          mode="outlined"
          placeholder="ชื่อผู้ใช้หรืออีเมลล์"
          onChangeText={value => setUsername(value)}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={resetError}
          error={usernameError}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          placeholder="รหัสผ่าน"
          onChangeText={value => setPassword(value)}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={resetError}
          secureTextEntry
          error={passwordError}
          style={styles.input}
        />
      </View>
      {(usernameError || passwordError) &&
        <Text style={[materialTall.subheading, styles.errorText]}>{errorText}</Text>
      }
      <Button
        mode="contained"
        style={styles.loginButton}
        full
        loading={loading}
        onPress={handleSubmit}
      >
        <Text>เข้าสู่ระบบ</Text>
      </Button>
      <View style={styles.forgotPassword}>
        <TouchableWithoutFeedback onPress={() => props.navigation.navigate('ForgotPassword')}>
          <Text style={[styles.text, styles.buttonText]}>ลืมรหัสผ่านใช่ไหม?</Text>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.divider}>
        <View style={styles.divideLine} />
        <Text style={styles.text}>หรือ</Text>
        <View style={styles.divideLine} />
      </View>
      {/* <Button
        mode="contained"
        full
        onPress={loginWithFacebook}
        style={styles.loginButton}
        color={iOSColors.blue}
        icon={() => <Icon name="facebook" color="white" />}
      >
        เข้าสู่ระบบ facebook
      </Button> */}
      {/* <Button
        mode="contained"
        full
        onPress={loginWithGoogle}
        style={styles.loginButton}
        color={iOSColors.white}
        icon={({ size, color }) => (
          <Image
            source={require('../assets/Images/g-logo.png')}
            style={{ width: 20, height: 20 }}
          />
        )}
      >
        เข้าสู่ระบบ google
      </Button>
      <View style={[styles.registerContainer, {
        marginTop: (usernameError || passwordError)?
        100 : 120
      }]}>
        <Text style={styles.text}>
          ยังไม่มีบัญชีใข่ไหม?
           </Text>
        <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Register')}>
          <Text style={[styles.text, styles.buttonText]}>
            สมัครสมาชิก
           </Text>
        </TouchableWithoutFeedback>
      </View> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    padding: 30,
    flex: 1,
    backgroundColor: iOSColors.white
  },
  input: {
    margin: 5,
  },
  loginButton: {
    marginTop: 20
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 20,
  },
  divideLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: iOSColors.gray
  },
  divider: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  text: {
    fontSize: 18
  },
  buttonText: {
    color: iOSColors.orange,
    fontWeight: 'bold'
  },
  loginButton: {
    padding: 5,
    marginTop: 20,
    fontFamily: 'Roboto-medium'
  },
  errorText: {
      textAlign: 'center',
      color: iOSColors.orange,
  }
})

export default Login;