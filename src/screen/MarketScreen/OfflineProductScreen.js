import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
    List,
    Text,
    Divider
} from 'react-native-paper';

import GET_MY_OFFLINE_PRODUCTS from '../../graphql/queries/getMyOfflineProduct';
import { iOSColors, materialTall } from 'react-native-typography';
import Loading from '../../component/Loading';
import { useQuery } from '@apollo/client';
import ProductCard from './Component/ProductCard';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const OfflineProductScreen = (props) => {

  const { loading, error, data } = useQuery(GET_MY_OFFLINE_PRODUCTS);

  const renderChecking = () => {
    let arr = [];
    for(const c of data.getMyOfflineProducts) {
        if(c.status === 'checking') arr.push(
        <ProductCard key={c.id} {...c} navigation={props.navigation} />
      )
    }
    return arr;
  }

  const renderPaying = () => {
    let arr = [];
    for(const c of data.getMyOfflineProducts) {
        if(c.status === 'paying') arr.push(
        <ProductCard key={c.id} {...c} navigation={props.navigation} />
      )
    }
    return arr;
  }

  const renderEditing = () => {
    let arr = [];
    for(const c of data.getMyOfflineProducts) {
        if(c.status === 'editing') arr.push(
        <ProductCard key={c.id} {...c} navigation={props.navigation} />
      )
    }
    return arr;
  }

  const renderExpired = () => {
    let arr = [];
    for(const c of data.getMyOfflineProducts) {
        if(c.status === 'expired') arr.push(
        <ProductCard key={c.id} {...c} navigation={props.navigation} />
      )
    }
    return arr;
  }

  const renderRejected = () => {
    let arr = [];
    for(const c of data.getMyOfflineProducts) {
        if(c.status === 'rejected') arr.push(
        <ProductCard key={c.id} {...c} navigation={props.navigation} />
      )
    }
    return arr;
  }

  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  return (
    <View style={styles.Root}>
      <ScrollView style={{alignSelf: 'stretch'}}>
          {renderChecking().length === 0? null :
            <List.Section>
              <List.Subheader style={materialTall.title} >กำลังตรวจสอบ</List.Subheader>
              <Divider />
                {renderChecking()}
            </List.Section>
          }
          {renderPaying().length === 0? null :
            <List.Section>
              <List.Subheader style={materialTall.title} >รอการชำระเงิน</List.Subheader>
              <Divider />
                {renderPaying()}
            </List.Section>
          }
          {renderEditing().length === 0? null :
            <List.Section>
              <List.Subheader style={materialTall.title} >รอการแก้ไข</List.Subheader>
              <Divider />
                {renderEditing()}
            </List.Section>
          }
          {renderExpired().length === 0? null :
            <List.Section>
              <List.Subheader style={materialTall.title} >หมดอายุ</List.Subheader>
              <Divider />
                {renderExpired()}
            </List.Section>
          }
          {renderRejected().length === 0? null :
            <List.Section>
              <List.Subheader style={materialTall.title} >ไม่ผ่านการตรวจสอบ</List.Subheader>
              <Divider />
                {renderRejected()}
            </List.Section>
          }
      </ScrollView>
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
    alignItems: 'center'
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  directionText: {
      flex: 1,
      flexWrap: 'wrap',
      marginRight: 10
  },
  cateText: {
    marginLeft: 25,
    fontSize: 25,
    fontWeight: 'bold'
  },
  catePic: {
    width: width*0.27,
    height: width*0.27,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: iOSColors.midGray,
    justifyContent: 'center'
  },
  cateView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  itemView: {
    alignItems: 'center',
    marginTop: 20,
    width: width*0.3
  },
  nameText: {
    fontSize: 18,
    marginTop: 5
  },
  order: {
      marginHorizontal: 20
  }
})

export default OfflineProductScreen;