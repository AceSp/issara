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
} from 'react-native';
import {
  Card,
  Divider,
  Avatar,
  Button
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

import FeedCardHeader from './FeedCardHeader';
import FeedCardBottom from './FeedCardBottom';
import Sponsor from './Sponsor';
import RenderHTML from '../RenderHTML';
// import AdmobSponsor from './AdmobSponsor';
// import PromoteCard from './PromoteCard';
import APPROVE_GROUP_POST_MUTATION from '../../graphql/mutations/approveGroupPost';
import SET_POST_OFFLINE_MUTATION from '../../graphql/mutations/setPostOffline';
import REPORT_POST_MUTATION from '../../graphql/mutations/reportPost';
import { iOSUIKitTall } from 'react-native-typography';
import { VideoPlayer } from '../Video/views/index';

const { height, width } = Dimensions.get('screen');
const msInDay = 86400000;

// create this enum when change to typescript
// enum reason {
//     spam,
//     fakeNews,
//     wrongCategory
// }

function FeedCard(props) {
  const [setPostOffline, { data: setOffline_data }] = useMutation(SET_POST_OFFLINE_MUTATION);
  const [report, { data: report_data }] = useMutation(REPORT_POST_MUTATION);

  function reportPost(reason) {
    report({
      variables: {
        pk: props.postInfo.author.id,
        id: props.postInfo.id,
        reason: reason
      }
    })
  }

  return (
    <Card
      onPress={() => props.navigation.navigate('Detail', {
        postId: props.postInfo.id,
        postData: { postInfo: props.postInfo, relation: props.relation },
        sponsorData: props.sponsor ? { ...props.sponsor } : null,
        sponsorId: props.sponsor ? props.sponsor.id : null,
      })}
      style={{ marginTop: 5, width: width }}>
      <FeedCardHeader
        author={props.postInfo.author}
        createdAt={props.postInfo.createdAt}
        navigation={props.navigation}
        me={props.me}
      />
      <Divider />
      {/* <RenderHTML html={props.postInfo.text} /> */}
      <Text>
        {props.postInfo.text}
      </Text>
      <VideoPlayer
        key={0}
        uri={props.postInfo.video}
      />
      {/* { props.sponsor
        ? <Sponsor navigation={props.navigation} {...props.sponsor} />
        : null
      }  */}
      {/* <AdmobSponsor /> */}
      {
        props.relation !== undefined &&
        <FeedCardBottom
          sponsorId={props.sponsor ? props.sponsor.id : null}
          postInfo={props.postInfo}
          relation={props.relation}
          relationId={props.relation?.id}
          likeCount={props.postInfo.likeCount}
          isLiked={props.relation?.isLiked}
          isCoined={props.relation?.isCoined}
          isSaved={props.relation?.isSaved}
          coinCount={props.postInfo.coinCount}
          commentCount={props.postInfo.commentCount}
          text={props.postInfo.text}
          author={props.postInfo.author}
          createdAt={props.postInfo.createdAt}
          userCoinCount={props.relation?.userCoinCount}
          comeFromGroup={props.comeFromGroup}
          navigation={props.navigation}
        />
        }  
    </Card>
  )
}

const styles = StyleSheet.create({
  name: {
    backgroundColor: 'red'
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  video: {
    width: width,
    height: 500,
    position: 'relative'
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  reportButton: {
    borderRadius: 50
  },
  reportView: {
    padding: 4
  }
})

export default memo(FeedCard);

