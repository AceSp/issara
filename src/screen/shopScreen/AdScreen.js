import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import {
  Icon,
  Avatar,
  Overlay
} from 'react-native-elements';
import {
  List, 
  Card, 
  TouchableRipple
} from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client';
import { materialTall, iOSColors } from 'react-native-typography';

import Sponsor from '../../component/FeedCard/Sponsor';
import FeedCard from '../../component/FeedCard/FeedCard';
import PromoteCard from '../../component/FeedCard/PromoteCard';

const AdScreen = (props) => {

  const { 
    shopParam,
    productParam,
    tambonParam,
    amphoeParam,
    changwatParam,
    regionParam,
    phraseParam,
    descriptionParam,
    isProduct,
  } = props.route.params;

  return (
      <ScrollView>
        <View style={styles.Root}>
            <Text style={materialTall.headline}>เลือกรูปแบบการโฆษณาของคุณ</Text>
              <Card 
                style={styles.optionCard}
                onPress={() => props.navigation.navigate('CreateSponsor', {
                  shopParam: shopParam,
                  productParam: productParam,
                  tambonParam: tambonParam,
                  amphoeParam: amphoeParam,
                  changwatParam: changwatParam,
                  regionParam: regionParam,
                  phraseParam: phraseParam,
                  descriptionParam: descriptionParam,
                  isProduct: isProduct,
                })}>
                <Sponsor product={productParam} shop={shopParam} text={phraseParam} />
                <Card.Content>
                  <Text style={materialTall.titleWhite}>สนับสนุนคอลัมน์</Text>
                  <Text style={materialTall.subheadingWhite}>ราคา 3 บาท/หนึ่งพันการมองเห็น</Text>
                </Card.Content>
              </Card>
              <Card 
                style={styles.optionCard}
                onPress={() => props.navigation.navigate('CreatePromote', {
                  shopParam: shopParam,
                  productParam: productParam,
                  tambonParam: tambonParam,
                  amphoeParam: amphoeParam,
                  changwatParam: changwatParam,
                  regionParam: regionParam,
                  phraseParam: phraseParam,
                  descriptionParam: descriptionParam,
                  isProduct: isProduct,
                })}>
                <PromoteCard
                  title
                />
                <FeedCard 
                  postInfo={{
                    title: shopParam? shopParam.itemName : productParam?.itemName,
                    text: descriptionParam,
                  }}
                  shop={shopParam}
                  product={productParam}
                />
                <Card.Content>
                  <Text style={materialTall.titleWhite}>สนับสนุนแอพ</Text>
                  <Text style={materialTall.subheadingWhite}>ราคา 30 บาท/หนึ่งพันการมองเห็น</Text>
                </Card.Content>
              </Card>   
        </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  Root: {
    alignItems: 'stretch',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'white'
  },
  optionCard: {
    marginVertical: 10,
    padding: 5,
    backgroundColor: iOSColors.orange
  }
})

export default AdScreen;