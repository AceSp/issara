import React, { useEffect, useState, useRef, memo, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight,
  TextInput
} from 'react-native';
import {
    Avatar,
    Icon,
    Input,
    Button,
    Overlay
} from 'react-native-elements';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import SwitchSelector from 'react-native-switch-selector';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';

import GET_ADDRESS_QUERY from '../../graphql/queries/getAddress';
import AddressList from '../ProfileScreen/Component/AddressList';
import Type from './Component/Type';
import { 
  colors, 
  fuelList, 
  gearList, 
  colorList,
  memoryList,
  truckList,
  jobList,
  paymentList 
} from '../../utils/constants';
import Category from './Component/Category';
import Brand from './Component/Brand';
import Model from './Component/Model';
import List from './Component/List';
import ProductArea from './Component/ProductArea';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProductOptionScreen = (props) => {

  const { 
    cateParam,
    typeParam,
    TambonParam,
    amphoeParam,
    changwatParam,
  } = props.route.params;

  const [ category, setCategory ] = useState('');
  const [ type, setType ] = useState('');
  const [ brand, setBrand ] = useState('');
  const [ model, setModel ] = useState('');
  const [ fuel, setFuel ] = useState('');
  const [ gear, setGear ] = useState('');
  const [ color, setColor ] = useState('');
  const [ memory, setMemory ] = useState(0);
  const [ truckType, setTruckType ] = useState('');
  const [ jobType, setJobType ] = useState('');
  const [ payment, setPayment ] = useState('');
  const [ minMiles, setMinMiles ] = useState(null);
  const [ maxMiles, setMaxMiles ] = useState(null);
  const [ minYear, setMinYear ] = useState(null);
  const [ maxYear, setMaxYear ] = useState(null);
  const [ bedroom, setBedroom ] = useState(0);
  const [ bathroom, setBathroom ] = useState(0);
  const [ tambon, setTambon ] = useState('');
  const [ amphoe, setAmphoe ] = useState('');
  const [ changwat, setChangwat ] = useState('');
  const [ minPrice, setMinPrice ] = useState(null);
  const [ maxPrice, setMaxPrice ] = useState(null);
  const [ secondHand, setSecondHand ] = useState(null);
  
  const [ categoryVisible, setCateVis ] = useState(false);
  const [ typeVisible, setTypeVis ] = useState(false);
  const [ brandVisible, setBrandVis ] = useState(false);
  const [ modelVisible, setModelVis ] = useState(false);
  const [ fuelVisible, setFuelVis ] = useState(false);
  const [ gearVisible, setGearVis ] = useState(false);
  const [ colorVisible, setColorVis ] = useState(false);
  const [ memoryVisible, setMemoryVis ] = useState(false);
  const [ truckVisible, setTruckVis ] = useState(false);
  const [ jobVisible, setJobVis ] = useState(false);
  const [ paymentVisible, setPaymentVis ] = useState(false);
  const [ areaVisible, setAreaVis ] = useState(false);

  useEffect(() => {
    setCategory(cateParam);
    setType(typeParam);
    setTambon(TambonParam);
    setAmphoe(amphoeParam);
    setChangwat(changwatParam);
  },[])

  useEffect(() => {
    setBrand('');
    setModel('');
    setFuel('');
    setGear('');
    setColor('');
    setMemory(0);
    setTruckType('');
    setJobType('');
    setPayment('');
    setBedroom(0);
    setBathroom(0);
    setMinMiles(null);
    setMaxMiles(null);
    setMinYear(null);
    setMaxYear(null);
  },[type])

  const changeText = (value) => {
    const str = value.replace(/\D/g,'');
    return parseInt(str)
  }

  const renderAreaText = () => {
    if(tambon !== '') return <Text style={[materialTall.headline, { color: iOSColors.orange }]}>{tambon}</Text>;
    else if(amphoe !== '') return <Text style={[materialTall.headline, { color: iOSColors.orange }]}>{amphoe}</Text>;
    else if(changwat !== '') return <Text style={[materialTall.headline, { color: iOSColors.orange }]}>{changwat}</Text>;
    else return <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกจังหวัด</Text>
  }

  const submit = () => {
    // paramSet.setCategory(category);
    // paramSet.setType(type);
    // paramSet.setBrand(brand);
    // paramSet.setModel(model);
    // paramSet.setFuel(fuel);
    // paramSet.setGear(gear);
    // paramSet.setColor(color);
    // paramSet.setMemory(memory);
    // paramSet.setTruckType(truckType);
    // paramSet.setJobType(jobType);
    // paramSet.setPayment(payment);
    // paramSet.setMinMiles(minMiles);
    // paramSet.setMaxMiles(maxMiles);
    // paramSet.setMinYear(minYear);
    // paramSet.setMaxYear(maxYear);
    // paramSet.setBedroom(bedroom);
    // paramSet.setBathroom(bathroom);
    // paramSet.setTambon(tambon);
    // paramSet.setAmphoe(amphoe);
    // paramSet.setChangwat(changwat);
    // paramSet.setMinPrice(minPrice);
    // paramSet.setMaxPrice(maxPrice);
    // paramSet.setSecondHand(secondHand);
    props.navigation.navigate('ProductFeed', {
      cateParam: category, 
      typeParam: type,
      brandParam: brand,
      modelParam: model,
      fuelParam: fuel,
      gearParam: gear,
      colorParam: color,
      memoryParam: memory,
      truckTypeParam: truckType,
      jobTypeParam: jobType,
      paymentParam: payment,
      minMilesParam: minMiles,
      maxMilesParam: maxMiles,
      minYearParam: minYear,
      maxYearParam: maxYear,
      bedroomParam: bedroom,
      bathroomParam: bathroom,
      minPriceParam: minPrice,
      maxPriceParam: maxPrice,
      secondHandParam: secondHand,
      TambonParam: tambon,
      amphoeParam: amphoe,
      changwatParam: changwat,
    });
  };

  console.log("----------ProductOptionScreen")
  console.log(categoryVisible)

  return (
    <View style={styles.Root}>
          <ScrollView keyboardShouldPersistTaps="handled" >
              <KeyboardAvoidingView style={styles.viewInScroll}>
                    <Text style={[materialTall.title, { marginTop: 20, color: iOSColors.orange }]}>หมวดหมู่</Text>
                    <View style={styles.rowView}>
                      <Text style={materialTall.title}>หมวดหมู่</Text>
                      <TouchableHighlight style={styles.addressButton} onPress={() => setCateVis(true)} underlayColor={materialColors.blackTertiary}>
                      {category == ''? 
                            <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทั้งหมด</Text> 
                            : 
                            <Text style={[materialTall.headline, { color: iOSColors.orange }]}>{category}</Text>} 
                      </TouchableHighlight>
                    </View>
                    <Category
                        visible={categoryVisible}
                        setVisible={setCateVis}
                        setCategory={setCategory}
                        setType={setType}
                    />
                    <Text style={[materialTall.title, { marginTop: 20, color: iOSColors.orange }]}>รายละเอียดเพิ่มเติม</Text>
                    <View style={styles.rowView}>
                      <Text style={materialTall.title}>ประเภท</Text>
                      <TouchableHighlight style={styles.addressButton} onPress={() => setTypeVis(true)} underlayColor={materialColors.blackTertiary}>
                      {type == ''? 
                            <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกประเภท</Text> 
                            : 
                            <Text style={[materialTall.headline, { color: iOSColors.orange }]}>{type}</Text>} 
                      </TouchableHighlight>
                    </View>
                    <Type
                        category={category}
                        visible={typeVisible}
                        setVisible={setTypeVis}
                        setType={setType}
                    />
                    {category === 'รถยนต์' || type === 'มอเตอร์ไซค์' 
                    || type === 'กล้องดิจิตอล' || type === 'โทรศัพท์มือถือ' 
                    || type === 'แท็บเล็ต' || type === 'รถบรรทุก' ?
                      <View>
                        <View style={styles.rowView}>
                          <Text style={materialTall.title}>ยี่ห้อ</Text>
                          <TouchableHighlight style={styles.addressButton} onPress={() => setBrandVis(true)} underlayColor={materialColors.blackTertiary}>
                          {brand == ''? 
                                <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกยี่ห้อ</Text> 
                                : 
                                <Text style={[materialTall.headline, { color: iOSColors.orange }]}>{brand}</Text>} 
                          </TouchableHighlight>
                        </View>
                        <Brand
                            category={category}
                            type={type}
                            visible={brandVisible}
                            setVisible={setBrandVis}
                            setBrand={setBrand}
                        />
                        </View>
                      : null
                    }

                    {(category === 'รถยนต์' || type === 'มอเตอร์ไซค์') && brand !== ''?
                    <View>
                      <View style={styles.rowView}>
                        <Text style={materialTall.title}>รุ่น</Text>
                        <TouchableHighlight style={styles.addressButton} onPress={() => setModelVis(true)} underlayColor={materialColors.blackTertiary}>
                        {model == ''? 
                              <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกรุ่น</Text> 
                              : 
                              <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{model}</Text>} 
                        </TouchableHighlight>
                      </View>
                      <Model
                          category={category}
                          brand={brand}
                          visible={modelVisible}
                          setVisible={setModelVis}
                          setModel={setModel}
                      />
                    </View>
                    : null }
                    
                    {category === 'รถยนต์'? 
                    <View>
                      <View style={styles.rowView}>
                      <Text style={materialTall.title}>เชื้อเพลิง</Text>
                      <TouchableHighlight style={styles.addressButton} onPress={() => setFuelVis(true)} underlayColor={materialColors.blackTertiary}>
                      {fuel == ''? 
                            <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกเชื้อเพลิง</Text> 
                            : 
                            <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{fuel}</Text>} 
                      </TouchableHighlight>
                      </View>
                      <List
                          listName="เชื้อเพลิง"
                          list={fuelList}
                          visible={fuelVisible}
                          setVisible={setFuelVis}
                          setValue={setFuel}
                      />
                      <View style={styles.rowView}>
                        <Text style={materialTall.title}>เกียร์</Text>
                        <TouchableHighlight style={styles.addressButton} onPress={() => setGearVis(true)} underlayColor={materialColors.blackTertiary}>
                        {gear == ''? 
                              <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกเกียร์</Text> 
                              : 
                              <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{gear}</Text>} 
                        </TouchableHighlight>
                      </View>
                      <List
                          listName="เกียร์"
                          list={gearList}
                          visible={gearVisible}
                          setVisible={setGearVis}
                          setValue={setGear}
                      />
                      <View style={styles.rowView}>
                        <Text style={materialTall.title}>สี</Text>
                        <TouchableHighlight style={styles.addressButton} onPress={() => setColorVis(true)} underlayColor={materialColors.blackTertiary}>
                        {color == ''? 
                              <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกสี</Text> 
                              : 
                              <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{color}</Text>} 
                        </TouchableHighlight>
                      </View>
                      <List
                          listName="สี"
                          list={colorList}
                          visible={colorVisible}
                          setVisible={setColorVis}
                          setValue={setColor}
                      />
                  </View>
                  : null }

                  {type === 'โทรศัพท์มือถือ'? 
                  <View>
                    <View style={styles.rowView}>
                        <Text style={materialTall.title}>ความจุ</Text>
                        <TouchableHighlight style={styles.addressButton} onPress={() => setMemoryVis(true)} underlayColor={materialColors.blackTertiary}>
                        {memory == 0? 
                              <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทั้งหมด</Text> 
                              : 
                              <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{memory}</Text>} 
                        </TouchableHighlight>
                      </View>
                      <List
                          listName="ความจุ"
                          list={memoryList}
                          visible={memoryVisible}
                          setVisible={setMemoryVis}
                          setValue={setMemory}
                      />
                  </View>
                  : null }

                  {type === 'รถบรรทุก'? 
                  <View>
                    <View style={styles.rowView}>
                        <Text style={materialTall.title}>ประเภทรถบรรทุก</Text>
                        <TouchableHighlight style={styles.addressButton} onPress={() => setTruckVis(true)} underlayColor={materialColors.blackTertiary}>
                        {truckType == ''? 
                              <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทั้งหมด</Text> 
                              : 
                              <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{truckType}</Text>} 
                        </TouchableHighlight>
                      </View>
                      <List
                          listName="ประเภทรถบรรทุก"
                          list={truckList}
                          visible={truckVisible}
                          setVisible={setTruckVis}
                          setValue={setTruckType}
                      />
                  </View>
                  : null }
                  
                  {type === 'บ้าน' || type === 'ทาวน์เฮ้าส์' || type === 'คอนโดมิเนียม' || type === 'หอพัก อพาร์ทเม้นท์'?
                  <View>
                    <View style={styles.rowView}>
                      <Text style={materialTall.title}>ห้องนอน</Text>
                      <TextInput 
                        style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                        textAlign="right" 
                        keyboardType="number-pad"
                        placeholder="ทั้งหมด"
                        value={bedroom.toString()}
                        onChangeText={value => setBedroom(changeText(value))}
                      />
                    </View>
                    <View style={styles.rowView}>
                      <Text style={materialTall.title}>ห้องน้ำ</Text>
                      <TextInput 
                        style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                        textAlign="right"
                        keyboardType="number-pad"
                        placeholder="ทั้งหมด"
                        value={bathroom}
                        onChangeText={value => setBathroom(changeText(value))} 
                      />
                    </View>
                  </View> 
                  : null }

                  {category === 'หางาน'?
                  <View>
                    <View style={styles.rowView}>
                        <Text style={materialTall.title}>ประเภทงาน</Text>
                        <TouchableHighlight style={styles.addressButton} onPress={() => setJobVis(true)} underlayColor={materialColors.blackTertiary}>
                        {jobType == ''? 
                              <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกประเภท</Text> 
                              : 
                              <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{jobType}</Text>} 
                        </TouchableHighlight>
                      </View>
                      <List
                          listName="ประเภทงาน"
                          list={jobList}
                          visible={jobVisible}
                          setVisible={setJobVis}
                          setValue={setJobType}
                      />
                    <View style={styles.rowView}>
                        <Text style={materialTall.title}>ประเภทค่าจ้าง</Text>
                        <TouchableHighlight style={styles.addressButton} onPress={() => setPaymentVis(true)} underlayColor={materialColors.blackTertiary}>
                        {payment == ''? 
                              <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>ทุกประเภท</Text> 
                              : 
                              <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{payment}</Text>} 
                        </TouchableHighlight>
                      </View>
                      <List
                          listName="ประเภทค่าจ้าง"
                          list={paymentList}
                          visible={paymentVisible}
                          setVisible={setPaymentVis}
                          setValue={setPayment}
                      />
                  </View> 
                  : null }
                    
                    {category === 'รถยนต์'? 
                    <View>
                      <Text style={[materialTall.title, { marginTop: 20, color: colors.PRIMARY }]}>จำนวนเลขไมล์</Text>
                      <View style={styles.rowView}>
                        <Text style={materialTall.title}>เลขไมล์ต่ำสุด</Text>
                        <TextInput 
                          style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                          textAlign="right" 
                          keyboardType="number-pad"
                          placeholder="ไม่ระบุ"
                          value={!minMiles? null : minMiles.toString()}
                          onChangeText={value => setMinMiles(changeText(value))}
                        />
                      </View>
                      <View style={styles.rowView}>
                        <Text style={materialTall.title}>เลขไมล์สูงสุด</Text>
                        <TextInput 
                          style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                          textAlign="right"
                          keyboardType="number-pad"
                          placeholder="ไม่ระบุ"
                          value={!maxMiles? null : maxMiles.toString()}
                          onChangeText={value => setMaxMiles(changeText(value))} 
                        />
                      </View>
                      <Text style={[materialTall.title, { marginTop: 20, color: colors.PRIMARY }]}>ช่วงปี</Text>
                      <View style={styles.rowView}>
                        <Text style={materialTall.title}>ช่วงปีต่ำสุด</Text>
                        <TextInput 
                          style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                          textAlign="right" 
                          keyboardType="number-pad"
                          placeholder="ไม่ระบุ"
                          value={!minYear? null : minYear.toString()}
                          onChangeText={value => setMinYear(changeText(value))}
                        />
                      </View>
                      <View style={styles.rowView}>
                        <Text style={materialTall.title}>ช่วงปีสูงสุด</Text>
                        <TextInput 
                          style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                          textAlign="right"
                          keyboardType="number-pad"
                          placeholder="ไม่ระบุ"
                          value={!maxYear? null : maxYear.toString()}
                          onChangeText={value => setMaxYear(changeText(value))}  
                        />
                      </View>
                    </View>
                    : null }
                    
                    <Text style={[materialTall.title, { marginTop: 20, color: colors.PRIMARY }]}>พื้นที่</Text>
                    <View style={styles.rowView}>
                      <Text style={materialTall.title}>พื้นที่</Text>
                      <TouchableHighlight style={styles.addressButton} onPress={() => setAreaVis(true)} underlayColor={materialColors.blackTertiary}>
                            <Text style={[materialTall.headline, { color: colors.PRIMARY }]}>{renderAreaText()}</Text>
                      </TouchableHighlight>
                    </View>
                    <ProductArea 
                      visible={areaVisible}
                      setVisible={setAreaVis}
                      setTambon={setTambon}
                      setAmphoe={setAmphoe}
                      setChangwat={setChangwat}
                    />
                  <Text style={[materialTall.title, { marginTop: 20, color: colors.PRIMARY }]}>กำหนดช่วงราคา</Text>
                    <View style={styles.rowView}>
                      <Text style={materialTall.title}>เริ่มต้น</Text>
                      <TextInput 
                        style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                        textAlign="right" 
                        keyboardType="number-pad"
                        placeholder="ไม่ระบุ"
                        value={!minPrice? null : minPrice.toString()}
                        onChangeText={value => setMinPrice(changeText(value))}
                      />
                    </View>
                    <View style={styles.rowView}>
                      <Text style={materialTall.title}>สูงสุด</Text>
                      <TextInput 
                        style={[styles.addressButton, materialTall.headline, { color: colors.PRIMARY }]}
                        textAlign="right"
                        keyboardType="number-pad"
                        placeholder="ไม่ระบุ"
                        value={!maxPrice? null : maxPrice.toString()}
                        onChangeText={value => setMaxPrice(changeText(value))}  
                      />
                    </View>
                  <Text style={[materialTall.title, { marginTop: 20, color: colors.PRIMARY }]}>สภาพสินค้า</Text>
                  <SwitchSelector
                      initial={1}
                      style={styles.switch}
                      buttonColor={colors.PRIMARY}
                      selectedColor="black"
                      textColor={materialColors.blackTertiary}
                      selectedTextStyle={{fontWeight: 'bold'}}
                      backgroundColor={colors.LIGHT_GREY_2}
                      hasPadding
                      options={[
                        { label: "มือสอง", value: true},
                        { label: "ทั้งหมด", value: null}, 
                        { label: "ใหม่", value: false}
                      ]}
                      initial={1}
                      onPress={(value) => setSecondHand(value)}
                  />
                  
              </KeyboardAvoidingView>
              
          </ScrollView>
            <Button onPress={() => submit()} title="ตกลง" buttonStyle={styles.button} titleStyle={materialTall.headlineWhite} />  
      </View>    
  )
}

const styles = StyleSheet.create({
    Root: {     
        flex: 1
    },
    viewInScroll: {
      paddingHorizontal: 20,
      marginBottom: 30
    },
    button: {
        backgroundColor: colors.PRIMARY
    },
    addressButton: {
      borderBottomWidth: 1,
      width: width*0.45,
      alignItems: 'flex-end',
      paddingRight: 10
    },
    rowView: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'space-between',
      marginVertical: 10
    },
    inputText: {
      fontSize: 20,
      color: materialColors.blackTertiary
    },
    switch: {
      marginVertical: 10
    }
  })

export default ProductOptionScreen;