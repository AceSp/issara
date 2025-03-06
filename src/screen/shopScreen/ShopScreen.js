import React, { useEffect, useState, useRef, memo, useLayoutEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Image
} from 'react-native';
import { Icon } from 'react-native-elements';
import {
  TextInput,
  Button,
  Card,
  Divider,
  List,
  ProgressBar,
  TouchableRipple,
  FAB
} from 'react-native-paper';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { materialTall, materialColors, iOSColors } from 'react-native-typography';
import Swiper from 'react-native-swiper';
import moment from 'moment';
import { Rating } from 'react-native-ratings';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import getDirections from 'react-native-google-maps-directions';
import ImageViewer from 'react-native-image-zoom-viewer';

import GET_SHOP_QUERY from '../../graphql/queries/getShop';
import GET_REVIEWS_QUERY from '../../graphql/queries/getReviews';
import RATE_SHOP_MUTATION from '../../graphql/mutations/rateShop';
import REVIEW_SHOP_MUTATION from '../../graphql/mutations/reviewShop';
import FOLLOW_SHOP_MUTAION from '../../graphql/mutations/followShop';
import UNFOLLOW_SHOP_MUTAION from '../../graphql/mutations/unfollowShop';
import Loading from '../../component/Loading';
import ReviewCard from './component/ReviewCard';
import { DEFAULT_IMAGE } from '../../utils/constants';
import { store } from '../../utils/store';
import FollowButton from '../../component/FollowButton';
import getScheduleStatus from '../../utils/getScheduleStatus';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const OpenTimeTitle = (props) => {
  return (
    <View style={styles.rowView}>
      <Icon color={iOSColors.orange} type="material-community" name="clock-outline" />
      <Text style={[materialTall.body1, styles.infoText]}>
        {props.isOpen ?
          <Text style={[materialTall.body2, { color: iOSColors.green }]}>
            เปิด
          </Text>
          :
          <Text style={[materialTall.body2, { color: iOSColors.orange }]}>
            ปิด
          </Text>
        }
        {props.isOpen ? 'ถึง ' + props.next.time : '\u25CFเปืด ' + props.next.day + ' ' + props.next.time} นาฬิกา
      </Text>
    </View>

  )
}

