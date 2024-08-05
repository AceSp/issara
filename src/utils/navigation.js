import React, { useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text
} from 'react-native';
import { Icon } from 'react-native-elements';
import F5Icon from 'react-native-vector-icons/FontAwesome5';
import { HeaderBackButton } from '@react-navigation/stack';
import { 
  iOSColors
} from 'react-native-typography';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchScreen from '../screen/SearchScreen/SearchScreen';
import PostVideoScreen from '../screen/PostVideoScreen';
import MenuScreen from '../screen/MenuScreen/MenuScreen';
import NotificationScreen from '../screen/Notification/NotificationScreen';
import PostScreen from '../screen/PostScreen/PostScreen';
import NewFeedScreen from '../screen/FeedTab/NewFeedScreen';
import NewsFeedScreen from '../screen/FeedTab/NewsFeedScreen';
import MoreCommentScreen from '../screen/commentScreen/MoreCommentScreen';
import RegisterScreen from '../screen/RegisterScreen';
import LoginScreen from '../screen/LoginScreen';
import { colors } from './constants';
import MyProfileScreen from '../screen/ProfileScreen/MyProfileScreen';
import BuyCoinScreen from '../screen/BuyCoinScreen';
import DetailScreen from '../screen/commentScreen/DetailScreen';
import MoreReplyScreen from '../screen/commentScreen/MoreReplyScreen';
import MarketScreen from '../screen/MarketScreen/MarketScreen';
import CategoryScreen from '../screen/categoryScreen/CategoryScreen';
import NewsCategoryScreen from '../screen/categoryScreen/NewsCategoryScreen';
import PostCategoryScreen from '../screen/categoryScreen/PostCategoryScreen';
import PostNewsCateScreen from '../screen/categoryScreen/PostNewsCateScreen';
import NewsPostScreen from '../screen/PostScreen/NewsPostScreen';
import SearchHeader from '../component/SearchHeader';
import FollowingListScreen from '../screen/FollowingScreen/FollowingListScreen';
import UserProfileScreen from '../screen/ProfileScreen/UserProfileScreen';
import UserPostScreen from '../screen/PostScreen/UserPostScreen';
import CreateAltScreen from '../screen/ProfileScreen/CreateAltScreen';
import EditUserScreen from '../screen/ProfileScreen/EditUserScreen';
import ProductFeedScreen from '../screen/MarketScreen/ProductFeedScreen';
import ProductOptionScreen from '../screen/MarketScreen/ProductOptionScreen';
import PostProductPictureScreen from '../screen/MarketScreen/PostProductPictureScreen';
import PostProductDetailScreen from '../screen/MarketScreen/PostProductDetailScreen';
import ProductScreen from '../screen/MarketScreen/ProductScreen';
import OnlineProductScreen from '../screen/MarketScreen/OnlineProductScreen';
import OfflineProductScreen from '../screen/MarketScreen/OfflineProductScreen';
import MapScreen from '../screen/MapScreen';
import ShopFeedScreen from '../screen/shopScreen/ShopFeedScreen';
import ShopScreen from '../screen/shopScreen/ShopScreen';
import ReviewScreen from '../screen/shopScreen/ReviewScreen';
import ShopImageScreen from '../screen/shopScreen/ShopImageScreen';
import PostShopPictureScreen from '../screen/shopScreen/PostShopPictureScreen';
import PostShopDetailScreen from '../screen/shopScreen/PostShopDetailScreen';
import EditShopScreen from '../screen/shopScreen/EditShopScreen';
import AdScreen from '../screen/shopScreen/AdScreen';
import CreateSponsorScreen from '../screen/shopScreen/CreateSponsorScreen';
import ManageShopScreen from '../screen/shopScreen/ManageShopScreen';
import UpdateSponsorScreen from '../screen/shopScreen/UpdateSponsorScreen';
import CreatePromoteScreen from '../screen/shopScreen/CreatePromoteScreen';
import UpdatePromoteScreen from '../screen/shopScreen/UpdatePromoteScreen';
import ManageAdScreen from '../screen/MenuScreen/ManageAdScreen';
import NotificationIconWithBadge from '../component/IconWithBadge/IconWithBadge';
import NoMatchScreen from '../screen/NoMatchScreen';
import PostHeader from '../screen/PostScreen/PostHeader';
import CameraRollPictureScreen from '../screen/CameraRollPictureScreen';
import ForgotPasswordScreen from '../screen/ForgotPasswordScreen';
import ResetPasswordScreen from '../screen/ResetPasswordScreen';
import ChatScreen from '../screen/ChatScreen/ChatScreen';
import ChatRoomScreen from '../screen/ChatScreen/ChatRoomScreen';
import NewChatRoomScreen from '../screen/ChatScreen/NewChatRoomScreen';
import ShopCategoryScreen from '../screen/shopScreen/ShopCategoryScreen';
import MyShopScreen from '../screen/shopScreen/MyShopScreen';
import ContestFeedScreen from '../screen/FeedTab/ContestFeedScreen';
import QuestionScreen from '../screen/QuestionScreen';
import ChoosePaymentScreen from '../screen/PaymentScreen/Component/ChoosePaymentModal';
import QRCodeScreen from '../screen/PaymentScreen/QRCodeScreen';
import ShopVideoScreen from '../screen/shopScreen/ShopVideoScreen';
import UserIncomeScreen from '../screen/ProfileScreen/UserIncomeScreen';
import ShareAppScreen from '../screen/MenuScreen/ShareAppScreen';
import GroupScreen from '../screen/GroupScreen/GroupScreen';
import JobFeedScreen from '../screen/FeedTab/JobFeedScreen';
import JobDetailScreen from '../screen/commentScreen/JobDetailScreen';
import PostJobDetailScreen from '../screen/JobScreen/PostJobDetailScreen';
import PostJobPictureScreen from '../screen/JobScreen/PostJobPictureScreen';
import FollowedListScreen from '../screen/GroupScreen/FollowedListScreen';
import GokgokgokLogo from '../assets/Images/gokgokgokLogo'

const BTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const styles = StyleSheet.create({
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: 'center',
    width: 130
  },
});

function BottomTab(props) {
  return (
    <BTab.Navigator
      screenOptions={{
        headerShow: false
      }}
    >
      <BTab.Screen
        name="NewFeed"
        component={NewFeedScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'หน้าแรก',
          tabBarIcon: ({ color: tintColor }) => (
            <Icon 
              name="home"
              color={tintColor}
              type="material-community"
            />
          )
        }}
      />
      <BTab.Screen
        name="Job"
        component={JobFeedScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'งาน',
          tabBarIcon: ({ color: tintColor }) => (
            <Icon 
              name="account-tie"
              color={tintColor}
              type="material-community"
            />
          )
        }}
      />
      <BTab.Screen
        name="Market"
        component={ShopFeedScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'สินค้า',
          tabBarIcon: ({ color: tintColor }) => (
            <Icon 
              type="font-awesome"
              name="shopping-basket"
              color={tintColor}
            />
          )
        }}
      />
      <BTab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'ตัวเลือก',
          tabBarIcon: ({ color: tintColor }) => (
            <Icon name="menu"
              color={tintColor}
              size={35}
              iconStyle={{ marginBottom: 20 }}
            />
          )
        }}
        changeLogin={props.changeLogin} />

    </BTab.Navigator>
  )
}

function MyProductTopTab(props) {
  return (
    <BTab.Navigator
      screenOptions={{
        showLabel: true,
        activeTintColor: colors.PRIMARY,
        inactiveTintColor: colors.LIGHT_GRAY,
        indicatorStyle: { backgroundColor: colors.PRIMARY },
        style: {
          height: 50,
          overflow: 'hidden',
          marginTop: 0
        },
      }}
    >
      <BTab.Screen
        name="OnlineProduct"
        component={OnlineProductScreen}
        options={{
          tabBarLabel: 'ออนไลน์'
        }}
      />
      <BTab.Screen
        name="OfflineProduct"
        component={OfflineProductScreen}
        options={{
          tabBarLabel: 'ออฟไลน์'
        }}
      />
    </BTab.Navigator>
  )
}

function YourShopTopTab(props) {
  return (
    <BTab.Navigator
      screenOptions={{
        showLabel: true,
        activeTintColor: colors.PRIMARY,
        inactiveTintColor: colors.LIGHT_GRAY,
        indicatorStyle: { backgroundColor: colors.PRIMARY },
        style: {
          height: 50,
          overflow: 'hidden',
          marginTop: 0
        },
      }}
    >
      <Stack.Screen
        name="OnlineProduct"
        component={OnlineProductScreen}
        options={{
          tabBarLabel: 'ออนไลน์'
        }}
      />
      <Stack.Screen
        name="OfflineProduct"
        component={OfflineProductScreen}
        options={{
          tabBarLabel: 'ออฟไลน์'
        }}
      />
    </BTab.Navigator>
  )
}

