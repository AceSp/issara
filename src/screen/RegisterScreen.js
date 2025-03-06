import React,
{
  useState,
  useEffect
} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Image
} from 'react-native';
import {
  Button,
  TextInput,
} from 'react-native-paper';
import {
  Icon
} from 'react-native-elements';
import { useMutation } from '@apollo/client';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin'
import Geolocation from 'react-native-geolocation-service';
import { 
  request,
  check, 
  PERMISSIONS,
  RESULTS 
} from 'react-native-permissions';
import { PlayInstallReferrer } from 'react-native-play-install-referrer';

import Loading from '../component/Loading';
import SIGN_UP_MUTATION from '../graphql/mutations/signup';
import API_LOGIN_MUTATION from '../graphql/mutations/apiLogin';
import {
  iOSColors,
  materialTall
} from 'react-native-typography';
import { AuthContext } from '../utils/context';
import IssaraLogoLong from '../assets/Images/IssaraLogoLong'
import { HTTP_URL } from '../utils/apollo-client';
import PermissionScreen from './PermissionScreen';

const Register = (props) => {
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [ mapCoord, setMapCoord ] = useState({
    latitude: 13.75630,
    longitude: 100.50180,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035
  });
  const [ markerCoord, setMarkerCoord ] = useState({ latitude: 13.75630, longitude: 100.50180 });
  const [ hasLocationPermission, setHasLocationPermission ] = useState(true);

  const [signup, { data }] = useMutation(SIGN_UP_MUTATION);
  // const [apiLogin, { data: api_login_data }] = useMutation(API_LOGIN_MUTATION);

  const { signIn } = React.useContext(AuthContext);

  const locateCurrentPosition = () => {
      Geolocation.getCurrentPosition(
        (position) => {
            setMapCoord({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.09,
              longitudeDelta: 0.035
          });

          setMarkerCoord({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        },
        (error) => {
            // See error code charts below.
            //console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
  }

  const requestLocationPermission = async () => {
    if(Platform.OS === 'android') {
      const response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if(response === 'granted') locateCurrentPosition();
    } else {
      const response = request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if(response === await 'granted') locateCurrentPosition();
    }
  }

  useEffect(() => {
    GoogleSignin.configure();
  }, [])

  useEffect(() => {
    if(Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              requestLocationPermission();
              break;
            case RESULTS.GRANTED:
              locateCurrentPosition();
              break;
            case RESULTS.BLOCKED:
              setHasLocationPermission(false)
              break;
          }
        })
    } else {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then((result) => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              break;
            case RESULTS.DENIED:
              requestLocationPermission();
              break;
            case RESULTS.GRANTED:
              locateCurrentPosition();
              break;
            case RESULTS.BLOCKED:
              setHasLocationPermission(false)
              break;
          }
        })
    }
  },[])

  async function handleSubmit() {
    setLoading(true);
    if (username.length === 0) {
      setErrorText('โปรดกรอกชื่อผู้ใช้')
      setLoading(false);
      return setUsernameError(true);
    }
    setUsernameError(false);

    if (validateEmail()) {
      if(!email.length)
        setErrorText('โปรดกรอกอีเมลล์')
      else 
        setErrorText('อีเมลล์ไม่ถูกต้อง')
      setLoading(false);
      return setEmailError(true);
    }
    setEmailError(false);

    if (password.length === 0) {
      setErrorText('โปรดกรอกรหัสผ่าน')
      setLoading(false);
      return setPasswordError(true);
    }
    setPasswordError(false);

    if (confirmPassword.length === 0) {
      setErrorText('โปรดยืนยันรหัสผ่าน')
      setLoading(false);
      return setConfirmPasswordError(true);
    }
    setConfirmPasswordError(false);

    if (password !== confirmPassword) {
      setErrorText('รหัสผ่านไม่ตรงกับที่ยืนยัน')
      setLoading(false);
      setPasswordError(true);
      return setConfirmPasswordError(true);
    }
    setConfirmPasswordError(false);
    setPasswordError(false);;

    let referrerToken = null;
    PlayInstallReferrer.getInstallReferrerInfo((installReferrerInfo, error) => {
      if (!error) {
        const referrerMatch = installReferrerInfo.installReferrer.match(/referrer\?=(.*)/);
        const referrerToken = referrerMatch ? referrerMatch[1] : null;
        console.log("Referrer token = " + referrerToken);
      } else {
        console.log("Failed to get install referrer info!");
        console.log("Response code: " + error.responseCode);
        console.log("Message: " + error.message);
      }
    });

    try {
      console.log("-----------RegisterScreen----Signup------")
      console.log(markerCoord)
      console.log(referrerToken)
      const res = await fetch(HTTP_URL+"signup", {
        method: "POST",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username, 
          email, 
          password, 
          pinLocation: {
            lat: markerCoord.latitude,
            lon: markerCoord.longitude,
          },
          referrerToken
        })
      });
      console.log(res)
      const resJSON = await res.json();
      signIn(resJSON.accessToken);
      return;
    } catch (e) {
      if (/username/i.test(e.message)) {
        setErrorText('ชื่อนี้มีผู้ใช้แล้ว')
        setLoading(false);
        setEmailError(true);
      }
      else if (/email/i.test(e.message)) {
        setErrorText('อีเมลล์ไม่ถูกต้อง')
        setLoading(false);
        setEmailError(true);
      }
      else if (/password/i.test(e.message)) {
        setLoading(false);
        setPasswordError(true);
      }
      else {
        console.log(e.message);
        setErrorText('มีบางอย่างผิดพลาด... เรากำลังตรวจสอบอยู่')
        setLoading(false);
        setUsernameError(true)
      }
    }
  };

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
  //         // apiLogin({
  //         //   variables: {
  //         //     ...result
  //         //   }
  //         // })
  //         //   .then(({ data }) => {
  //         //     return signIn(data.apiLogin.accessToken);
  //         //   });
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

  async function loginWithGoogle() {
    try {
      console.log("--------RegisterScreen----------")
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      console.log(hasPlayServices)
      // userInfo is
      // {
      //   idToken: string,
      //     serverAuthCode: string,
      //       scopes: Array < string >, // on iOS this is empty array if no additional scopes are defined
      //         user: {
      //     email: string,
      //       id: string,
      //         givenName: string,
      //           familyName: string,
      //             photo: string, // url
      //               name: string // full name
      //   }
      // }
      let referrerToken = null;
      PlayInstallReferrer.getInstallReferrerInfo((installReferrerInfo, error) => {
        if (!error) {
          const referrerMatch = installReferrerInfo.installReferrer.match(/referrer\?=(.*)/);
          const referrerToken = referrerMatch ? referrerMatch[1] : null;
          console.log(installReferrerInfo)
          console.log("Referrer token = " + referrerToken);
        } else {
          console.log("Failed to get install referrer info!");
          console.log("Response code: " + error.responseCode);
          console.log("Message: " + error.message);
        }
      });
      const signInResult = await GoogleSignin.signIn();
      const userInfo = signInResult.data
      console.log(userInfo)
      const resObj = await fetch(HTTP_URL+"api_login", {
        method: "POST",
        credentials: "include",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: userInfo.user.id,
          itemName: userInfo.user.name, 
          avatar: userInfo.user.photo,
          email: userInfo.user.email, 
          pinLocation: {
            lat: markerCoord.latitude,
            lon: markerCoord.longitude,
          },
          referrerToken
        })
      });
      const res = await resObj.json()
      // const res = resObj
      if(!resObj.ok) {
        alert(res.message);
      }
      return signIn(res.accessToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress');
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('PLAY_SERVICES_NOT_AVAILABLE');
        // play services not available or outdated
      } else {
        console.log(error)
        // some other error happened
      }
    }
  }

  function resetError() {
    setErrorText('');
    setUsernameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);
  }

  const validateEmail = () => {
    if(!email || !email.length) return true;
    const res = email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if(!res)
        return true;
    else
        return false;
  }

  if(!hasLocationPermission) return (
    <PermissionScreen 
      permissionText="เราจำเป็นต้องเข้าถึงตำแหน่งของคุณ"
      requestPermission={requestLocationPermission}
      navigation={props.navigation}
      unbackable={true}
    />
  )

  return (
    <View style={styles.root}>
      <ScrollView >
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
          placeholder="อีเมลล์"
          onChangeText={value => setEmail(value)}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={resetError}
          error={emailError}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          placeholder="รหัสผ่าน"
          onChangeText={value => setPassword(value)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          onFocus={resetError}
          error={passwordError}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          placeholder="ยืนยันรหัสผ่าน"
          onChangeText={value => setConfirmPassword(value)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          onFocus={resetError}
          error={confirmPasswordError}
          style={styles.input}
        />
      </View>
      {
        (usernameError || emailError || passwordError || confirmPasswordError) &&
        <Text style={[materialTall.subheading, styles.errorText]}>{errorText}</Text>
      }
      <Button
        mode="contained"
        style={styles.loginButton}
        full
        loading={loading}
        onPress={handleSubmit}
      >
        <Text>สมัครสมาชิก</Text>
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
        สมัครด้วย facebook
      </Button> */}
      <Button
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
        สมัครด้วย google
      </Button>
      <View style={[styles.registerContainer, { 
        marginTop: (usernameError || emailError || passwordError || confirmPasswordError) ?
        30 : 60
        }]}>
        <Text style={styles.text}>
          มีบัญชีอยู่แล้ว?
           </Text>
        <TouchableWithoutFeedback onPress={() => props.navigation.navigate('Login')}>
          <Text style={[styles.text, styles.buttonText]}>
            ลงชื่อเข้าใช้
           </Text>
        </TouchableWithoutFeedback>
      </View>
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

export default Register;
