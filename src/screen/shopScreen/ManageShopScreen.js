
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList
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
  Divider
} from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client';
import { materialTall, iOSColors } from 'react-native-typography';
// import BackgroundUpload from 'react-native-background-upload';

import GET_SHOP_ADS_QUERY from '../../graphql/queries/getShopAds';
import CREATE_PROMOTE_MUTATION from '../../graphql/mutations/createPromote';
import Sponsor from '../../component/FeedCard/Sponsor';
import FeedCard from '../../component/FeedCard/FeedCard';
import Loading from '../../component/Loading';
import AdCard from '../../component/AdCard';

const Header = ({ isAdmin }) => {
  return(
    <View>
      {isAdmin &&
      <TouchableOpacity style={styles.menuRow}>
        <View style={styles.icon}>
            <Icon 
            size={30}
            color={iOSColors.gray}
            type="material-community"
            name="account-edit"
            />
        </View>
        <Text style={materialTall.button}>จัดการหน้าที่</Text>
      </TouchableOpacity>
     
      }
      <Divider style={{ backgroundColor: 'black' }} />
      <View style={styles.adView}>
          <Text style={materialTall.headline}>จัดการโฆษณา</Text>
      </View>
    </View>
  )
}

const ManageShopScreen = (props) => {

  const { 
    shopParam,
    isAdmin,
    textParam,
    uploadIdArr,
    mediaName,
    budget,
    target,
    tambon,
    amphoe,
    changwat,
    region
  } = props.route.params;

  const [uploadProgress, setUploadProgress] = useState(-1);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_SHOP_ADS_QUERY,
    {
      variables: { shopId: shopParam.id }
    } 
    );
  
  const [createPromote, {
    data: create_promote_data, 
    loading: create_promote_loading, 
    error: create_promote_error
  }] = useMutation(CREATE_PROMOTE_MUTATION);

  // useEffect(() => {
  //   console.log('start')
  //   if (uploadIdArr) {

  //     if(uploadIdArr.length === 0) {
  //       submit();
  //     }

  //     let progresses = [];
  //     let uploadFinished = 0;
  //     for (let [index, uploadId] of uploadIdArr.entries()) {
  //       progresses.push(0);
  //       BackgroundUpload.addListener('progress', uploadId, (data) => {
  //         // console.log(`Progress: ${data.progress}%`)
  //         progresses[index] = data.progress;
  //         setUploadProgress(Math.min(...progresses));
  //       })
  //       BackgroundUpload.addListener('error', uploadId, (data) => {
  //         console.log(`Error: ${data.error}%`)
  //       })
  //       BackgroundUpload.addListener('cancelled', uploadId, (data) => {
  //         console.log(`Cancelled!`)
  //       })
  //       BackgroundUpload.addListener('completed', uploadId, (data) => {
  //         // data includes responseCode: number and responseBody: Object
  //         uploadFinished++;
  //         if(uploadFinished === uploadIdArr.length) {
  //           submit();
  //           setUploadProgress(-1);
  //         }
  //         console.log('Completed!');
  //       });
  //     }
  //   }
  // }, [uploadIdArr]);

  function submit() {
    console.log(textParam)
      createPromote({
          variables: {
              text: textParam,
              shop: shopParam,
              budget,
              mediaName: mediaName,
              tambon: target === 1? tambon : null,
              amphoe: target === 2? amphoe : null,
              changwat: target === 3? changwat : null,
              region: target === 4? region: null,
              all: target === 5? true : null
          },
          optimisticResponse: {
              __typename: 'Mutation',
              createPromote: {
                  __typename: 'Ad',
                  pk: Math.round(Math.random()* -1000000).toString(),
                  id: Math.round(Math.random()* -1000000).toString(),
                  isPromote: true,
                  text: textParam,
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
          refetchQueries: [{
              query: GET_SHOP_ADS_QUERY,
              variables: { shopId: shopParam.id }
          }]
      })
  }

  const _renderItem = ({ item }) => <AdCard {...item} navigation={props.navigation} />

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  return (
      <View style={styles.Root}>
          <FlatList
             ListHeaderComponent={<Header isAdmin={isAdmin} />}
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={data.getShopAds}
             keyExtractor={item => item.id}
             renderItem={_renderItem}
             removeClippedSubviews={true}
             refreshing={networkStatus === 4}
             onRefresh={() => refetch()}
          />
      </View>
  )
}

const styles = StyleSheet.create({
  Root: {
    flex: 1,
    backgroundColor: iOSColors.lightGray,
    justifyContent: 'center'
  },
  adView: {
    alignItems: "flex-start", 
    padding: 5,
    paddingLeft: 20,
    backgroundColor: 'white'
  },
  menuRow: {
    flexDirection: 'row',
    //backgroundColor: 'red',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center'
  },
  icon: {
    backgroundColor: iOSColors.lightGray,
    borderRadius: 20,
    padding: 5,
    marginRight: 15
  },
  optionCard: {
    marginVertical: 10,
    padding: 5,
    backgroundColor: iOSColors.orange
  }
})

export default ManageShopScreen;