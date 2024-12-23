import React, { 
  useState, 
  useRef, 
  useEffect 
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  LayoutAnimation,
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  Card,
  Button,
  FAB,
  Snackbar,
  IconButton
} from 'react-native-paper';
// import BackgroundUpload from 'react-native-background-upload';
import {
  useMutation
} from '@apollo/client';

import { 
  marketCategory,
  shopCategory
} from '../../utils/constants';
import {
  iOSColors,
} from 'react-native-typography';
import CategoryItem from './Component/CategoryItem';
import CREATE_SHOP_MUTATION from '../../graphql/mutations/createShop';
import CREATE_PRODUCT_MUTATION from '../../graphql/mutations/createProduct';
import UploadProgressCard from '../../component/UploadProgressCard';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const MarketScreen = (props) => {

  const naviParam = props.route.params;

  const [sellVisible, setSellVisible] = useState(true);
  const [snackVisible, setSnackVisible] = useState(false);
  const [product, setProduct] = useState([]);
  const [shop, setShop] = useState([]);
  const [shopType, setShopType] = useState('จำหน่าย');
  const [tab, setTab] = useState(0);

  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadError, setUploadError] = useState(false);

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
  //   try {
  //     if (naviParam?.uploadIdArr) {
  //       if (naviParam?.uploadIdArr.length === 0) {
  //         submit(naviParam.productVariable);
  //       }
  //       let progresses = [];
  //       let uploadFinished = 0;
  //       for (let [index, uploadId] of naviParam?.uploadIdArr.entries()) {
  //         progresses.push(0);
  //         BackgroundUpload.addListener('progress', uploadId, (data) => {
  //           // console.log(`Progress: ${data.progress}%`)
  //           progresses[index] = data.progress;
  //           setUploadProgress(Math.min(...progresses));
  //         })
  //         BackgroundUpload.addListener('error', uploadId, (data) => {
  //           setUploadError(true);
  //           console.log(`Error: ${data.error}%`);
  //         })
  //         BackgroundUpload.addListener('cancelled', uploadId, (data) => {
  //           console.log(`Cancelled!`);
  //         })
  //         BackgroundUpload.addListener('completed', uploadId, (data) => {
  //           // data includes responseCode: number and responseBody: Object
  //           uploadFinished++;
  //           if (uploadFinished === naviParam?.uploadIdArr.length) {
  //             submit();
  //             setUploadProgress(-1);
  //             setSnackVisible(true);
  //           }
  //           console.log('Completed!');
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log('at Market => backgroundUpload');
  //     console.log(error)
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
        {/* <ToggleButton.Row
          style={{ flex: 1, alignSelf: 'stretch' }}
          onValueChange={(value) => setTab(value)}
          value={tab}
        >
          <ToggleButton
            style={[styles.toggleButton, {
              backgroundColor: tab === 0 ? iOSColors.orange : iOSColors.white
            }]}
            icon={() => <View style={styles.toggleIcon}>
              <Icon
                type="font-awesome"
                name="shopping-basket"
                color={tab === 0 ? iOSColors.white : iOSColors.gray}
              />
              <Text style={[styles.titleText, {
                color: tab === 0 ? iOSColors.white : iOSColors.gray
              }]}>สินค้า</Text>
            </View>
            }
            value={0}
          />
          <ToggleButton
            style={[styles.toggleButton, {
              backgroundColor: tab === 1 ? iOSColors.orange : iOSColors.white
            }]}
            icon={() => <View style={styles.toggleIcon}>
              <Icon
                type="material-community"
                name="storefront"
                color={tab === 1 ? iOSColors.white : iOSColors.gray}
              />
              <Text style={[styles.titleText, {
                color: tab === 1 ? iOSColors.white : iOSColors.gray
              }]}>ร้านค้า</Text>
            </View>}
            value={1}
          />
        </ToggleButton.Row> */}
        <View style={styles.cateHeader}>
          <Text style={styles.cateText}>หมวดหมู่</Text>
        </View>
        {
          (uploadProgress >= 0 || uploadError) ?
          <UploadProgressCard
            uploadError={uploadError}
            onClose={() => {
              setUploadProgress(-1);
              setUploadError(false);
            }}
            uploadProgress={uploadProgress}
          />
          : null
        }
        <View>
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
        onPress={() => props.navigation.navigate('PostProductPicture')}
        icon={props => <Icon type="entypo" name='megaphone' {...props} />}
        label="ลงขาย"
        accessibilityLabel="ลงประกาศ"
        style={styles.fab}
        color="white"
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
    alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    paddingHorizontal: 30,
    borderColor: iOSColors.lightGray
  },
  tab: {
    flexDirection: 'row',
    alignSelf: 'stretch'
  },
  // toggleButton: {
  //   flex: 1,
  // },
  // toggleIcon: {
  //   flexDirection: 'row',
  //   alignItems: 'center'
  // },
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
    color: iOSColors.orange,
    fontWeight: 'bold'
  },
  typeView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 15
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
})

