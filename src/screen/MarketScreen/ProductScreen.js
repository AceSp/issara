import React, { useEffect, useState, useRef, memo, useLayoutEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import {
    Icon,
    Overlay
} from 'react-native-elements';
import {
  Menu,
  TextInput,
  TouchableRipple,
  Provider,
  Button,
  Portal,
  RadioButton,
  Chip,
  Paragraph,
  Avatar,
  Card
} from 'react-native-paper';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';
import Swiper from 'react-native-swiper';
import ReadMore from 'react-native-read-more-text';
import moment from 'moment';

import GET_PRODUCT_QUERY from '../../graphql/queries/getProduct';
import GET_PRODUCTS_QUERY from '../../graphql/queries/getProducts';
import SAVE_PRODUCT_MUTATION from '../../graphql/mutations/saveProduct';
import GET_ME_QUERY from '../../graphql/queries/getMe';
import Loading from '../../component/Loading';
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
import ProductCard from './Component/ProductCard';
import AvatarWrapper from '../../component/AvatarWrapper';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const DetailList = (props) => {
  return(
    <View style={[styles.rowView, styles.detailListView]}>
      <View style={styles.detailTitle} >
        <Text style={materialTall.body1} >{props.title}</Text>
      </View>
      <View style={styles.detailInfo}>
        <Text style={materialTall.body2} >{props.info}</Text>  
      </View>
    </View>
  )
}

const ProductScreen = (props) => {

 const { productId } = props.route.params;

  const [ imageIndex, setImageIndex ] = useState(0);
  const [ isSaved, setIsSaved ] = useState(props.meSaved? true : false)

  const swiperRef = useRef();
  const imageListRef = useRef();

  const [saveProduct, {data: saveProduct_data}] = useMutation(SAVE_PRODUCT_MUTATION);

  const { data, loading, error } = useQuery(GET_PRODUCT_QUERY, 
    { 
      variables: { productId: productId },
      onCompleted: () => {
        getMoreProducts({
          variables: {
            category: data.getProduct.category, 
            type: data.getProduct.type,
            brand: data.getProduct.brand? data.getProduct.brand : null,
            model: data.getProduct.model? data.getProduct.model : null,
            memory: data.getProduct.memory? data.getProduct.memory : null,
            truckType: data.getProduct.truckType? data.getProduct.truckType : null,
            jobType: data.getProduct.jobType? data.getProduct.jobType : null,
            payment: data.getProduct.payment? data.getProduct.payment : null,
            minPrice: parseInt(data.getProduct.price - (data.getProduct.price * 0.2)),
            maxPrice: parseInt(data.getProduct.price + (data.getProduct.price * 0.2)),
            secondHand: data.getProduct.secondHand
          }
        })
      } 
    }
    );
  
  const { data: me_data, loading: me_loading, error: me_error } = useQuery(GET_ME_QUERY);

  const [ getMoreProducts, { loading: products_loading, error: products_error, data: products_data }] = useLazyQuery(GET_PRODUCTS_QUERY);

  const swipeTo = (index, i) => {
    swiperRef.current.scrollBy(index - i);
    imageListRef.current.scrollToIndex({ index: index, viewPosition: 0.5 });
  }

  const bookmark = () => {
    setIsSaved(!isSaved);
    saveProduct({
        variables: { productId: productId }
    });
  }

  const renderBigImage = () => {
    let arr = [];
    for(const [i,p] of data.getProduct.pictures.entries()) {
        arr.push(
          <View key={i} style={styles.bigImageContainer}>
            <Image 
              source={{ uri: p }} 
              style={styles.bigImage} 
              resizeMode={Image.resizeMode.contain}
            />
          </View>
        )
    }
    return arr;
  }

  const renderImageIndicator = (i) => {
    const renderImageist = ({index, item}) => {
      return(
        <TouchableWithoutFeedback onPress={() => swipeTo(index, i)} >
          <Image source={{ uri: item }} style={[styles.smallImage, { opacity: i === index? 1  : 0.7 } ]} />
        </TouchableWithoutFeedback>
      )
    }
    return (
    <FlatList 
      data={data.getProduct.pictures} 
      renderItem={renderImageist}
      keyExtractor={(item, index) => index.toString()}
      ref={imageListRef} 
      horizontal
    />
    )
  }

  const renderProductList = () => {
    let arr = [];
    const productList = products_data 
      ? products_data.getProducts.sections[0].data 
      : [];
    for(const product of productList) {
      arr.push(
        <ProductCard 
          key={product.id}
          id={product.id}
          name={product.name}
          meSaved={product.meSaved}
          price={product.price}
          pictures={product.pictures}
          tambon={product.tambon}
          amphoe={product.amphoe}
          changwat={product.changwat}
          createdAt={product.createdAt} 
          navigation={props.navigation} 
        />
      );
    } 
    return arr;
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  return (
    <View style={styles.Root}>
      <ScrollView>
        <Swiper 
          ref={swiperRef}
          height={height*0.35}
          containerStyle={styles.swiper}
          onIndexChanged={index => imageListRef.current.scrollToIndex({ index: index, viewPosition: 0.5 })}
          renderPagination={(i) => renderImageIndicator(i)}
        >
          {renderBigImage()}
        </Swiper>
        <View style={styles.body}>
          <View style={[ styles.rowView, styles.priceView ]}>
            <Text style={[materialTall.display1, { color: iOSColors.orange }]} >
              {data.getProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </Text>
            <Text style={[materialTall.subheading, { color: materialColors.blackPrimary }]} >รวมมูลค่าของแถมแล้ว(ถ้ามี)</Text>
          </View>
          <View style={[styles.rowView, styles.priceView]}>
            <Button 
              onPress={bookmark}
              icon={() => {
                if(isSaved) return <Icon type="material-community" name="bookmark"   color={materialColors.blackPrimary}/>
                return <Icon type="material-community" name="bookmark-outline"   color={materialColors.blackPrimary}/>
              }}
              mode={isSaved? "contained" : "outlined"}
              labelStyle={isSaved? materialTall.buttonWhite : materialTall.button }
            >
              {isSaved? "บันทีกรายการนี้แล้ว" : "บันทึกรายการนี้"}
            </Button>
            {
              me_loading? null
              :
              me_data.getMe.id === data.getProduct.author.id
              &&
              <Button
                onPress={() => props.navigation.navigate('Ad',
                {
                  productParam: {
                    id: data.getProduct.id,
                    itemName: data.getProduct.itemName,
                    picture: data.getProduct.pictures
                  },
                  tambonParam: data.getProduct.tambon,
                  amphoeParam: data.getProduct.amphoe,
                  changwatParam: data.getProduct.changwat,
                  regionParam: data.getProduct.region,
                  phraseParam: data.getProduct.detail,
                  descriptionParam: data.getProduct.detail,
                  isProduct: true,
                  shopIdParam: data.getProduct.shop? data.getProduct.shop.id : null
                }
                )}
                icon={() => <Icon type="antdesign" name="notification"  color={materialColors.blackPrimary}/>}
                labelStyle={materialTall.button }
              >
                เพิ่มการมองเห็น
              </Button>
            }
            
            <Icon name="share" color={materialColors.blackSecondary} />
          </View>
          <Text style={[materialTall.display1, { color: iOSColors.black }]} >{data.getProduct.name}</Text>
          <View style={styles.rowView}>
            <Chip>{data.getProduct.type}</Chip>
            {data.getProduct.brand? <Chip>{data.getProduct.brand}</Chip> : null}
            {data.getProduct.model? <Chip>{data.getProduct.model}</Chip> : null}
            <Chip>{data.getProduct.secondHand? "มือสอง" : "มิอหนึ่ง" }</Chip>
          </View>
          <View style={styles.detailListContainer}>
            {data.getProduct.type? <DetailList title="ประเภท" info={data.getProduct.type} /> : null }
            {data.getProduct.brand? <DetailList title="ยี่ห้อ" info={data.getProduct.brand} /> : null }
            {data.getProduct.model? <DetailList title="รุ่น" info={data.getProduct.model} /> : null }
            {data.getProduct.fuel? <DetailList title="เชื้อเพลิง" info={data.getProduct.fuel} /> : null }
            {data.getProduct.gear? <DetailList title="เกียร์" info={data.getProduct.gear} /> : null }
            {data.getProduct.color? <DetailList title="สี" info={data.getProduct.color} /> : null }
            {data.getProduct.memory? <DetailList title="ความจุ" info={data.getProduct.memory} /> : null }
            {data.getProduct.truckType? <DetailList title="ประเภทรถบรรทุก" info={data.getProduct.truckType} /> : null }
            {data.getProduct.jobType? <DetailList title="ประเภทงาน" info={data.getProduct.jobType} /> : null }
            {data.getProduct.payment? <DetailList title="ค่าจ้าง" info={data.getProduct.payment} /> : null }
            {data.getProduct.miles? <DetailList title="เลขไมล์" info={data.getProduct.miles} /> : null }
            {data.getProduct.year? <DetailList title="ปี" info={data.getProduct.year} /> : null }
            {data.getProduct.bedroom? <DetailList title="ห้องนอน" info={data.getProduct.bedroom} /> : null }
            {data.getProduct.bathroom? <DetailList title="ห้องน้ำ" info={data.getProduct.bathroom} /> : null }
          </View>
          <Text style={[materialTall.display1, styles.detailHeadline]} >รายละเอียดสินค้า</Text>
          <ReadMore
              numberOfLines={3}
              renderTruncatedFooter={(press) => <Button style={styles.readMore} onPress={press} >อ่านเพิ่มเติม</Button>}
              renderRevealedFooter={(press) => <Button style={styles.readMore} onPress={press}>ซ่อน</Button>}
          >
               <Text style={materialTall.subheading} >{data.getProduct.detail}</Text>
          </ReadMore>
          <View style={[styles.rowView, styles.bottomMeta]}>
            <Icon type="font-awesome" name="edit" color={iOSColors.gray} />
            <Text style={materialTall.caption} >  อัพเดทล่าสุด  </Text>
            <Text style={materialTall.body1} >  {moment(data.getProduct.updatedAt).fromNow()} </Text>
          </View>
          <View style={[styles.rowView, styles.bottomMeta]}>
            <Icon type="material-community" name="calendar-blank-outline" color={iOSColors.gray} />
            <Text style={materialTall.caption} >  ลงขายเมื่อ  </Text>
            <Text style={materialTall.body1} >  {moment(data.getProduct.createdAt).fromNow()} </Text>
          </View>
          <View style={[styles.rowView, styles.bottomMeta]}>
            <Icon name="directions" color={iOSColors.gray} />
            <Text style={materialTall.caption} >  ตำแหน่ง  </Text>
            <Text style={materialTall.body1} >  {data.getProduct.tambon} {data.getProduct.amphoe} {data.getProduct.changwat} </Text>
          </View>
          <Card >
            <Card.Title 
              title={data.getProduct.author.itemName} 
              left={(p) => <AvatarWrapper
                  {...p}
                  uri={data.getProduct.author.avatar}
                  label={data.getProduct.author.itemName[0]}
                />}
            />
            <Card.Actions style={styles.authorAction}>
                    <Button 
                      style={styles.button}
                      icon={() => <Icon color={iOSColors.orange} type="simple-line-icon" name="bubble" />}
                      onPress={() => props.navigation.navigate('NewChatRoom', {
                        user: data.getProduct.author
                      })}
                    >
                        คุยกับผู้ขาย
                    </Button>
                    <Button style={styles.button} icon="phone" >
                      โทรหาผู้ขาย
                    </Button>
            </Card.Actions>
          </Card>
          <Chip 
            style={styles.warning}
            textStyle={materialTall.headline}
            icon={() => <Icon color={iOSColors.orange} type="antdesign" name="exclamationcircle" />}
          >
            กรุณาอย่าโอนเงิน ไม่ว่ากรณีใดๆ
          </Chip>
          <Text style={[materialTall.display1, styles.detailHeadline]} >สินค้าที่คล้ายกัน</Text>
          <View>
            {products_data?
              renderProductList()
              :
              <Text style={materialTall.headline} >ไม่พบสินค้าที่คล้ายกัน</Text> 
            }
          </View>
          <Button
            labelStyle={materialTall.buttonWhite} 
            mode="contained" 
            onPress={() => props.navigation.navigate('ProductFeed', 
            { 
              cateParam: data.getProduct.category, 
              typeParam: data.getProduct.type,
              brandParam: data.getProduct.brand? data.getProduct.brand : null,
              modelParam: data.getProduct.model? data.getProduct.model : null,
              memoryParam: data.getProduct.memory? data.getProduct.memory : null,
              truckTypeParam: data.getProduct.truckType? data.getProduct.truckType : null,
              jobTypeParam: data.getProduct.jobType? data.getProduct.jobType : null,
              paymentParam: data.getProduct.payment? data.getProduct.payment : null,
              minPriceParam: parseInt(data.getProduct.price - (data.getProduct.price * 0.2)),
              maxPriceParam: parseInt(data.getProduct.price + (data.getProduct.price * 0.2)),
              secondHandParam: data.getProduct.secondHand 
            }) } 
            >
            ดูสินค้าที่คล้ายกัน
          </Button>
        </View>
      </ScrollView>
    </View>

  )
}

const styles = StyleSheet.create({
  Root: {     
      flex: 1,
      backgroundColor: iOSColors.white
  },
  goBack: {
    position: 'absolute',
    backgroundColor: colors.FOB,
    width: height*0.05,
    height: height*0.05,
    zIndex: 1,
    left: 15,
    top: 15,
    borderRadius: 5,
    justifyContent: 'center'
  },
  bigImageContainer: {
    height: height*0.35,
    width: width
  },
  bigImage: {
    height: height*0.35,
  },
  smallImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 20
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 50
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  priceView: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5
  },
  detailListContainer: {
    borderWidth: 1,
    borderColor: iOSColors.gray,
    borderRadius: 10,
    marginTop: 10
  },
  detailListView: {
    alignSelf: 'stretch',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: iOSColors.gray
  },
  detailTitle: {
    flex: 1
  },
  detailInfo: {
    flex: 1
  },
  detailHeadline: {
    color: iOSColors.black,
    marginTop: 20,
    marginBottom: 10
  },
  readMore: {
    alignSelf: 'flex-start',
    marginBottom: 20
  },
  bottomMeta: {
    marginVertical: 5
  },
  authorView: {
    marginTop: 20,
    backgroundColor: iOSColors.midGray,
    borderRadius: 10
  },
  button: {
    flex: 1,
    alignSelf: 'stretch'
  },
  authorAction: {
    padding: 0
  },
  warning: {
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: iOSColors.lightGray
  }
})

export default ProductScreen;