const ShopScreen = (props) => {

  const shopId = props.shopId ? props.shopId : props.route.params.shopId;

  const { state: { me }, dispatch } = useContext(store);

  const [fiveStarPercentage, setFiveStarPercentage] = useState(0);
  const [fourStarPercentage, setFourStarPercentage] = useState(0);
  const [threeStarPercentage, setThreeStarPercentage] = useState(0);
  const [twoStarPercentage, setTwoStarPercentage] = useState(0);
  const [oneStarPercentage, setOneStarPercentage] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');
  const [scheduleStatus, setScheduleStatus] = useState(null);

  const [imageViewVisible, setImageView] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imageList, setImageList] = useState([]);

  const [follow, setFollow] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const swiperRef = useRef();
  const imageListRef = useRef();

  const { data, loading, error, refetch } = useQuery(GET_SHOP_QUERY,
    {
      variables: { shopId: shopId }
    }
  );

  const { data: reviews_data, loading: reviews_loading, error: reviews_error } = useQuery(
    GET_REVIEWS_QUERY,
    {
      variables: { id: shopId }
    }
  );

  const handleGetDirections = () => {
    getDirections({
      destination: {
        latitude: data.getShop.pinLocation.lat,
        longitude: data.getShop.pinLocation.lon
      }
    })
  };

  const [rateShop, { data: rateShop_data }] = useMutation(RATE_SHOP_MUTATION);
  const [reviewShop, { data: reviewShop_data }] = useMutation(REVIEW_SHOP_MUTATION);
  const [
    followShop,
    { data: follow_data }
  ] = useMutation(FOLLOW_SHOP_MUTAION);

  useEffect(() => {
    refetch();
  }, [])

  useEffect(() => {
    if(data?.getShop.openTime) {
      const status = getScheduleStatus(data.getShop.openTime);
      setScheduleStatus(status);
    }
  }, [data?.getShop.openTime])

  useEffect(() => {
    if (!loading) {
      let maxStar = Math.max(data.getShop.fivestarCount, data.getShop.fourstarCount, data.getShop.threestarCount, data.getShop.twostarCount, data.getShop.onestarCount);
      maxStar = maxStar? maxStar : 1;
      setFiveStarPercentage(data.getShop.fivestarCount / maxStar);
      setFourStarPercentage(data.getShop.fourstarCount / maxStar);
      setThreeStarPercentage(data.getShop.threestarCount / maxStar);
      setTwoStarPercentage(data.getShop.twostarCount / maxStar);
      setOneStarPercentage(data.getShop.onestarCount / maxStar);
    }
  }, [
    data?.getShop.fivestarCount,
    data?.getShop.fourstarCount,
    data?.getShop.threestarCount,
    data?.getShop.twostarCount,
    data?.getShop.onestarCount
  ])

  useEffect(() => {
    if(!me.followingShop) return;
    if(me.followingShop.includes(data?.getShop.id)) setFollow(true);
  }, [me, data])

  useEffect(() => {
    if (data?.getShop.myReview?.star) {
      if (myRating != data?.getShop.myReview?.star) setMyRating(data?.getShop.myReview?.star);
    };
  }, [data?.getShop.myReview?.star]);

  useEffect(() => {
    if (data?.getShop.myReview?.text) {
      if (myReview != data?.getShop.myReview?.text) setMyReview(data?.getShop.myReview?.text);
    };
  }, [data?.getShop.myReview?.text]);

  useEffect(() => {
    if (data?.getShop.images) {
      const arr = [];
      for (const image of data.getShop.images) {
        arr.push({ url: image })
      }
      setImageList(arr);
    };
  }, [data?.getShop.images]);

  useEffect(() => {
    if (!data) return
    setIsMod(data.getShop.mod.includes(me?.id));
  }, [data?.getShop.mod]);

  useEffect(() => {
    if (!data) return
    setIsAdmin(data.getShop.admin.includes(me?.id));
  }, [data?.getShop.admin]);

  const starPress = (value) => {
    setMyRating(value);
    rateShop({
      variables: {
        shopId: data.getShop.id,
        star: value
      }
    });
  }

  function handleFollowShop() {
    followShop({
      variables: {
        shopId
      }
    });
    setFollow(!follow);
    const newMe = {...me};
    const followed = me.followingShop.includes(data.getShop.id)
    newMe.followingShop = followed 
      ? newMe.followingShop.filter((current) => current !== data.getShop.id)
      : [...me.followingShop, data.getShop.id]
    dispatch({ 
      type: 'CHANGE_ME', 
      me: newMe,
    });
  }

  const reviewBlur = () => {
    reviewShop({
      variables: {
        shopId: data.getShop.id,
        text: myReview
      }
    })
  }

  const onImagePress = (index) => {
    setImageView(true);
    setImageIndex(index);
  }

  const renderImages = () => {
    if (!data.getShop.images) return <View></View>
    let arr = [];
    for (const [index, image] of data.getShop.images.entries()) {
      if (index < 6) {
        arr.push(
          <TouchableRipple onPress={() => onImagePress(index)} key={index} style={styles.smallImage}>
            <Image 
              style={styles.smallImage} 
              source={{ uri: image }} 
            />
          </TouchableRipple>
        )
      }
    }
    return arr;
  }

  const renderReview = () => {
    if (!reviews_data.getReviews.reviews) return [];
    let arr = [];
    for (const [index, review] of reviews_data.getReviews.reviews.entries()) {
      if (index < 2) {
        arr.push(
          <ReviewCard key={review.id} {...review} />
        )
      }
    }
    return arr;
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  return (
    <View style={styles.Root}>
      <Modal
        onRequestClose={() => setImageView(false)}
        visible={imageViewVisible}
        transparent={imageViewVisible}>
        <ImageViewer
          imageUrls={imageList}
          index={imageIndex}
          onCancel={() => setImageView(false)}
          enableSwipeDown={true}
          enablePreload={true}
        />
      </Modal>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.bigImage}>
          <Image
            style={styles.bigImage}
            source={data.getShop.headerPic
                ? {uri: data.getShop.headerPic}
                : DEFAULT_IMAGE} 
          />
        </View>
        <View style={styles.detailView}>
          <View style={styles.topBox}>
            <Text style={materialTall.headline}>{data.getShop.itemName}</Text>
            <FollowButton
                followText="ติดตาม"
                unfollowText="เลิกติดตาม"
                onPress={handleFollowShop}
                follow={follow}
                style={styles.topFollowButton}
                textStyle={styles.followButtonText}
            />
          </View>
          <View style={styles.bottomView}>
            <View>
              <Text
                style={materialTall.caption}
              >
                {data.getShop.type + " \u25CF " + data.getShop.category}
              </Text>

            </View>
          </View>
          {isMod ? <Divider style={styles.divider} /> : null}
          {
            isMod &&
            <View style={[styles.rowView, { justifyContent: 'space-between' }]}>
              <TouchableRipple style={styles.rippleButton}>
                <View>
                  <Icon type="font-awesome" name="send-o" color={materialColors.blackSecondary} />
                  <Text style={[materialTall.body1, { color: materialColors.blackSecondary }]}>แจ้งข่าวสาร</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                style={styles.rippleButton}
                onPress={() => props.navigation.navigate('Ad',
                  {
                    shopParam: {
                      id: data.getShop.id,
                      itemName: data.getShop.itemName,
                      avatar: data.getShop.avatar,
                    },
                    tambonParam: data.getShop.tambon,
                    amphoeParam: data.getShop.amphoe,
                    changwatParam: data.getShop.changwat,
                    regionParam: data.getShop.region,
                    phraseParam: data.getShop.phrase,
                    descriptionParam: data.getShop.description
                  }
                )}
              >
                <View>
                  <Icon type="antdesign" name="notification" color={materialColors.blackSecondary} />
                  <Text style={[materialTall.body1, { color: materialColors.blackSecondary }]}>เพิ่มการมองเห็น</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => props.navigation.navigate('ManageShop',
                  {
                    shopId: data.getShop.id,
                    isAdmin: isAdmin
                  })}
                style={styles.rippleButton}>
                <View>
                  <Icon size={30} type="evilicon" name="gear" color={materialColors.blackSecondary} />
                  <Text style={[materialTall.body1, { color: materialColors.blackSecondary }]}>จัดการร้าน</Text>
                </View>
              </TouchableRipple>
              <TouchableRipple
                onPress={() => props.navigation.navigate('EditShop',
                  {
                    idParam: data.getShop.id,
                    nameParam: data.getShop.itemName,
                    categoryParam: data.getShop.category,
                    typeParam: data.getShop.type,
                    haveStoreFrontParam: data.getShop.haveStoreFront,
                    haveOnlineParam: data.getShop.haveOnline,
                    addressParam: data.getShop.address,
                    tambonParam: data.getShop.tambon,
                    amphoeParam: data.getShop.amphoe,
                    changwatParam: data.getShop.changwat,
                    regionParam: data.getShop.region,
                    latitudeParam: data.getShop.latitude,
                    longitudeParam: data.getShop.longitude,
                    openTimeParam: data.getShop.openTime,
                    phoneNumberParam: data.getShop.phoneNumber,
                    websiteParam: data.getShop.website,
                    emailParam: data.getShop.email,
                    phraseParam: data.getShop.phrase,
                    descriptionParam: data.getShop.description
                  }
                )}>
                <View>
                  <Icon type="material-community" name="briefcase-edit-outline" color={materialColors.blackSecondary} />
                  <Text style={[materialTall.body1, { color: materialColors.blackSecondary }]}>แก้ไขร้าน</Text>
                </View>
              </TouchableRipple>
            </View>
          }
          {isMod ? <Divider style={styles.divider} /> : null}
          {
            data.getShop.phoneNumber ?
              <View style={styles.aboutRow}>
                <Icon containerStyle={styles.topicIcon} color={iOSColors.orange} name="phone" />
                <Text style={[materialTall.body1, styles.infoText]}>{data.getShop.phoneNumber}</Text>
              </View>
              : null
          }
          {
            data.getShop.websit ?
              <View style={styles.aboutRow}>
                <Icon containerStyle={styles.topicIcon} color={iOSColors.orange} type="material-community" name="web" />
                <Text style={[materialTall.body1, styles.infoText]}>{data.getShop.website}</Text>
              </View>
              : null
          }
          {
            data.getShop.email ?
              <View style={styles.aboutRow}>
                <Icon containerStyle={styles.topicIcon} color={iOSColors.orange} name="email" />
                <Text style={[materialTall.body2, styles.infoText]}>{data.getShop.email}</Text>
              </View>
              : null
          }
          {
            data.getShop.address || data.getShop.distric || data.getShop.changwat ?
              <View style={styles.aboutRow}>
                <Icon containerStyle={styles.topicIcon} color={iOSColors.orange} name="directions" />
                <Text style={[materialTall.body1, styles.infoText]}>
                  {data.getShop.address + "\t"}
                  {data.getShop.tambon + "\t"}
                  {data.getShop.amphoe + "\t"}
                  {data.getShop.changwat + "\t"}
                  {data.getShop.zipcode}
                </Text>
              </View>
              : null
          }
          {
            data.getShop.pinLocation?
              <View>
                <View style={styles.map}>
                  <MapView
                    style={{ height: '100%', width: '100%' }}
                    provider={PROVIDER_GOOGLE}
                    region={{
                      latitude: data.getShop.pinLocation.lat,
                      longitude: data.getShop.pinLocation.lon,
                      latitudeDelta: 0.09,
                      longitudeDelta: 0.035
                    }}
                    // onRegionChangeComplete={(e) => setMapCoord(e)}       
                    scrollEnabled={true}
                  >
                    <Marker
                      coordinate={{ latitude: data.getShop.pinLocation.lat, longitude: data.getShop.pinLocation.lon }}
                    >

                    </Marker>
                  </MapView>
                </View>
                <Button onPress={handleGetDirections} >ขอทราบเส้นทาง</Button>
              </View>
              : null}
          {
            data.getShop.openTime ?
              <List.Accordion
                title={''}
                left={() =>  scheduleStatus ? <OpenTimeTitle isOpen={scheduleStatus?.isOpen} next={scheduleStatus?.next} /> : null}
                style={styles.opentime}
              >
                <List.Item
                  style={styles.openTimeItem}
                  left={() => <Text style={materialTall.subheading}>วันจันทร์</Text>}
                  right={() => {
                    if (data.getShop.openTime.monday[0])
                      return (
                        <Text style={materialTall.subheading}>
                          {data.getShop.openTime.monday[0].opens} - {data.getShop.openTime.monday[0].closes}
                        </Text>
                      )
                    return <Text style={materialTall.subheading}>ปิด</Text>
                  }}
                />
                <List.Item
                  style={styles.openTimeItem}
                  left={() => <Text style={materialTall.subheading}>วันอังคาร</Text>}
                  right={() => {
                    if (data.getShop.openTime.tuesday[0])
                      return (<Text style={materialTall.subheading}>
                        {data.getShop.openTime.tuesday[0].opens} - {data.getShop.openTime.tuesday[0].closes}
                      </Text>)
                    return <Text style={materialTall.subheading}>ปิด</Text>
                  }}
                />
                <List.Item
                  style={styles.openTimeItem}
                  left={() => <Text style={materialTall.subheading}>วันพุธ</Text>}
                  right={() => {
                    if (data.getShop.openTime.wednesday[0])
                      return (<Text style={materialTall.subheading}>
                        {data.getShop.openTime.wednesday[0].opens} - {data.getShop.openTime.wednesday[0].closes}
                      </Text>)
                    return <Text style={materialTall.subheading}>ปิด</Text>
                  }}
                />
                <List.Item
                  style={styles.openTimeItem}
                  left={() => <Text style={materialTall.subheading}>วันพฤหัส</Text>}
                  right={() => {
                    if (data.getShop.openTime.thursday[0])
                      return (<Text style={materialTall.subheading}>
                        {data.getShop.openTime.thursday[0].opens} - {data.getShop.openTime.thursday[0].closes}
                      </Text>)
                    return <Text style={materialTall.subheading}>ปิด</Text>
                  }}
                />
                <List.Item
                  style={styles.openTimeItem}
                  left={() => <Text style={materialTall.subheading}>วันศุกร์</Text>}
                  right={() => {
                    if (data.getShop.openTime.friday[0])
                      return (<Text style={materialTall.subheading}>
                        {data.getShop.openTime.friday[0].opens} - {data.getShop.openTime.friday[0].closes}
                      </Text>)
                    return <Text style={materialTall.subheading}>ปิด</Text>
                  }}
                />
                <List.Item
                  style={styles.openTimeItem}
                  left={() => <Text style={materialTall.subheading}>วันเสาร์</Text>}
                  right={() => {
                    if (data.getShop.openTime.saturday[0])
                      return (<Text style={materialTall.subheading}>
                        {data.getShop.openTime.saturday[0].opens} - {data.getShop.openTime.saturday[0].closes}
                      </Text>)
                    return <Text style={materialTall.subheading}>ปิด</Text>
                  }}
                />
                <List.Item
                  style={styles.openTimeItem}
                  left={() => <Text style={materialTall.subheading}>วันอาทิตย์</Text>}
                  right={() => {
                    if (data.getShop.openTime.sunday[0])
                      return (<Text style={materialTall.subheading}>
                        {data.getShop.openTime.sunday[0].opens} - {data.getShop.openTime.sunday[0].closes}
                      </Text>)
                    return <Text style={materialTall.subheading}>ปิด</Text>
                  }}
                />
              </List.Accordion>
              : null
          }
          {
            data.getShop.description ?
              <View style={styles.aboutRow}>
                <Icon containerStyle={styles.topicIcon} color={iOSColors.orange} name="info" />
                <Text style={[materialTall.body1, styles.infoText]}>{data.getShop.description}</Text>
              </View>
              : null
          }
        </View>
        <Divider style={styles.divider} />
        {
          data.getShop.images ?
            <Text style={{...materialTall.title, marginLeft: 20}}>รูปภาพ</Text>
            :
            null
        }
        <View style={styles.imageView}>
          {renderImages()}
        </View>
        {
          data.getShop.images?.length > 6 ?
            <View>
              <Button 
                onPress={() => props.navigation.navigate('ShopImage', { 
                  images: data.getShop.images 
                })}
              >
                ดูเพิ่มเติม
              </Button>
              <Divider style={styles.divider} />
            </View>
            : null
        }
        <View style={styles.detailView}>
          <Text style={materialTall.title}>เรตติ้ง</Text>
          <View style={styles.rowView}>
            <View style={styles.ratingPercentage}>
              <View style={styles.rowView}>
                <Text style={materialTall.body1} >5</Text>
                <View style={styles.percentBarContainer}>
                  <ProgressBar
                    style={styles.percentBar}
                    color={iOSColors.yellow}
                    progress={fiveStarPercentage}
                  />
                </View>
              </View>
              <View style={styles.rowView}>
                <Text style={materialTall.body1}>4</Text>
                <View style={styles.percentBarContainer}>
                  <ProgressBar
                    style={styles.percentBar}
                    color={iOSColors.yellow}
                    progress={fourStarPercentage}
                  />
                </View>
              </View>
              <View style={styles.rowView}>
                <Text style={materialTall.body1}>3</Text>
                <View style={styles.percentBarContainer}>
                  <ProgressBar
                    style={styles.percentBar}
                    color={iOSColors.yellow}
                    progress={threeStarPercentage}
                  />
                </View>
              </View>
              <View style={styles.rowView}>
                <Text style={materialTall.body1}>2</Text>
                <View style={styles.percentBarContainer}>
                  <ProgressBar
                    style={styles.percentBar}
                    color={iOSColors.yellow}
                    progress={twoStarPercentage}
                  />
                </View>
              </View>
              <View style={styles.rowView}>
                <Text style={materialTall.body1}>1</Text>
                <View style={styles.percentBarContainer}>
                  <ProgressBar
                    style={styles.percentBar}
                    color={iOSColors.yellow}
                    progress={oneStarPercentage}
                  />
                </View>
              </View>
            </View>
            <View style={styles.ratingNumber}>
              <Text
                style={[materialTall.display2, { color: iOSColors.black }]}>
                {data.getShop.avgRating.toFixed(1) + '\t'}
              </Text>
              <Rating
                  readonly
                  startingValue={data.getShop.avgRating}
                  imageSize={20}
              />
              <Text numberOfLines={1} style={[materialTall.body1, styles.voteCountText]}>
                {
                  data.getShop.fivestarCount
                  + data.getShop.fourstarCount
                  + data.getShop.threestarCount
                  + data.getShop.twostarCount
                  + data.getShop.onestarCount
                } โหวต
                  </Text>
            </View>
          </View>
          <Divider style={styles.divider} />
          <View>
            <Text style={materialTall.title}>รีวิวของคุณ</Text>
            <Rating
              onFinishRating={starPress}
              startingValue={myRating}
              jumpValue={1}
              style={{ margin: 5 }}
            />
            <TextInput
              label="รีวิว"
              value={myReview}
              onChangeText={text => setMyReview(text)}
              onBlur={reviewBlur}
            />
          </View>
          {
            !reviews_loading && renderReview.length !== 0
              ? <Text style={materialTall.subheading}>รีวิว</Text>
              : null
          }
          <View>
            {reviews_loading ? null : renderReview()}
          </View>
          {
            !reviews_loading && renderReview().length >= 3 ?
              (
                <Button onPress={() => props.navigation.navigate('Review', { shopid: data.getShop.id })}>
                  ดูเพิ่มเติม
                </Button>
              )
              : null
          }
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
  divider: {
    marginVertical: 10
  },
  topBox: {
    flexDirection: 'column',
    marginTop: 7,
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  bottomView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bigImage: {
    height: height * 0.35,
  },
  detailView: {
    paddingHorizontal: 20
  },
  topMargin: {
    marginTop: 7
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoText: {
    marginLeft: 20
  },
  aboutRow: {
    flexDirection: 'row',
    paddingVertical: 5
  },
  opentime: {
    padding: 0
  },
  openTimeItem: {
    paddingHorizontal: 40
  },
  map: {
    height: height * 0.2,
    width: width * 0.85,
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  smallImage: {
    width: width * 0.325,
    height: width * 0.325,
    borderRadius: 1,
    margin: 1
  },
  imageView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 7
  },
  ratingPercentage: {
    flex: 2
  },
  ratingNumber: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  percentBar: {
    height: 8,
    backgroundColor: iOSColors.lightGray2
  },
  percentBarContainer: {
    width: '90%',
    paddingLeft: 10
  },
  voteCountText: {
    color: iOSColors.gray,
    textDecorationLine: 'underline'
  },
  starButtonContainer: {
    width: 200,
    marginTop: 15
  },
  rippleButton: {
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  fullRippleButton: {
    flex: 1,
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  followButtonText: {
    fontSize: 20
  },
  topFollowButton: {
    height: 46,
    marginVertical: 5
  },
})

export default ShopScreen;