export default MarketScreen;

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   ScrollView,
//   TouchableOpacity,
//   LayoutAnimation,
//   Keyboard,
// } from 'react-native';
// import {
//   Icon, 
//   Divider
// } from 'react-native-elements';
// import {
//   ToggleButton,
//   List,
//   Card,
//   ProgressBar,
//   Button
// } from 'react-native-paper';
// import { 
//   FAB,
//   Snackbar
// } from 'react-native-paper';
// import F5Icon from 'react-native-vector-icons/FontAwesome5';
// import BackgroundUpload from 'react-native-background-upload';
// import {
//   useMutation
// } from '@apollo/client';

// import { 
//   marketCategory,
//   shopCategory 
// } from '../../utils/constants';
// import { colors } from '../../utils/constants';
// import SellButton from '../../component/SellButton';
// import { iOSColors, materialColors, materialTall } from 'react-native-typography';
// import CategoryItem from './Component/CategoryItem';
// import ShopCate from './Component/ShopCate';
// import CREATE_PRODUCT_MUTATION from '../../graphql/mutations/createProduct';
// import CREATE_SHOP_MUTATION from '../../graphql/mutations/createShop';
// import createShop from '../../graphql/mutations/createShop';

// const width = Dimensions.get('window').width;
// const height = Dimensions.get('window').height;

// const MarketScreen = (props) => {

//   const naviParam = props.route.params;

//   const [ sellVisible, setSellVisible ] = useState(true);
//   const [ snackVisible, setSnackVisible ] = useState(false);
//   const [ product, setProduct ] = useState([]);
//   const [ shop, setShop ] = useState([]);
//   const [ shopType, setShopType ] = useState('จำหน่าย');

//   const [uploadProgress, setUploadProgress] = useState(-1);

//   const [
//     createProduct, 
//     { 
//       data: product_data, 
//       loading: product_loading, 
//       error: product_error 
//     }] = useMutation(CREATE_PRODUCT_MUTATION);
//   const [
//     createShop, 
//     {
//       data: shop_data, 
//       loading: shop_loading, 
//       error: shop_error
//     }] = useMutation(CREATE_SHOP_MUTATION)

//   const _listViewOffset = useRef(0);

//   useEffect(() => {
//     console.log('start')
//     if (naviParam?.uploadIdArr) {
//       let progresses = [];
//       let uploadFinished = 0;
//       for (let [index, uploadId] of naviParam?.uploadIdArr.entries()) {
//         progresses.push(0);
//         BackgroundUpload.addListener('progress', uploadId, (data) => {
//           // console.log(`Progress: ${data.progress}%`)
//           progresses[index] = data.progress;
//           setUploadProgress(Math.min(...progresses));
//         })
//         BackgroundUpload.addListener('error', uploadId, (data) => {
//           console.log(`Error: ${data.error}%`);
//         })
//         BackgroundUpload.addListener('cancelled', uploadId, (data) => {
//           console.log(`Cancelled!`);
//         })
//         BackgroundUpload.addListener('completed', uploadId, (data) => {
//           // data includes responseCode: number and responseBody: Object
//           uploadFinished++;
//           if(uploadFinished === naviParam?.uploadIdArr.length) {
//             submit();
//             setUploadProgress(-1);
//             setSnackVisible(true);
//           }
//           console.log('Completed!');
//         });
//       }
//     }
//   }, [naviParam?.productVariable, naviParam?.shopVariable]);

//   const renderProduct = () => {
//     let arr = [];
//     for(const c of marketCategory) {
//       arr.push(
//         <CategoryItem 
//           key={c.name}
//           navigation={props.navigation}
//           name={c.name}
//           picture={c.picture}
//           onPress={() => props.navigation.navigate('ProductFeed', { cateParam: c.name })}
//         />
//       )
//     }
//     return arr;
//   }

//   const submit = () => {
//     naviParam?.comeFrom === 'PostProductDetail'  
//     ? createProduct({
//       variables: {
//         ...naviParam?.productVariable
//       }
//     })
//     : createShop({
//       variables: {
//         ...naviParam?.shopVariable
//       }
//     })
//   };

