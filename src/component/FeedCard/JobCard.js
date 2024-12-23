import React,
{
  memo,
  useEffect,
  useRef
} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Image
} from 'react-native';
import {
  Card,
  Divider,
  Avatar,
  Button,
} from 'react-native-paper';
// import NativeAdView, {
//   CallToActionView,
//   IconView,
//   HeadlineView,
//   TaglineView,
//   AdvertiserView,
//   AdBadge,
//   NativeMediaView
// } from 'react-native-admob-native-ads';
import { useMutation } from '@apollo/client';
import Swiper from 'react-native-swiper';

import FeedCardHeader from './FeedCardHeader';
import FeedCardBottom from './FeedCardBottom';
// import Sponsor from './Sponsor';
import RenderHTML from '../RenderHTML';
// import AdmobSponsor from './AdmobSponsor';
// import PromoteCard from './PromoteCard';
import APPROVE_GROUP_POST_MUTATION from '../../graphql/mutations/approveGroupPost';
import SET_POST_OFFLINE_MUTATION from '../../graphql/mutations/setPostOffline';
import REPORT_POST_MUTATION from '../../graphql/mutations/reportPost';
import { iOSUIKitTall } from 'react-native-typography';
import JobCardHeader from './JobCardHeader';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const msInDay = 86400000;

// create this enum when change to typescript
// enum reason {
//     spam,
//     fakeNews,
//     wrongCategory
// }

function JobCard({
  id,
  itemName,
  author,
  detail,
  pictures,
  tag,
  meSaved,
  ratingScore,
  createdAt,
  navigation,
  hideReview,
}) {
  const swiperRef = useRef();
  const imageListRef = useRef();

  const renderBigImage = () => {
    let arr = [];
    for(const [i,p] of pictures.entries()) {
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
      data={pictures} 
      renderItem={renderImageist}
      keyExtractor={(item, index) => index.toString()}
      ref={imageListRef} 
      horizontal
    />
    )
  }

  return (
    <Card
      style={styles.card}>
      <JobCardHeader 
        id={id}
        itemName={itemName}
        tag={tag}
        meSaved={meSaved}
        ratingScore={ratingScore}
        navigation={navigation}
        hideReview={hideReview}
      />
      <Divider />
      <Text style={styles.detail}>
        {detail}
      </Text>
      <Divider />
      {/* <BigImageShow
        // srcList={pictures? pictures : []}
        srcList={srcList}
      /> */}
      <Swiper 
        ref={swiperRef}
        height={height*0.35}
        containerStyle={styles.swiper}
        onIndexChanged={index => {
          if(imageListRef.current)
            imageListRef.current.scrollToIndex({ index: index, viewPosition: 0.5 });
        }}
        // renderPagination={(i) => renderImageIndicator(i)}
      >
        {renderBigImage()}
      </Swiper>
      {/* <View style={styles.bigImageContainer}>
        <Image 
          // source={{ uri: p }} 
          source={{ uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" }} 
          style={styles.bigImage} 
          resizeMode={Image.resizeMode.contain}
        />
      </View> */}
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 5,
    backgroundColor: 'white',
  },
  textContainer: {
  },
  detail: {
    padding: 10,
    fontSize: 16,
    color: 'black',
    lineHeight: 24,
  },
  bigImage: {
    height: height*0.35,
  },
  bigImageContainer: {
    height: height*0.35,
    width: width
  },
})

export default memo(JobCard);


