import React, 
{ 
  useEffect, 
  useState,
  useContext
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {
  Icon,
} from 'react-native-elements';
import {
  Menu,
  TextInput,
  TouchableRipple,
  Button,
  RadioButton
} from 'react-native-paper';
import { 
  useMutation, 
  useLazyQuery 
} from '@apollo/client';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';

import CREATE_PRODUCT_MUTATION from '../../graphql/mutations/createProduct';
import GET_ADDRESS_QUERY from '../../graphql/queries/getAddress';
import GET_SIGNED_URL_MUTATION from '../../graphql/mutations/getSignedUrls';
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
  paymentList,
  videoUrl,
  imageUrl,
  mediaUrl
} from '../../utils/constants';
import Category from './Component/Category';
import Brand from './Component/Brand';
import Model from './Component/Model';
import List from './Component/List';
import { store } from '../../utils/store';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

let yearList = [];
let current_year = new Date().getFullYear();
let years = current_year;
while (years >= 1950) {
  yearList.push(years);
  years--;
};;

const PostProductDetailScreen = (props) => {
  const { 
    imageObjArr
  } = props.route.params;

  const { state: { me } } = useContext(store);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [displayCategory, setDisplayCategory] = useState('');
  const [type, setType] = useState('');
  const [displayType, setDisplayType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [fuel, setFuel] = useState('');
  const [miles, setMiles] = useState('');
  const [gear, setGear] = useState('');
  const [color, setColor] = useState('');
  const [memory, setMemory] = useState('');
  const [truckType, setTruckType] = useState('');
  const [jobType, setJobType] = useState('');
  const [payment, setPayment] = useState('');
  const [area, setArea] = useState('');
  const [bedroom, setBedroom] = useState('');
  const [bathroom, setBathroom] = useState('');
  const [tambon, setTambon] = useState('');
  const [amphoe, setAmphoe] = useState('');
  const [changwat, setChangwat] = useState('');
  const [region, setRegion] = useState('');
  const [price, setPrice] = useState('');
  const [detail, setDetail] = useState('');
  const [secondHand, setSecondHand] = useState(null);
  const [phone, setPhone] = useState('');

  const [areaUnit, setAreaUnit] = useState('ตารางวา');

  const [categoryVisible, setCateVis] = useState(false);
  const [typeVisible, setTypeVis] = useState(false);
  const [brandVisible, setBrandVis] = useState(false);
  const [modelVisible, setModelVis] = useState(false);
  const [yearVisible, setYearVis] = useState(false);
  const [fuelVisible, setFuelVis] = useState(false);
  const [gearVisible, setGearVis] = useState(false);
  const [colorVisible, setColorVis] = useState(false);
  const [memoryVisible, setMemoryVis] = useState(false);
  const [truckVisible, setTruckVis] = useState(false);
  const [jobVisible, setJobVis] = useState(false);
  const [paymentVisible, setPaymentVis] = useState(false);
  const [tambonVisible, setTambonVis] = useState(false);
  const [amphoeVisible, setAmphoeVis] = useState(false);
  const [changwatVisible, setChangwatVis] = useState(false);

  const [areaUnitVisible, setAreaUnitVis] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);
  const [typeError, setTypeError] = useState(false);
  const [secondHandError, setSecondHandError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [tambonError, setTambonError] = useState(false);
  const [amphoeError, setAmphoeError] = useState(false);
  const [changwatError, setChangwatError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorText, setPhoneErrorText] = useState('');

  const [createProduct, { data, loading, error }] = useMutation(CREATE_PRODUCT_MUTATION);

  const [getAddress, { data: address_data, loading: address_loading, error: address_error }] = useLazyQuery(GET_ADDRESS_QUERY);

  const [getSignedUrl, { data: data_url }] = useMutation(GET_SIGNED_URL_MUTATION);

  useEffect(() => {
    setBrand('');
    setModel('');
    setCarYear('');
    setFuel('');
    setMiles('');
    setGear('');
    setColor('');
    setMemory('');
    setTruckType('');
    setJobType('');
    setPayment('');
    setBedroom('');
    setBathroom('');
  }, [type])

  const changeText = (value) => {
    const str = value.replace(/\D/g, '');
    return str;
  }

  const onPhoneNumChange = (value, previousValue) => {
    if (!value) return setPhone(value);
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 4) return setPhone(currentValue);
      if (cvLength < 7) return setPhone(`${currentValue.slice(0, 3)}-${currentValue.slice(3)}`);
      return setPhone(`${currentValue.slice(0, 3)}-${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`);
    }
  };

  const validatePhone = value => {
    if (!value || value === '') {
      setPhoneError(true);
      setPhoneErrorText('โปรดระบุหมายเลขโทรศัพท์');
      return
    }
    const firstTwo = value.slice(0, 2);
    const test = firstTwo != '06' && firstTwo != '08' && firstTwo != '09'
    if (test || value.length !== 12) {
      setPhoneError(true);
      setPhoneErrorText('หมายเลขโทรศัพท์ไม่ถูกต้อง');
      return
    }
    return setPhoneError(false);
  };

  const getTambon = (value) => {
    getAddress({ variables: { tambon: value } });
  }

  const getAmphoe = (value) => {
    getAddress({ variables: { amphoe: value } });
  }

  const getChangwat = (value) => {
    getAddress({ variables: { changwat: value } });
  }

  const validateProduct = () => {
    let haveError = false;
    if (title === '') {
      setTitleError(true);
      haveError = true;
    }
    if (category === '') {
      setCategoryError(true);
      haveError = true;
    }
    if (type === '') {
      setTypeError(true);
      haveError = true;
    }
    if (secondHand === null) {
      setSecondHandError(true);
      haveError = true;
    }
    if (price === 0) {
      setPriceError(true);
      haveError = true;
    }
    if (tambon === '') {
      setTambonError(true);
      haveError = true;
    }
    if (amphoe === '') {
      setAmphoeError(true);
      haveError = true;
    }
    if (changwat === '') {
      setChangwatError(true);
      haveError = true;
    }
    validatePhone(phone)
    if (haveError || phoneError) return true
    else return false
  }

  function handleUploadFile() {
    Keyboard.dismiss();

    if (validateProduct()) return;

    uploadFile();
  }

  async function uploadFile() {
      try {
          console.log("------POstProductDetail------------uploadFile")
          const uploadIdArr = [];
          const mediaArr = [];
          for (let item of imageObjArr) {
              const options = {
                  url: item.fileType === 'video/mp4' ? videoUrl : imageUrl,
                  path: item.fileUri.replace("file://", ""),
                  type: 'multipart',
                  method: 'POST',
                  headers: {
                      'content-type': item.fileType, // Customize content-type
                  },
                  field: item.fileType === 'video/mp4' ? 'video' : 'image',
                  // Below are options only supported on Android
                  notification: {
                      enabled: true
                  },
                  useUtf8Charset: true
              }

              // const uploadId = await BackgroundUpload.startUpload(options)

              // uploadIdArr.push(uploadId)
              //file url on the cloud
              const fileUrl = `${mediaUrl}/${me.id}/${item.fileName}`
              mediaArr.push(item.fileUri);
          }
          props.navigation.navigate('Market', {
            comeFrom: 'PostProductDetail',
            uploadIdArr,
            productVariable: {
              productName: title,
              price: parseInt(price),
              phoneNumber: phone,
              secondHand,
              detail,
              pictures: mediaArr,
              category,
              type,
              tambon,
              amphoe,
              changwat,
              region,
              miles: parseInt(miles),
              model,
              brand,
              year: parseInt(carYear),
              fuel,
              gear,
              color,
              type,
              area,
              bedroom: parseInt(bedroom.replace(/\D/g, '')),
              bathroom: parseInt(bathroom.replace(/\D/g, '')),
              memory: parseInt(memory.replace(/\D/g, '')),
              jobType,
              payment,
              category
            }
          })
      } catch (error) {
          console.log(error);
          console.log('at postheader => uploadFile');
      }
  }

  // async function uploadFile(res) {
  //   try {
  //     const imgUrlArr = [];
  //     const imgNameArr = [];
  //     const uploadIdArr = [];
  //     for (let [index, item] of res.data.getSignedUrls.entries()) {
  //       const options = {
  //         url: item,
  //         path: imageObjArr[index].fileUri.replace("file:/", ""),
  //         method: 'PUT',
  //         headers: {
  //           'content-type': imageObjArr[index].fileType, // Customize content-type
  //         },
  //         // Below are options only supported on Android
  //         notification: {
  //           enabled: true
  //         },
  //         useUtf8Charset: true
  //       }

  //       const uploadId = await BackgroundUpload.startUpload(options)

  //       uploadIdArr.push(uploadId)
  //       const fileUrlArr = item.split('?');
  //       const fileUrl = fileUrlArr[0];
  //       imgUrlArr.push(fileUrl);
  //       imgNameArr.push(imageObjArr[index].fileName);
  //     }
  //     props.navigation.navigate('Market', {
  //       comeFrom: 'PostProductDetail',
  //       uploadIdArr,
  //       productVariable: {
  //         productName: title,
  //         price: parseInt(price),
  //         phoneNumber: phone,
  //         secondHand,
  //         detail,
  //         picture: imgUrlArr,
  //         mediaName: imgNameArr.length? imgNameArr : null,
  //         category,
  //         type,
  //         tambon,
  //         amphoe,
  //         changwat,
  //         region,
  //         miles: parseInt(miles),
  //         model,
  //         brand,
  //         year: parseInt(carYear),
  //         fuel,
  //         gear,
  //         color,
  //         type,
  //         area,
  //         bedroom: parseInt(bedroom.replace(/\D/g, '')),
  //         bathroom: parseInt(bathroom.replace(/\D/g, '')),
  //         memory: parseInt(memory.replace(/\D/g, '')),
  //         jobType,
  //         payment,
  //         category
  //       }
  //     })
  //   } catch (error) {
  //     console.log(error);
  //     console.log('at postProductDetail => uploadFile');
  //   }
  // }

  const submit = (imgUrlArr) => {
    createProduct({
      variables: {
        productName: title,
        price: parseInt(price),
        phoneNumber: phone,
        secondHand,
        detail,
        picture: imgUrlArr,
        category,
        type,
        tambon,
        amphoe,
        changwat,
        region,
        miles: parseInt(miles),
        model,
        brand,
        year: parseInt(carYear),
        fuel,
        gear,
        color,
        type,
        area,
        bedroom: parseInt(bedroom.replace(/\D/g, '')),
        bathroom: parseInt(bathroom.replace(/\D/g, '')),
        memory: parseInt(memory.replace(/\D/g, '')),
        jobType,
        payment,
        category
      }
    });
    props.navigation.navigate('Market', { posted: true });
  };

  return (
    <View style={styles.Root}>
      <ScrollView keyboardShouldPersistTaps="handled" >
        <KeyboardAvoidingView style={styles.header}>
          <Text style={[materialTall.display3, styles.order]} >2</Text>
          <Text style={[materialTall.subheading, styles.directionText]}>
            {"ใส่ข้อมูลครบจบขายเร็ว เพราะจะทำให้ผู้ซื้อตัดสินใจได้ง่ายขึ้น"}
          </Text>
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <View style={styles.sectionView}>
            <TextInput
              theme={{ colors: { primary: iOSColors.orange } }}
              label="หัวข้อประกาศ"
              style={[materialTall.headline, styles.textInput]}
              value={title}
              maxLength={140}
              onFocus={() => setTitleError(false)}
              onChangeText={(value) => setTitle(value)}
              selectionColor="black"
              error={titleError}
            />
            <View style={styles.underTitle}>
              <View>
                {titleError ? <Text style={{ color: colors.ERROR }}>โปรดระบุหัวช้อประกาศ</Text> : null}
              </View>
              <Text style={[materialTall.caption, { alignSelf: 'flex-end' }]}>{title.length}/140</Text>
            </View>
            <View>

              <TouchableRipple
                style={[styles.inputButton, { borderColor: categoryError ? colors.ERROR : iOSColors.midGray }]}
                onPress={() => {
                  setCateVis(true);
                  setCategoryError(false);
                }}
              >
                <View>
                  {category == '' ? null : <Text style={styles.label}>หมวดหมู่</Text>}
                  {category == '' ?
                    <Text style={[
                      styles.placeholderText,
                      materialTall.headline,
                      {
                        color: categoryError ? colors.ERROR : materialColors.blackSecondary,
                        paddingBottom: 5
                      }]}
                    >
                      หมวดหมู่
                    </Text>
                    :
                    <Text style={[
                      materialTall.headline,
                      styles.placeholderText,
                      { color: 'black' }]}
                    >
                      {displayCategory}
                    </Text>}
                </View>

              </TouchableRipple>
              {categoryError ? <Text style={styles.errorText}>โปรดระบุหมวดหมู่</Text> : null}
            </View>
            <Category
              visible={categoryVisible}
              setVisible={setCateVis}
              setCategory={setCategory}
              setDisplayCategory={setDisplayCategory}
              setType={setType}
            />
            <View>

              <TouchableRipple
                style={[styles.inputButton, { borderColor: typeError ? colors.ERROR : iOSColors.midGray }]}
                onPress={() => {
                  setTypeVis(true);
                  setTypeError(false);
                }}
              >
                <View>
                  {type == '' ? null : <Text style={styles.label}>ประเภท</Text>}
                  {type == '' ?
                    <Text style={[
                      materialTall.headline,
                      styles.placeholderText,
                      {
                        color: typeError ? colors.ERROR : materialColors.blackSecondary,
                        paddingBottom: 5
                      }]}
                    >
                      ประเภท
                                    </Text>
                    :
                    <Text style={[
                      materialTall.headline,
                      styles.placeholderText,
                      { color: 'black' }]}
                    >
                      {displayType}
                    </Text>}
                </View>
              </TouchableRipple>
              {typeError ? <Text style={styles.errorText}>โปรดระบุประเภทสินค้า</Text> : null}
            </View>
            <Type
              posting={true}
              category={category}
              visible={typeVisible}
              setVisible={setTypeVis}
              setType={setType}
              setDisplayType={setDisplayType}
            />

            <View style={styles.rowView}>
              <Text style={materialTall.title}>สภาพสินค้า</Text>
              {secondHandError === true ? <Icon type="antdesign" name="exclamationcircle" color={colors.ERROR} /> : null}
              <RadioButton.Group
                onValueChange={value => {
                  setSecondHand(value);
                  setSecondHandError(false);
                }}
                value={secondHand}
              >
                <View style={styles.rowView}>
                  <RadioButton.Item
                    value={false}
                    status={secondHand === false ? 'checked' : 'unchecked'}
                    color={iOSColors.orange}
                  />
                  <Text>มือหนึ่ง</Text>
                </View>
                <View style={styles.rowView}>
                  <RadioButton.Item
                    value={true}
                    status={secondHand === true ? 'checked' : 'unchecked'}
                    color={iOSColors.orange}
                  />
                  <Text>มือสอง</Text>
                </View>
              </RadioButton.Group>
            </View>

            {category === 'รถยนต์' || type === 'มอเตอร์ไซค์'
              || type === 'กล้องดิจิตอล' || type === 'โทรศัพท์มือถือ'
              || type === 'แท็บเล็ต' || type === 'รถบรรทุก' ?
              <View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ยี่ห้อ</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setBrandVis(true)} underlayColor={materialColors.blackTertiary}>
                    {brand == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{brand}</Text>}
                  </TouchableRipple>
                </View>
                <Brand
                  posting={true}
                  category={category}
                  type={type}
                  visible={brandVisible}
                  setVisible={setBrandVis}
                  setBrand={setBrand}
                />
              </View>
              : null
            }

            {(category === 'รถยนต์' || type === 'มอเตอร์ไซค์') && brand !== '' ?
              <View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>รุ่น</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setModelVis(true)} underlayColor={materialColors.blackTertiary}>
                    {model == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{model}</Text>}
                  </TouchableRipple>
                </View>
                <Model
                  posting={true}
                  category={category}
                  brand={brand}
                  visible={modelVisible}
                  setVisible={setModelVis}
                  setModel={setModel}
                />
              </View>
              : null}

            {category === 'รถยนต์' ?
              <View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ปีรถ</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setYearVis(true)} underlayColor={materialColors.blackTertiary}>
                    {carYear == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{carYear}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="ปี"
                  list={yearList}
                  visible={yearVisible}
                  setVisible={setYearVis}
                  setValue={setCarYear}
                />
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>เชื้อเพลิง</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setFuelVis(true)} underlayColor={materialColors.blackTertiary}>
                    {fuel == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{fuel}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="เชื้อเพลิง"
                  list={fuelList}
                  visible={fuelVisible}
                  setVisible={setFuelVis}
                  setValue={setFuel}
                />
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>เลขไมล์</Text>
                  <View style={styles.textInputView}>
                    <TextInput style={[materialTall.headline, styles.textInput, { flex: 1 }]}
                      textAlign="center"
                      keyboardType="number-pad"
                      placeholder="ไม่ระบุ"
                      value={miles}
                      onChangeText={value => setMiles(changeText(value))}
                    />
                    <Text style={materialTall.title}>กิโลเมตร</Text>
                  </View>

                </View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>เกียร์</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setGearVis(true)} underlayColor={materialColors.blackTertiary}>
                    {gear == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{gear}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="เกียร์"
                  list={gearList}
                  visible={gearVisible}
                  setVisible={setGearVis}
                  setValue={setGear}
                />
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>สี</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setColorVis(true)} underlayColor={materialColors.blackTertiary}>
                    {color == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{color}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="สี"
                  list={colorList}
                  visible={colorVisible}
                  setVisible={setColorVis}
                  setValue={setColor}
                />
              </View>
              : null}

            {type === 'โทรศัพท์มือถือ' ?
              <View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ความจุ</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setMemoryVis(true)} underlayColor={materialColors.blackTertiary}>
                    {memory == 0 ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{memory}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="ความจุ"
                  list={memoryList}
                  visible={memoryVisible}
                  setVisible={setMemoryVis}
                  setValue={setMemory}
                />
              </View>
              : null}

            {type === 'รถบรรทุก' ?
              <View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ประเภท{"\n"}รถบรรทุก</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setTruckVis(true)} underlayColor={materialColors.blackTertiary}>
                    {truckType == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{truckType}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="ประเภทรถบรรทุก"
                  list={truckList}
                  visible={truckVisible}
                  setVisible={setTruckVis}
                  setValue={setTruckType}
                />
              </View>
              : null}

            {type === 'บ้าน' || type === 'ทาวน์เฮ้าส์' || type === 'คอนโดมิเนียม' || type === 'หอพัก อพาร์ทเม้นท์' ?
              <View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>เนื้อที่</Text>
                  <View style={styles.textInputView}>
                    <TextInput
                      style={[materialTall.headline, styles.textInput]}
                      textAlign="center"
                      keyboardType="number-pad"
                      placeholder="กรุณาเลือก"
                      value={area}
                      onChangeText={value => setArea(changeText(value))}
                    />
                    <Menu
                      visible={areaUnitVisible}
                      onDismiss={() => setAreaUnitVis(false)}
                      anchor={
                        <Button
                          style={{ width: 120 }}
                          labelStyle={materialTall.button}
                          icon="chevron-down"
                          onPress={() => setAreaUnitVis(true)}
                        >
                          {areaUnit}
                        </Button>
                      }
                    >
                      <Menu.Item
                        onPress={() => {
                          setAreaUnit('ตารางวา');
                          setAreaUnitVis(false);
                        }}
                        title="ตารางวา" />
                      <Menu.Item
                        onPress={() => {
                          setAreaUnit('ตารางเมตร');
                          setAreaUnitVis(false);
                        }}
                        title="ตารางเมตร" />
                      <Menu.Item
                        onPress={() => {
                          setAreaUnit('ไร่');
                          setAreaUnitVis(false);
                        }}
                        title="ไร่" />
                    </Menu>
                  </View>
                </View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ห้องนอน</Text>
                  <View style={styles.textInputView}>
                    <TextInput
                      style={[materialTall.headline, styles.textInput]}
                      textAlign="center"
                      keyboardType="number-pad"
                      placeholder="กรุณาเลือก"
                      value={bedroom}
                      onChangeText={value => setBedroom(changeText(value))}
                    />
                    <Text style={materialTall.title}>ห้อง</Text>
                  </View>
                </View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ห้องน้ำ</Text>
                  <View style={styles.textInputView}>
                    <TextInput
                      style={[materialTall.headline, styles.textInput]}
                      textAlign="center"
                      keyboardType="number-pad"
                      placeholder="กรุณาเลือก"
                      value={bathroom}
                      onChangeText={value => setBathroom(changeText(value))}
                    />
                    <Text style={materialTall.title}>ห้อง</Text>
                  </View>
                </View>
              </View>
              : null}

            {category === 'หางาน' ?
              <View>
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ประเภทงาน</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setJobVis(true)} underlayColor={materialColors.blackTertiary}>
                    {jobType == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{jobType}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="ประเภทงาน"
                  list={jobList}
                  visible={jobVisible}
                  setVisible={setJobVis}
                  setValue={setJobType}
                />
                <View style={styles.rowView}>
                  <Text style={materialTall.title}>ประเภทค่าจ้าง</Text>
                  <TouchableRipple style={styles.rightInputButton} onPress={() => setPaymentVis(true)} underlayColor={materialColors.blackTertiary}>
                    {payment == '' ?
                      <Text style={[materialTall.headline, { color: materialColors.blackTertiary }]}>กรุณาเลือก</Text>
                      :
                      <Text style={[materialTall.headline, { color: 'black' }]}>{payment}</Text>}
                  </TouchableRipple>
                </View>
                <List
                  posting={true}
                  listName="ประเภทค่าจ้าง"
                  list={paymentList}
                  visible={paymentVisible}
                  setVisible={setPaymentVis}
                  setValue={setPayment}
                />
              </View>
              : null}

            <TextInput
              label="ราคาเต็ม"
              style={[materialTall.headline, styles.textInput]}
              keyboardType="number-pad"
              value={price}
              onFocus={() => setPriceError(false)}
              onChangeText={value => setPrice(changeText(value))}
              error={priceError}
            />
            {priceError ? <Text style={styles.errorText}>โปรดระบุราคา</Text> : null}
            <TextInput
              label="รายละเอียด"
              multiline
              style={[materialTall.headline, styles.textInput]}
              placeholder="รายละเอียด..."
              value={detail}
              onChangeText={value => setDetail(value)}
            />
          </View>

          <View style={styles.sectionView}>
            <Text style={[materialTall.title, { color: 'black' }]}>พื้นที่</Text>
            <View style={styles.rowView}>
              <Text style={materialTall.title}>ตำบล</Text>
              <View>
                <TouchableRipple
                  style={[
                    styles.rightInputButton,
                    styles.addressButton,
                    { borderColor: tambonError ? colors.ERROR : iOSColors.midGray }
                  ]}
                  onPress={() => {
                    setTambonVis(true);
                    setTambonError(false);
                    setAmphoeError(false);
                    setChangwatError(false);
                  }}
                  underlayColor={iOSColors.lightGray}
                >
                  <Text style={[materialTall.headline, { color: 'black' }]}>    {tambon} </Text>
                </TouchableRipple>
                {tambonError ? <Text style={styles.errorText}>โปรดระบุตำบล</Text> : null}
              </View>
            </View>
            <View style={styles.rowView}>
              <Text style={materialTall.title}>อำเภอ</Text>
              <View>
                <TouchableRipple
                  style={[
                    styles.rightInputButton,
                    styles.addressButton,
                    {
                      borderColor: amphoeError ? colors.ERROR : iOSColors.midGray
                    }]}
                  onPress={() => {
                    setAmphoeVis(true);
                    setTambonError(false);
                    setAmphoeError(false);
                    setChangwatError(false);
                  }}
                  underlayColor={iOSColors.lightGray}
                >
                  <Text style={[materialTall.headline, { color: 'black' }]}>    {amphoe} </Text>
                </TouchableRipple>
                {amphoeError ? <Text style={styles.errorText}>โปรดระบุอำเภอ</Text> : null}
              </View>
            </View>
            <View style={styles.rowView}>
              <Text style={materialTall.title}>จังหวัด</Text>
              <View>
                <TouchableRipple
                  style={[
                    styles.rightInputButton,
                    styles.addressButton,
                    { borderColor: changwatError ? colors.ERROR : iOSColors.midGray }
                  ]}
                  onPress={() => {
                    setChangwatVis(true);
                    setTambonError(false);
                    setAmphoeError(false);
                    setChangwatError(false);
                  }}
                  underlayColor={iOSColors.lightGray}
                >
                  <Text style={[materialTall.headline, { color: 'black' }]}>    {changwat} </Text>
                </TouchableRipple>
                {changwatError ? <Text style={styles.errorText}>โปรดระบุจังหวัด</Text> : null}
              </View>
            </View>
            <AddressList
              visible={tambonVisible}
              setVisible={setTambonVis}
              setTambon={setTambon}
              setAmphoe={setAmphoe}
              setChangwat={setChangwat}
              setRegion={setRegion}
              address={address_data ? address_data.getAddress : null}
              getAddress={getTambon}
            />
            <AddressList
              visible={amphoeVisible}
              setVisible={setAmphoeVis}
              setTambon={setTambon}
              setAmphoe={setAmphoe}
              setChangwat={setChangwat}
              setRegion={setRegion}
              address={address_data ? address_data.getAddress : null}
              getAddress={getAmphoe}
            />
            <AddressList
              visible={changwatVisible}
              setVisible={setChangwatVis}
              setTambon={setTambon}
              setAmphoe={setAmphoe}
              setChangwat={setChangwat}
              setRegion={setRegion}
              address={address_data ? address_data.getAddress : null}
              getAddress={getChangwat}
            />
          </View>
          <View style={styles.sectionView}>
            <Text style={[materialTall.title, { color: 'black' }]}>เบอร์โทร</Text>
            <TextInput
              label="เบอร์โทร"
              style={[materialTall.headline, styles.textInput]}
              value={phone}
              onFocus={() => setPhone('')}
              onBlur={() => validatePhone(phone)}
              keyboardType={'phone-pad'}
              onChangeText={(value, previousValue) => onPhoneNumChange(value, previousValue)}
              error={phoneError}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneErrorText}</Text> : null}
          </View>


        </KeyboardAvoidingView>
        <Button
          mode="contained"
          onPress={handleUploadFile}
          labelStyle={materialTall.headlineWhite} >
          ลงขาย
              </Button>
      </ScrollView>

    </View>

  )
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: iOSColors.lightGray
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  sectionView: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 5,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: iOSColors.lightGray2
  },
  button: {
    backgroundColor: 'black'
  },
  rightInputButton: {
    borderBottomWidth: 1,
    borderColor: iOSColors.midGray,
    backgroundColor: iOSColors.lightGray,
    width: width * 0.6,
    paddingRight: 10,
    alignItems: 'center'
  },
  inputButton: {
    borderBottomWidth: 1,
    borderColor: iOSColors.Gray,
    marginTop: 15,
    paddingTop: 5,
    backgroundColor: iOSColors.lightGray,
    height: 64,
    justifyContent: 'center'
  },
  addressButton: {
    backgroundColor: iOSColors.lightGray,
    color: 'black',
    borderBottomWidth: 2
  },
  textInputView: {
    width: width * 0.6,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    backgroundColor: iOSColors.lightGray,
    marginTop: 15
  },
  label: {
    marginLeft: 15,
    marginBottom: 0,
    color: materialColors.blackSecondary
  },
  placeholderText: {
    marginLeft: 15,
    lineHeight: 30,
    marginBottom: 5
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
  directionText: {
    flex: 1,
    flexWrap: 'wrap',
    marginRight: 10
  },
  switch: {
    width: width * 0.6
  },
  order: {
    marginHorizontal: 30
  },
  underTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginRight: 10
  },
  errorText: {
    color: colors.ERROR,
    marginTop: 5
  }
})

export default PostProductDetailScreen;