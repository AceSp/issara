
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import {
  Icon,
  Avatar,
  Overlay
} from 'react-native-elements';
import {
  List, 
  Card, 
  TouchableRipple,
  RadioButton,
  TextInput,
  Button
} from 'react-native-paper';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { materialTall, iOSColors } from 'react-native-typography';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
// import BackgroundUpload from 'react-native-background-upload';

import GET_ADDRESS_QUERY from '../../graphql/queries/getAddress';
import CREATE_PROMOTE_MUTATION from '../../graphql/mutations/createPromote';
import GET_SHOP_ADS_QUERY from '../../graphql/queries/getShopAds';
import GET_SIGNED_URL_MUTATION from '../../graphql/mutations/getSignedUrls';
import { colors } from '../../utils/constants';
import AddressList from '../ProfileScreen/Component/AddressList';
import FeedCard from '../../component/FeedCard/FeedCard';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CreatePromoteScreen = (props) => {

    const { 
        shopParam,
        productParam,
        tambonParam,
        amphoeParam,
        changwatParam,
        regionParam,
        descriptionParam,
        isProduct,
        textParam,
        mediaObjArrParam,
        mediaSrcArrParam
      } = props.route.params;

    const [ target, setTarget ] = useState(1);
    const [ tambon, setTambon ] = useState('');
    const [ amphoe, setAmphoe ] = useState('');
    const [ changwat, setChangwat ] = useState('');
    const [ region, setRegion ] = useState('');
    const [ text, setText ] = useState('');
    const [ mediaObjArr, setMediaObjArr ] = useState([]);
    const [ mediaSrcArr, setMediaSrcArr ] = useState([]);
    const [ budget, setBudget ] = useState(500);
    const [ dueDate, setDueDate ] = useState(new Date(Date.now() + (24 * 60 * 60 * 1000)));

    const [ tambonVisible, setDisVis ] = useState(false);
    const [ amphoeVisible, setAmVis ] = useState(false);
    const [ changwatVisible, setProVis ] = useState(false);
    const [ regionVisible, setRegionVis ] = useState(false);
    const [ datePickerVisible, setDatePickerVisible ] = useState(false);
    
    const [
        getAddress, 
        {
          data: address_data, 
          loading: address_loading, 
          error: address_error
        }
      ] = useLazyQuery(GET_ADDRESS_QUERY);
    const [getSignedUrl, { data: data_url }] = useMutation(GET_SIGNED_URL_MUTATION);

    const [createPromote, {data, loading, error}] = useMutation(CREATE_PROMOTE_MUTATION,
    {
      onCompleted: (data) => {
        if(isProduct) props.navigation.navigate('ManageAd');
        else props.navigation.navigate('ManageShop', { shopId: shopParam.id });
    }
    }
    );
      
    useEffect(() => {
        if(tambonParam) setTambon(tambonParam);
        if(amphoeParam) setAmphoe(amphoeParam);
        if(changwatParam) setChangwat(changwatParam);
        if(regionParam) setRegion(regionParam);
        if(textParam) setText(textParam);
        if(mediaObjArrParam) setMediaObjArr(mediaObjArrParam);
        if(mediaSrcArrParam) setMediaSrcArr(mediaSrcArrParam);
    },[
        tambonParam,
        amphoeParam,
        changwatParam,
        regionParam,
        textParam,
        mediaObjArrParam,
        mediaSrcArrParam
    ])
    
    const getTambon = (value) => {
        getAddress({ variables: { findOne: true, tambon: value } });
    }

    const getAmphoe = (value) => {
        getAddress({ variables: { findOne: true, amphoe: value } });
    }

    const getChangwat = (value) => {
        getAddress({ variables: { findOne: true, changwat: value } });
    }

    const getRegion = (value) => {
        getAddress({ variables: { findOne: true, region: value } });
    }

    // const currencyFormat = amount => {
    //     const test = parseFloat(text);
    //       console.log(test)
    //       console.log(typeof(test))
    //     return test;
    // };

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (date) => {
        hideDatePicker();
        setDueDate(date);
    };

    function handleUploadFile() {
        Keyboard.dismiss();

        if(!mediaObjArr?.length) return submit();

        getSignedUrl({
            variables: {
                arg: mediaObjArr
            }
        }).then(
            res => {
                uploadFile(res)
            },
            err => console.log(err)
        );
    }

    async function uploadFile(res) {
        try {
            let body = text;
            const uploadIdArr = [];
            const mediaName = [];
            for (let [index, item] of res.data.getSignedUrls.entries()) {
                console.log(mediaObjArr[index].fileUri)
                const options = {
                    url: item,
                    path: mediaObjArr[index].fileUri,
                    method: 'PUT',
                    headers: {
                        'content-type': mediaObjArr[index].fileType, // Customize content-type
                    },
                    // Below are options only supported on Android
                    notification: {
                        enabled: true
                    },
                    useUtf8Charset: true
                }

                // const uploadId = await BackgroundUpload.startUpload(options)

                uploadIdArr.push(uploadId)
                const fileUrlArr = item.split('?');
                const fileUrl = fileUrlArr[0];
                mediaName.push(mediaObjArr[index].fileName);
                body = text
                    .replace(
                        mediaSrcArr[index],
                        fileUrl
                        // item.url + '/' + fields.key
                    )
            }

        if(isProduct) props.navigation.navigate('ManageAd', {
            // textParam: body,
            // uploadIdArr,
            // mediaName,
            // idParam: shopParam.id,
            // budget,
            // target,
            // tambon,
            // amphoe,
            // changwat,
            // region,
        });
        else props.navigation.navigate('ManageShop', { 
            shopParam,
            textParam: body,
            uploadIdArr,
            mediaName,
            budget,
            target,
            tambon,
            amphoe,
            changwat,
            region,
        });

        } catch (error) {
            console.log(error);
            console.log('at postheader => uploadFile');
        }

    }

    const submit = () => {
        createPromote({
            variables: {
                text,
                shop: shopParam,
                product: productParam,
                budget,
                tambon: target === 1? tambon : null,
                amphoe: target === 2? amphoe : null,
                changwat: target === 3? changwat : null,
                region: target === 4? region: null,
                all: target === 5? true : null
            },
            optimisticResponse: {
                __typename: 'Mutation',
                createPromote: {
                    __typename: 'Ad',
                    pk: Math.round(Math.random()* -1000000).toString(),
                    id: Math.round(Math.random()* -1000000).toString(),
                    isPromote: true,
                    text: text,
                    image: null,
                    video: null,
                    impression: 0,
                    budget: budget,
                    startBudget: budget,
                    minuteBudget: null,
                    status: 'online',
                    tambon: target === 1? tambon : null,
                    amphoe: target === 2? amphoe : null,
                    changwat: target === 3? changwat : null,
                    region: target === 4? region: null,
                    all: target === 5? true : null,
                    shop: {
                        __typename: 'Shop',
                        ...shopParam,
                    },
                    product: null
                }
            },
            refetchQueries: [{
                query: GET_SHOP_ADS_QUERY,
                variables: isProduct? {} : { shopId: shopParam.id }
            }]
        })
    }

  return (
      <ScrollView>
        <View style={styles.Root}>
            <Card style={styles.card}>
                <Text style={materialTall.headline}>เลือกขอบเขต</Text>
                <Text style={materialTall.body1}>
                    การเลือกขอบเขตที่กว้างเกินไป อาจทำให้ท่านเสียค่าโฆษณาเกินความจำเป็น
                    กรุณาเลือกขอบเขตให้เหมาะสม
                    </Text>
                <RadioButton.Group
                    onValueChange={value => setTarget(value)}
                    value={target}
                >
                    <View style={styles.radioView}>
                        <RadioButton color={iOSColors.orange} value={1} />
                        <Text 
                            style={
                            target === 1?
                            materialTall.title
                            :
                            [materialTall.title, styles.grayText]
                            }
                            >
                                ตำบล
                        </Text>
                        <TouchableRipple 
                            style={[
                            styles.rightInputButton, 
                            styles.addressButton
                            ]} 
                            onPress={() => setDisVis(true)} 
                            underlayColor={colors.LIGHT_GRAY}
                            >
                            <Text 
                                style={
                                    target === 1?
                                    [materialTall.headline, styles.blackText]
                                    :
                                    [materialTall.headline, styles.grayText]
                                }
                                >    
                                {tambon} 
                            </Text>
                        </TouchableRipple>
                    </View>
                    <View style={styles.radioView}>
                        <RadioButton color={iOSColors.orange} value={2} />
                        <Text 
                            style={
                            target === 2?
                            materialTall.title
                            :
                            [materialTall.title, styles.grayText]
                            }>
                                อำเภอ
                        </Text>
                        <TouchableRipple 
                            style={[
                            styles.rightInputButton, 
                            styles.addressButton
                            ]} 
                            onPress={() => setAmVis(true)} 
                            underlayColor={colors.LIGHT_GRAY}
                            >
                            <Text 
                                style={
                                    target === 2?
                                    [materialTall.headline, styles.blackText]
                                    :
                                    [materialTall.headline, styles.grayText]
                                }
                                >    
                                {amphoe} 
                            </Text>
                        </TouchableRipple>
                    </View>
                    <View style={styles.radioView}>
                        <RadioButton color={iOSColors.orange} value={3} />
                        <Text 
                            style={
                            target === 3?
                            materialTall.title
                            :
                            [materialTall.title, styles.grayText]
                            }
                            >
                                จังหวัด
                        </Text>
                        <TouchableRipple 
                            style={[
                            styles.rightInputButton, 
                            styles.addressButton
                            ]} 
                            onPress={() => setProVis(true)} 
                            underlayColor={colors.LIGHT_GRAY}
                            >
                            <Text 
                                style={
                                    target === 3?
                                    [materialTall.headline, styles.blackText]
                                    :
                                    [materialTall.headline, styles.grayText]
                                }
                                >    
                                {changwat} 
                            </Text>
                        </TouchableRipple>
                    </View>
                    <View style={styles.radioView}>
                        <RadioButton color={iOSColors.orange} value={4} />
                        <Text 
                            style={
                            target === 4?
                            materialTall.title
                            :
                            [materialTall.title, styles.grayText]
                            }
                            >
                                ภูมิภาค
                        </Text>
                        <TouchableRipple 
                            style={[
                            styles.rightInputButton, 
                            styles.addressButton
                            ]} 
                            onPress={() => setRegionVis(true)} 
                            underlayColor={colors.LIGHT_GRAY}
                            >
                            <Text 
                                style={
                                    target === 4?
                                    [materialTall.headline, styles.blackText]
                                    :
                                    [materialTall.headline, styles.grayText]
                                }>    
                                {region} 
                            </Text>
                        </TouchableRipple>
                    </View>
                    <View style={styles.rowView}>
                        <RadioButton color={iOSColors.orange} value={5} />
                        <Text style={
                            target === 5?
                            materialTall.title
                            :
                            [materialTall.title, styles.grayText]
                            }
                            >  
                            ทั่วประเทศ
                        </Text>
                    </View>
                </RadioButton.Group>
            </Card>
            <Card style={styles.card}>
                <Text style={materialTall.headline}>กำหนดงบ</Text>
                <TextInput 
                    mode="outlined"
                    label="งบทั้งหมด"
                    value={budget.toString()}
                    onChangeText={(value) => setBudget(value)}
                    onBlur={() => {
                        setBudget(parseFloat(budget))
                    }}
                    keyboardType={'numeric'}
                />
                <TouchableRipple onPress={() => showDatePicker()}>
                        <TextInput 
                            mode="outlined"
                            label="แสดงถึงวันที่"
                            value={dueDate.toLocaleDateString()}
                            editable={false}
                        />
                </TouchableRipple>
                <DateTimePickerModal
                    isVisible={datePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    minimumDate={new Date(Date.now() + (24 * 60 * 60 * 1000))}
                />
            </Card>
            <Card style={styles.card}>
                <View style={styles.exampleHeader}>
                    <Text style={materialTall.headline}>กำหนดรูปแบบการแสดง</Text>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate('Post', {
                            comeFrom: 'CreatePromote'
                        })}
                    >
                        <Text style={styles.buttonText}>แก้ไข</Text>
                    </TouchableOpacity>
                </View>
                <FeedCard 
                    postInfo={{
                        text,
                        shop: shopParam
                    }}
                />
            </Card>
            
            <AddressList
                visible={tambonVisible}
                setVisible={setDisVis}
                setTambon={setTambon}
                findOne={true}
                address={address_data? address_data.getAddress : null} 
                getAddress={getTambon}
              />
            <AddressList
                visible={amphoeVisible}
                setVisible={setAmVis}
                setAmphoe={setAmphoe}
                findOne={true}
                address={address_data? address_data.getAddress : null} 
                getAddress={getAmphoe}
              />
            <AddressList
                visible={changwatVisible}
                setVisible={setProVis}
                setChangwat={setChangwat}
                findOne={true}
                address={address_data? address_data.getAddress : null} 
                getAddress={getChangwat}
              />
            <AddressList
                visible={regionVisible}
                setVisible={setRegionVis}
                setRegion={setRegion}
                findOne={true}
                address={address_data? address_data.getAddress : null} 
                getAddress={getRegion}
              />
        </View>
        <Button  
            mode="contained"
            onPress={handleUploadFile}  
            loading={loading}
            labelStyle={materialTall.headlineWhite} >
            ตกลง
        </Button>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  Root: {
    alignItems: 'stretch',
    flex: 1,
    backgroundColor: iOSColors.lightGray
  },
  addressButton: {
    color: 'black',
    borderBottomWidth: 2
  },
  rightInputButton: {
    borderBottomWidth: 1,
    borderColor: iOSColors.midGray,
    width: width*0.6,
    marginVertical: 10,
    paddingRight: 10,
    alignItems: 'center'
  },
  radioView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  blackText: {
      color: 'black'
  },
  grayText: {
      color: iOSColors.gray
  },
  card: {
      marginBottom: 5,
      paddingHorizontal: 20,
      paddingVertical: 10
  },
  exampleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonText: {
    fontSize: 18,
    color: iOSColors.orange
  },
  preview: {
      borderWidth: 1,
      borderRadius: 2
  }
})

export default CreatePromoteScreen;