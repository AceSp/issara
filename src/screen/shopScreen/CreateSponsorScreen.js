
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity
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


import GET_ADDRESS_QUERY from '../../graphql/queries/getAddress';
import CREATE_SPONSOR_MUTATION from '../../graphql/mutations/createSponsor';
import GET_SHOP_ADS_QUERY from '../../graphql/queries/getShopAds';
import { colors } from '../../utils/constants';
import AddressList from '../ProfileScreen/Component/AddressList';
import Sponsor from '../../component/FeedCard/Sponsor';
import FullSponsor from '../../component/FeedCard/FullSponsor';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const CreateSponsorScreen = (props) => {

    const { 
        shopParam,
        productParam,
        tambonParam,
        amphoeParam,
        changwatParam,
        regionParam,
        phraseParam,
        descriptionParam,
        isProduct,
        shopIdParam
      } = props.route.params;

    const [ target, setTarget ] = useState(1);
    const [ tambon, setTambon ] = useState('');
    const [ amphoe, setAmphoe ] = useState('');
    const [ changwat, setChangwat ] = useState('');
    const [ region, setRegion ] = useState('');
    const [ phrase, setPhrase ] = useState('');
    const [ text, setText ] = useState('');
    const [ budget, setBudget ] = useState(500);

    const [ tambonVisible, setDisVis ] = useState(false);
    const [ amphoeVisible, setAmVis ] = useState(false);
    const [ changwatVisible, setProVis ] = useState(false);
    const [ regionVisible, setRegionVis ] = useState(false);

    const [
        getAddress, 
        {
          data: address_data, 
          loading: address_loading, 
          error: address_error
        }
      ] = useLazyQuery(GET_ADDRESS_QUERY);

    const [createSponsor, {data, loading, error}] = useMutation(CREATE_SPONSOR_MUTATION,
    {
      onCompleted: (data) => props.navigation.navigate('ManageAd'),
    }
    );
      
    useEffect(() => {
        if(tambonParam) setTambon(tambonParam);
        if(amphoeParam) setAmphoe(amphoeParam);
        if(changwatParam) setChangwat(changwatParam);
        if(regionParam) setRegion(regionParam);
        if(phraseParam) setPhrase(phraseParam);
        if(descriptionParam) setText(descriptionParam);
    },[])
    
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
    //     return Number(amount)
    //       .toFixed(2)
    //       .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    // };

    const submit = () => {
        createSponsor({
            variables: {
                text,
                phrase,
                product: {
                    id: productParam.id,
                    itemName: productParam.itemName,
                    avatar: productParam.pictures
                },
                budget,
                tambon: target === 1? tambon : null,
                amphoe: target === 2? amphoe : null,
                changwat: target === 3? changwat : null,
                region: target === 4? region: null,
                all: target === 5? true : null
            },
            optimisticResponse: {
                __typename: 'Mutation',
                createSponsor: {
                    __typename: 'Ad',
                    pk: Math.round(Math.random()* -1000000).toString(),
                    id: Math.round(Math.random()* -1000000).toString(),
                    isPromote: false,
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
                        ...shopParam
                    },
                    product: null
                }
            },
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
                <Text style={materialTall.headline}>กำหนดรูปแบบการแสดง</Text>
                <Text style={materialTall.title}>แบบย่อ</Text>
                <View style={styles.preview}>
                    <Sponsor product={productParam} shop={shopParam} text={phrase} />
                </View>
                <TextInput 
                    mode="outlined"
                    label="คำเชิญชวน"
                    value={phrase}
                    maxLength={40}
                    onChangeText={(value) => setPhrase(value)}
                />
                <Text style={[materialTall.caption, styles.textInputCoun]}>{phrase.length}/40</Text>
                {/* <Text style={materialTall.title}>แบบเต็ม</Text>
                <View style={styles.preview}>
                    <FullSponsor shop={{name: nameParam}} text={text} />
                </View>
                <TextInput 
                    mode="outlined"
                    label="คำบรรยาย"
                    multiline
                    value={text}
                    maxLength={300}
                    onChangeText={(value) => setText(value)}
                />
                <Text style={[materialTall.caption, styles.textInputCoun]}>{text.length}/300</Text> */}
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
            onPress={() => submit()}  
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
  preview: {
      borderWidth: 1,
      borderRadius: 2
  }
})

export default CreateSponsorScreen;