export function MainStack(props) {
  return (
    <Stack.Navigator
      initialRouteName='Main'
    >
      <Stack.Screen
        name="Main"
        component={BottomTab}
        options={{headerShown: false}}
        // component={ShareAppScreen}

        // options={({ navigation }) => ({
        //   // title: 'Padjai',
        //   // headerTitleStyle: {
        //   //   color: colors.PRIMARY,
        //   //   fontFamily: 'AbrilFatface-Regular',
        //   //   fontSize: 30,
        //   // },
        //   headerTitle: () => (
        //     <GokgokgokLogo
        //       width={175}
        //       height={50}
        //     />
        //   ),
        //   headerRight: () => (
        //     <View style={styles.iconContainer}>
        //       <TouchableOpacity onPress={() => navigation.navigate('Search')}>
        //         <Icon size={35} name='search' />
        //       </TouchableOpacity>
        //       <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
        //         <Icon size={30} name='chatbubble-ellipses-outline' type="ionicon"/>
        //       </TouchableOpacity>
        //       <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
        //         <NotificationIconWithBadge size={30} name='notifications-none'/>
        //       </TouchableOpacity>
        //     </View>
        //   )
        // })}
      />
      <Stack.Screen
        name="Question"
        component={QuestionScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ManageAd"
        component={ManageAdScreen}
        // options={({ navigation }) => ({
        //   headerLeft: (props) => (
        //     <HeaderBackButton
        //       {...props}
        //       onPress={() => navigation.navigate('Menu')}
        //     />
        //   ),
        // })}
      />
      <Stack.Screen
        name="QRCode"
        component={QRCodeScreen}
      />
      <Stack.Screen
        name="Subscription"
        component={GroupScreen}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CameraRollPicture"
        component={CameraRollPictureScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />
      <Stack.Screen
        name="NewsCategory"
        component={NewsCategoryScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />
      <Stack.Screen
        name="PostCategory"
        component={PostCategoryScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />
      <Stack.Screen
        name="NewsPostCate"
        component={PostNewsCateScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalPresentationIOS
        }}
      />
      <Stack.Screen 
        name="MyProfile" 
        component={MyProfileScreen} 
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfileScreen}
      />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
      {/* <Stack.Screen name="CreateAlt" component={CreateAltScreen}/> */}
      <Stack.Screen name="FollowingList" component={FollowedListScreen} />
      <Stack.Screen name="Ad" component={AdScreen} />
      <Stack.Screen
        name="ManageShop"
        component={ManageShopScreen}
        options={({ navigation }) => ({
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              onPress={() => navigation.navigate('Shop')}
            />
          ),
        })}
      />
      <Stack.Screen name="CreateSponsor" component={CreateSponsorScreen} />
      <Stack.Screen name="UpdateSponsor" component={UpdateSponsorScreen} />
      <Stack.Screen name="CreatePromote" component={CreatePromoteScreen} />
      <Stack.Screen name="UpdatePromote" component={UpdatePromoteScreen} />
      <Stack.Screen name="ShopFeed" component={ShopFeedScreen} />
      <Stack.Screen name="Shop" component={ShopScreen} />
      <Stack.Screen name="EditShop" component={EditShopScreen} />
      <Stack.Screen name="ShopImage" component={ShopImageScreen} />
      <Stack.Screen name="ShopVideo" component={ShopVideoScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen
        name="PostShopPicture"
        component={PostShopPictureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PostShopDetail" component={PostShopDetailScreen} />
      <Stack.Screen
        name="ProductFeed"
        component={ProductFeedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Product"
        component={ProductScreen}
      />
      <Stack.Screen name="MyProduct" component={MyProductTopTab} />
      <Stack.Screen name="MyShop" component={MyShopScreen} />
      <Stack.Screen name="ProductOption" component={ProductOptionScreen} />
      <Stack.Screen
        name="PostProductPicture"
        component={PostProductPictureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PostProductDetail" component={PostProductDetailScreen} />
      <Stack.Screen
        name="PostJobPicture"
        component={PostJobPictureScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PostJobDetail" component={PostJobDetailScreen} />
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PostVideo" component={PostVideoScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Stack.Screen name="NewChatRoom" component={NewChatRoomScreen} />
      <Stack.Screen name="BuyCoin" component={BuyCoinScreen} />
      <Stack.Screen name="UserIncome" component={UserIncomeScreen} />
      <Stack.Screen name="ShareApp" component={ShareAppScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      <Stack.Screen name="MoreComment" component={MoreCommentScreen} />
      <Stack.Screen name="MoreReply" component={MoreReplyScreen} />
      <Stack.Screen name="Nomatch" component={NoMatchScreen} />
    </Stack.Navigator>
  );
}

export function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Register', headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Login', headerShown: false }}
      />
      <Stack.Screen 
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'ลืมรหัสผ่าน' }}
      />
      <Stack.Screen 
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ title: 'แก้ไขรหัสผ่าน' }}
      />
    </Stack.Navigator>
  );
}
