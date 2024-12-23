import React, { 
    useState, 
    memo 
} from 'react';
import { 
    StyleSheet, 
    View, 
    Alert,
    TouchableWithoutFeedback,
} from 'react-native';
import { 
    Button, 
    Icon, 
    Input 
} from 'react-native-elements';
import { useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import { colors } from '../../utils/constants';
import Coin_POST_MUTATION from '../../graphql/mutations/coinPost';
import formatNumber from '../../utils/formatNumber';

function Coin(props) {
    const [ coinPost, { data } ] = useMutation(Coin_POST_MUTATION);
    const [ userHaveCoinState, setUserHaveCoinState ] = useState(props.userHaveCoin);
    const [ number, setNumber ] = useState('ระบุ\nจำนวน');
    const input = React.createRef();

    function submit() {
        if(parseInt(number) > 0) {
            coinPost({
                variables: { postId: props.id, giveCoinCount: parseInt(number) },
            });
            props.setCoinVisible(false);
            props.setCoinCountState(number)
        }   

        return
    }

    function changeText(value) {
        value = value.replace(/\D/g,'');
        if(value <= props.userHaveCoin) {
            setNumber(value);
            setUserHaveCoinState(props.userHaveCoin - value);
        } 
    }

    function addOne() {
        if(userHaveCoinState != 0) {
            if(number === 'ระบุ\nจำนวน' || number === '') {
                setNumber('1');
            } else {
                const n = (parseInt(number) + 1).toString();
                setNumber(n);
            }
            setUserHaveCoinState(userHaveCoinState - 1);
        }
    }

    if(props.userHaveCoin === 0) {
        props.setCoinVisible();
        Alert.alert(
            'คุณยังไม่มีดาว',
            'ดาวดวงละ 20 สตางค์ ต้องการซื้อหรือไม่',
            [
              {text: 'ซื้อเลย', onPress: () => props.navigation.navigate('BuyCoin')},
              {text: 'เอาไว้ก่อน', onPress: () => {}, style: 'cancel'},
              
            ]
          )
    }

    return (
        <View style={styles.Root}>
            <View style={styles.test}  >
                <Button title= "ตกลง"
                  buttonStyle={(parseInt(number) > 0)? 
                    styles.buttonStyle : 
                    styles.buttonDisabledStyle } 
                  titleStyle={{fontSize: 25}}
                  onPress={submit}
                />
            </View>         
               
               <View style={[styles.shapeLeft, styles.shape]}  ></View>
               <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center',}}  >
                   <Input 
                   ref={input}
                   keyboardType='number-pad'
                   textAlign="center"
                   onChangeText={changeText}
                   value={number}
                   clearTextOnFocus={true}
                   onFocus= {() => {
                       setNumber('');
                       setUserHaveCoinState(props.userHaveCoin);
                    }}
                   defaultValue={"ระบุจำนวน"}
                   multiline={true}
                   inputContainerStyle={{  
                    height: 80,
                    width: 75,
                    zIndex: 11,
                    }}
                    containerStyle={{paddingHorizontal:0, alignItems: 'center'}}
                    inputStyle={{
                        fontSize: number === 'ระบุ\nจำนวน' || number >= 10000 ? 14: 25,
                        paddingVertical: 0,
                        fontWeight: "bold", 
                        }}
                    TouchableComponent={<TouchableWithoutFeedback />}
                   />
               </View>
               <View style={[styles.shapeMiddle, styles.shape,{backgroundColor: colors.LIGHT_RED}]}  ></View>
               <View style={{flex: 1, backgroundColor: colors.LIGHT_RED, justifyContent: 'center',}} >
                   <Button title={formatNumber(userHaveCoinState).toString()}
                  onPress={null}
                  buttonStyle={[styles.buttonStyle, {backgroundColor: colors.LIGHT_RED}]} 
                  titleStyle={{fontSize: 25, color: 'black', fontWeight: 'bold'}} 
                  />
               </View>
               <View style={[styles.shapeRight, styles.shape,{backgroundColor: colors.BUTTON_RED}]}  ></View>
               <View style={styles.test}  >
                 <Button 
                   title=''
                   onPress={addOne}
                   onLongPress={() => input.current.focus()}
                   buttonStyle={styles.buttonStyle}
                   titleStyle={{fontSize: 25}} 
                   icon={
                        <Icon 
                        name="alpha-v" 
                        type="material-community" 
                        iconStyle={{ backgroundColor: iOSColors.yellow, borderRadius: 50}}
                        containerStyle={{ padding: 3, margin: 0, backgroundColor: 'yellow', borderRadius: 50, borderWidth: 0.5, borderColor: iOSColors.lightGray2 }}
                        color={'red'} 
                        size={30} 
                        />
                   }
                  />
               </View> 
        </View>
    )
}

export default memo(Coin);

const styles = StyleSheet.create({
    Root:{
        flex:1,
        flexDirection: "row",
        borderColor: colors.BUTTON_RED,
        borderWidth: 2,
    },
    countInput: {
        backgroundColor: colors.WHITE, 
        height: 57,
        width: 200,
        zIndex: 11,
        textAlign: 'center',
    },
    test: {
        flex: 1,
        backgroundColor: colors.BUTTON_RED
    },
    shape: {
        width: 10,
        height: 10,
        backgroundColor: 'white',
        position: 'absolute',
        top: 25,
        transform: [{ rotate: '45deg'}],
        zIndex: 5
    },
    shapeLeft: {
        left: 81,
    },
    shapeMiddle: { 
        left: 168,
    },
    shapeRight: { 
        left: 255,
    },
    buttonStyle: {
        height: 56, 
        backgroundColor: colors.BUTTON_RED,
    },
    buttonDisabledStyle: {
        height: 56, 
        backgroundColor: '#dedede',
    }
});