import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  StyleSheet
} from 'react-native';
import {
  FAB,
  Searchbar
} from 'react-native-paper';
import {
  Icon
} from 'react-native-elements';
import { useQuery, useMutation, useLazyQuery } from '@apollo/client';

import GET_SHOPS_QUERY from '../../graphql/queries/getShops';
import SEARCH_SHOPS_QUERY from '../../graphql/queries/searchShops';
import Loading from '../../component/Loading';
import GET_ME_QUERY from '../../graphql/queries/getMe';
import ShopFeedHeader from './component/ShopFeedHeader';
import ShopCard from './component/ShopCard';
import PlaceholderProductFeed from '../../component/FeedCard/PlaceholderProductFeed';
import createShop from '../../graphql/mutations/createShop';
import SearchHeader from '../SearchScreen/SearchHeader';

const ShopFeedScreen = (props) => {

  // const { 
  //   cateParam, 
  //   typeParam
  // } = props.route.params;
  const naviParam = props.route.params;

  const [ haveStoreFront, setHaveStoreFront ] = useState(true);
  const [ haveOnline, setHaveOnline ] = useState(true);
  const [ tambon, setTambon ] = useState('');
  const [ amphoe, setAmphoe ] = useState('');
  const [ changwat, setChangwat ] = useState('');
  const [searchText, setSearchText] = useState('');

  const [ sellVisible, setSellVisible ] = useState(true);

  const _listViewOffset = useRef(0);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_SHOPS_QUERY);
  const [
    searchShops, 
    { 
      loading: search_loading, 
      error: search_error, 
      data: search_data, 
      fetchMore: search_fetchMore, 
      refetch: search_refetch, 
      networkStatus: search_networkStatus 
    }
  ] = useLazyQuery(SEARCH_SHOPS_QUERY);
 
  const flatlistRef = useRef();

  useEffect(() => {
    try {
      if(naviParam?.shopVariable)
        createShop({
          variables: {
            ...naviParam?.shopVariable
          }
        })
    } catch (error) {
      console.log('at Market => backgroundUpload');
      console.log(error)
    }

  }, [naviParam?.productVariable, naviParam?.shopVariable]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
    });

    return unsubscribe;
  }, [props.navigation]);

  function loadMore() {
      fetchMore({
        variables: { 
          cursor: data.getShops.pageInfo.endCursor,
          haveOnline,
          haveStoreFront,
          tambon,
          amphoe,
          changwat
         },
         updateQuery: (previousResult, { fetchMoreResult }) => {
          const newShops = fetchMoreResult.getShops.shops;
          const pageInfo = fetchMoreResult.getShops.pageInfo;

          return newShops.length
            ? {
                getShops: {
                  __typename: previousResult.getShops.__typename,
                  shops: [...previousResult.getShops.shops, ...newShops],
                  pageInfo
                }
              }
            : previousResult;
        }
      });  
  }

  function searchMore() {
      search_fetchMore({
        variables: { 
          searchTerm: searchText,
          skip: search_data.searchShops.pageInfo.skip
         },
         updateQuery: (previousResult, { fetchMoreResult }) => {
          const newShops = fetchMoreResult.searchShops.shops;
          const pageInfo = fetchMoreResult.searchShops.pageInfo;

          return newShops.length
            ? {
                searchShops: {
                  __typename: previousResult.searchShops.__typename,
                  shops: [...previousResult.searchShops.shops, ...newShops],
                  pageInfo
                }
              }
            : previousResult;
        }
      });  
  }

  function onEndReached() {
    if(searchText.length > 0) {
      if(search_data.searchShops.pageInfo.hasNextPage)
        return searchMore();
      else return null;
    }
    if(data.getShops.pageInfo.hasNextPage)
      return loadMore();
    else return null;
  }

  _onScroll = (event) => {
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

  if(searchText.length > 0) {
    if (search_loading) return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2'}}>
        <View style={styles.searchBarContainer}>
          <Searchbar 
            style={styles.searchBar}
            inputStyle={styles.searchBarInput}
            value={searchText}
            onChangeText={(value) => setSearchText(value)}
            onBlur={() => searchShops({ variables: { searchTerm: searchText } })}
          />
        </View>
        <Loading />
      </View>
    )
    if (search_error) return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2'}}>
        <View style={styles.searchBarContainer}>
          <Searchbar 
            style={styles.searchBar}
            inputStyle={styles.searchBarInput}
            value={searchText}
            onChangeText={(value) => setSearchText(value)}
            onBlur={() => searchShops({ variables: { searchTerm: searchText } })}
          />
        </View>
        <Text>`Error! ${search_error.message}`</Text>
      </View>
    )
  }
  if (loading) return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2'}}>
      <View style={styles.searchBarContainer}>
        <Searchbar 
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          value={searchText}
          onChangeText={(value) => setSearchText(value)}
          onBlur={() => searchShops({ variables: { searchTerm: searchText } })}
        />
      </View>
      <Loading />
    </View>
  )
  if (error) return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2'}}>
      <View style={styles.searchBarContainer}>
        <Searchbar 
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          value={searchText}
          onChangeText={(value) => setSearchText(value)}
          onBlur={() => searchShops({ variables: { searchTerm: searchText } })}
        />
      </View>
      <Text>`Error! ${error.message}`</Text>
    </View>
  )

  const _renderItem = ({ item }) =>  <ShopCard {...item} navigation={props.navigation} />

  return (
    <View style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
    }}>
      <View style={styles.searchBarContainer}>
        <Searchbar 
          style={styles.searchBar}
          inputStyle={styles.searchBarInput}
          value={searchText}
          onChangeText={(value) => setSearchText(value)}
          onBlur={() => searchShops({ variables: { searchTerm: searchText } })}
        />
      </View>
      <FlatList
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={searchText.length > 0 ? search_data.searchShops.shops : data.getShops.shops}
        keyExtractor={item => item.id}
        getItemLayout={(data, index) => (
          {length: 180, offset: 180 * index, index}
        )}
        renderItem={_renderItem}
        onEndReachedThreshold={0.9}
        onEndReached={onEndReached}
        ref={flatlistRef}
        onScroll={_onScroll}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    searchBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
      height: 50,
      backgroundColor: 'white',
    },
    searchBar: {
      flex: 1,
      height: 36,
    },
    searchBarInput: {
      alignSelf: 'center',
    },
})

export default ShopFeedScreen;
