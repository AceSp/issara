
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback
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


import GET_ADDRESS_QUERY from '../../graphql/queries/getAddress';
import UPDATE_AD_MUTATION from '../../graphql/mutations/updateAd';
import GET_ADS_QUERY from '../../graphql/queries/getMyAds';
import { colors } from '../../utils/constants';
import AddressList from '../ProfileScreen/Component/AddressList';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const UpdatePromoteScreen = (props) => {
    const { 
        promoteIdParam,
        shopIdParam,
        budgetParam,
        startBudgetParam,
        nameParam,
        tambonParam,
        amphoeParam,
        changwatParam,
        regionParam,
        descriptionParam
    } = props.route.params;

    const [ target, setTarget ] = useState(1);
    const [ tambon, setTambon ] = useState('');
    const [ amphoe, setAmphoe ] = useState('');
    const [ changwat, setChangwat ] = useState('');
    const [ region, setRegion ] = useState('');
    const [ text, setText ] = useState('');

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

    const [updateAd, {data, loading, error}] = useMutation(UPDATE_AD_MUTATION,
    {
      onCompleted: (data) => {
        props.navigation.goBack(); 
    }
    }
    );
      
    useEffect(() => {
        if(tambonParam) setTambon(tambonParam);
        if(amphoeParam) setAmphoe(amphoeParam);
        if(changwatParam) setChangwat(changwatParam);
        if(regionParam) setRegion(regionParam);
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

    const currencyFormat = amount => {
        return Number(amount)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };

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

    const submit = () => {
        updateAd({
            variables: {
                id: promoteIdParam,
                text,
                tambon: target === 1? tambon : null,
                amphoe: target === 2? amphoe : null,
                changwat: target === 3? changwat : null,
                region: target === 4? region: null,
                all: target === 5? true : null
            },
            optimisticResponse: {
                __typename: 'Mutation',
                updateAd: {
                    __typename: 'Ad',
                    id: Math.round(Math.random()* -1000000).toString(),
                    text: text,
                    image: null,
                    video: null,
                    impression: 0,
                    budget: budgetParam,
                    startBudget: budgetParam,
                    minuteBudget: null,
                    status: 'online',
                    tambon: target === 1? tambon : null,
                    amphoe: target === 2? amphoe : null,
                    changwat: target === 3? changwat : null,
                    region: target === 4? region: null,
                    all: target === 5? true : null,
                    shop: null,
                    product: null
                }
            }
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
                <TextInput 
                    mode="outlined"
                    label="คำบรรยาย"
                    multiline
                    value={text}
                    maxLength={300}
                    onChangeText={(value) => setText(value)}
                />
                <Text style={[materialTall.caption, styles.textInputCoun]}>{text.length}/300</Text>
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

export default UpdatePromoteScreen;