//   const renderShop = () => {
//     let arr = [];
//     for(const c of shopCategory) {
//       arr.push(
//         <CategoryItem
//           key={c.name}
//           navigation={props.navigation}
//           name={c.name}
//           picture={c.picture}
//           shop={true}
//           onPress={() => props.navigation.navigate('ShopFeed', { cateParam: c.name, typeParam: shopType })}
//         />
//       )
//     }
//     return arr;
//   }

//   _onScroll = (event) => {
//     // Simple fade-in / fade-out animation
//     const CustomLayoutLinear = {
//       duration: 100,
//       create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
//       update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
//       delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
//     }
//     // Check if the user is scrolling up or down by confronting the new scroll position with your own one
//     const currentOffset = event.nativeEvent.contentOffset.y
//     const direction = (currentOffset > 0 && currentOffset > _listViewOffset.current)
//       ? 'down'
//       : 'up'
//     // If the user is scrolling down (and the action-button is still visible) hide it
//     const isActionButtonVisible = direction === 'up'
//     if (isActionButtonVisible !== sellVisible) {
//       LayoutAnimation.configureNext(CustomLayoutLinear);
//       setSellVisible(isActionButtonVisible);
//     }
//     // Update your scroll position
//     _listViewOffset.current = currentOffset
//   }

//   console.log(uploadProgress + "%")

//   return (
//     <View style={styles.Root}>

//       <ScrollView
//         onScroll={_onScroll}
//       >
//         <View style={styles.header}>
//             <View style={styles.title}>
//               <F5Icon 
//                 type="font-awesome"
//                 name="shopping-basket"
//                 color={iOSColors.orange}
//                 size={25}
//               />
//               <Text style={styles.titleText}> สินค้า</Text>
//             </View>

//         </View>
//         <View style={styles.cateHeader}>
//           <Text style={styles.cateText}>หมวดหมู่</Text>
//         </View>
//       {
//         uploadProgress >= 0 &&
//         <Card style={styles.progressContainer}>
//           <Text>กำลังอัพโหลดไฟล์...</Text>
//           <ProgressBar progress={uploadProgress / 100} />
//         </Card>
//       }
//           <View style={{ display: 'none' }}>
//             <View style={styles.cateView}>
//               {renderShop()}
//             </View>
//           </View>
//           <View>
//             <View style={styles.cateView}>
//               {renderProduct()}
//             </View>
//           </View>
//       </ScrollView>
//       <Snackbar
//           visible={snackVisible}
//           onDismiss={() => setSnackVisible(false)}
//           wrapperStyle={{top: 10}}
//           duration={3000}
//         >
//           ส่งประกาศแล้ว กรุณารอการตรวจสอบสักครู่
//         </Snackbar>
//             <FAB 
//               onPress={() => props.navigation.navigate('PostProductPicture')}
//               icon={ props => <Icon type="entypo" name='megaphone' { ...props }/> }
//               label="ลงขาย"
//               accessibilityLabel="ลงประกาศ"
//               style={styles.fab}
//             /> 
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   Root: {
//     alignItems: 'center',
//     backgroundColor: 'white'
//   },
//   header: {
//     flexDirection: 'row',
//     alignSelf: 'stretch',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     paddingHorizontal: 30,
//     borderColor: colors.LIGHT_GRAY
//   },
//   title: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   titleText: {
//     marginLeft: 5,
//     fontSize: 20,
//     color: colors.PRIMARY,
//     fontWeight: 'bold'
//   },
//   typeView: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 25,
//     paddingTop: 15
//   },
//   cateText: {
//     fontSize: 25,
//     fontWeight: 'bold'
//   },
//   catePic: {
//     width: width*0.3,
//     height: width*0.3,
//     borderRadius: 5,
//     overflow: 'hidden'
//   },
//   cateView: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-around'
//   },
//   itemView: {
//     alignItems: 'center',
//     marginTop: 20,
//     width: width*0.3
//   },
//   nameText: {
//     fontSize: 18,
//     marginTop: 5
//   },
//   fab:{
//     position: 'absolute', 
//     bottom: 30, 
//     alignSelf: 'center', 
//     backgroundColor: 'red', 
//   },
//    rowView: {
//      flexDirection: 'row',
//      alignItems: 'center'
//    },
//   progressContainer: {
//     padding: 10,
//     marginTop: 5
//   }
// })

// export default MarketScreen;