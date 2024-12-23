import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Image
} from 'react-native';
import {
  Icon,
  Divider
} from 'react-native-elements';
import {
  ToggleButton,
  List,
  Card,
  ProgressBar,
  Button
} from 'react-native-paper';
import {
  FAB,
  Snackbar
} from 'react-native-paper';
import F5Icon from 'react-native-vector-icons/FontAwesome5';
import SwitchSelector from 'react-native-switch-selector';
// import BackgroundUpload from 'react-native-background-upload';
import {
  useMutation
} from '@apollo/client';

import {
  marketCategory,
  shopCategory
} from '../../utils/constants';
import { colors } from '../../utils/constants';
import SellButton from '../../component/SellButton';
import { iOSColors, materialColors, materialTall } from 'react-native-typography';
import CategoryItem from '../MarketScreen/Component/CategoryItem';
import CREATE_PRODUCT_MUTATION from '../../graphql/mutations/createProduct';
import CREATE_SHOP_MUTATION from '../../graphql/mutations/createShop';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ShopCategoryScreen = (props) => {

  const naviParam = props.route.params;

  const [sellVisible, setSellVisible] = useState(true);
  const [snackVisible, setSnackVisible] = useState(false);
  const [product, setProduct] = useState([]);
  const [shop, setShop] = useState([]);
  const [shopType, setShopType] = useState('จำหน่าย');

  const [uploadProgress, setUploadProgress] = useState(-1);

  const [
    createProduct,
    {
      data: product_data,
      loading: product_loading,
      error: product_error
    }] = useMutation(CREATE_PRODUCT_MUTATION);
  const [
    createShop,
    {
      data: shop_data,
      loading: shop_loading,
      error: shop_error
    }] = useMutation(CREATE_SHOP_MUTATION)

  const _listViewOffset = useRef(0);

  // useEffect(() => {
  //   if (naviParam?.uploadIdArr) {
  //     let progresses = [];
  //     let uploadFinished = 0;
  //     for (let [index, uploadId] of naviParam?.uploadIdArr.entries()) {
  //       progresses.push(0);
  //       BackgroundUpload.addListener('progress', uploadId, (data) => {
  //         // console.log(`Progress: ${data.progress}%`)
  //         progresses[index] = data.progress;
  //         setUploadProgress(Math.min(...progresses));
  //       })
  //       BackgroundUpload.addListener('error', uploadId, (data) => {
  //         console.log(`Error: ${data.error}%`);
  //       })
  //       BackgroundUpload.addListener('cancelled', uploadId, (data) => {
  //         console.log(`Cancelled!`);
  //       })
  //       BackgroundUpload.addListener('completed', uploadId, (data) => {
  //         // data includes responseCode: number and responseBody: Object
  //         uploadFinished++;
  //         if (uploadFinished === naviParam?.uploadIdArr.length) {
  //           submit();
  //           setUploadProgress(-1);
  //           setSnackVisible(true);
  //         }
  //         console.log('Completed!');
  //       });
  //     }
  //   }
  // }, [naviParam?.productVariable, naviParam?.shopVariable]);

  const renderProduct = () => {
    let arr = [];
    for (const c of marketCategory) {
      arr.push(
        <CategoryItem
          key={c.name}
          navigation={props.navigation}
          name={c.name}
          picture={c.picture}
          onPress={() => props.navigation.navigate('ProductFeed', { cateParam: c.engName })}
        />
      )
    }
    return arr;
  }

  const submit = () => {
    naviParam?.comeFrom === 'PostProductDetail'
      ? createProduct({
        variables: {
          ...naviParam?.productVariable
        }
      })
      : createShop({
        variables: {
          ...naviParam?.shopVariable
        }
      })
  };

  const renderShop = () => {
    let arr = [];
    for (const c of shopCategory) {
      arr.push(
        <CategoryItem
          key={c.name}
          navigation={props.navigation}
          name={c.name}
          picture={c.picture}
          shop={true}
          onPress={() => props.navigation.navigate('ShopFeed', { cateParam: c.name, typeParam: shopType })}
        />
      )
    }
    return arr;
  }

  const _onScroll = (event) => {
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
      delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
    }
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = event.nativeEvent.contentOffset.y
    const direction = (currentOffset > 0 && currentOffset > _listViewOffset.current)
      ? 'down'
      : 'up'
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up'
    if (isActionButtonVisible !== sellVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      setSellVisible(isActionButtonVisible);
    }
    // Update your scroll position
    _listViewOffset.current = currentOffset
  }

  return (
    <View style={styles.Root}>

      <ScrollView
        onScroll={_onScroll}
      >
        <View style={styles.cateHeader}>
          <Text style={styles.cateText}>หมวดหมู่</Text>
        </View>
        {/* <View style={styles.typeView}>
            <Text style={materialTall.title}>ประเภท</Text>
            <SwitchSelector
              initial={1}
              style={{flex: 1, marginLeft: 20}}
              buttonColor={colors.PRIMARY}
              selectedColor="black"
              textColor={materialColors.blackTertiary}
              selectedTextStyle={{fontWeight: 'bold'}}
              backgroundColor={colors.LIGHT_GREY_2}
              hasPadding
              options={[
                { label: "ผลิต", value: 'ผลิต'},
                { label: "จำหน่าย", value: 'จำหน่าย'}, 
                { label: "บริการ", value: 'บริการ'}
              ]}
              initial={1}
              onPress={(value) => setShopType(value)}
            />
          </View> */}
        <Divider />
        {
          uploadProgress >= 0 &&
          <Card style={styles.progressContainer}>
            <Text>กำลังอัพโหลดไฟล์...</Text>
            <ProgressBar progress={uploadProgress / 100} />
          </Card>
        }
        <View>
          <View style={styles.cateView}>
            {renderShop()}
          </View>
        </View>
        <View style={{ display: 'none' }}>
          <View style={styles.cateView}>
            {renderProduct()}
          </View>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        wrapperStyle={{ top: 10 }}
        duration={3000}
      >
        ส่งประกาศแล้ว กรุณารอการตรวจสอบสักครู่
        </Snackbar>
      <FAB
        onPress={() => props.navigation.navigate('PostShopPicture')}
        icon={props => <Icon type="material-community" name='store' {...props} />}
        label="สร้างร้านค้า"
        accessibilityLabel="สร้างร้านค้า"
        style={styles.fab}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  Root: {
    alignItems: 'center',
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    paddingHorizontal: 30,
    borderColor: colors.LIGHT_GRAY
  },
  tab: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  cateHeader: {
    marginLeft: 10
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  titleText: {
    marginLeft: 5,
    fontSize: 20,
    color: colors.PRIMARY,
    fontWeight: 'bold'
  },
  typeView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 5
  },
  cateText: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  catePic: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 5,
    overflow: 'hidden'
  },
  cateView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  itemView: {
    alignItems: 'center',
    marginTop: 20,
    width: width * 0.3
  },
  nameText: {
    fontSize: 18,
    marginTop: 5
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'red',
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  progressContainer: {
    padding: 10,
    marginTop: 5
  }
})

export default ShopCategoryScreen;