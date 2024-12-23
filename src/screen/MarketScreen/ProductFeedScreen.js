import React, { 
  useEffect, 
  useState, 
  useRef, 
  useCallback
} from 'react';
import {
  View,
  Text,
  FlatList,
  LayoutAnimation,
  SectionList,
  StyleSheet
} from 'react-native';
import {
  FAB,
} from 'react-native-paper';
import {
  Icon
} from 'react-native-elements';
import { useQuery } from '@apollo/client';

import GET_PRODUCTS_QUERY from '../../graphql/queries/getProducts';
import ProductFeedHeader from './Component/ProductFeedHeader';
import ProductCard from './Component/ProductCard';
import Header from './Component/Header';
import PlaceholderProductFeed from '../../component/FeedCard/PlaceholderProductFeed';
import Loading from '../../component/Loading';
import PromoteCard from '../../component/FeedCard/PromoteCard';

const ProductFeedScreen = (props) => {

  const { 
    cateParam, 
    typeParam,
    brandParam,
    modelParam,
    fuelParam,
    gearParam,
    colorParam,
    memoryParam,
    truckTypeParam,
    jobTypeParam,
    paymentParam,
    minMilesParam,
    maxMilesParam,
    minYearParam,
    maxYearParam,
    bedroomParam,
    bathroomParam,
    minPriceParam,
    maxPriceParam,
    secondHandParam,
    TambonParam,
    amphoeParam,
    changwatParam,
  } = props.route.params;

  const [ category, setCategory ] = useState('');
  const [ type, setType ] = useState('');
  const [ brand, setBrand ] = useState('');
  const [ model, setModel ] = useState('');
  const [ fuel, setFuel ] = useState('');
  const [ gear, setGear ] = useState('');
  const [ color, setColor ] = useState('');
  const [ memory, setMemory ] = useState(0);
  const [ truckType, setTruckType ] = useState('');
  const [ jobType, setJobType ] = useState('');
  const [ payment, setPayment ] = useState('');
  const [ minMiles, setMinMiles ] = useState(null);
  const [ maxMiles, setMaxMiles ] = useState(null);
  const [ minYear, setMinYear ] = useState(null);
  const [ maxYear, setMaxYear ] = useState(null);
  const [ bedroom, setBedroom ] = useState(0);
  const [ bathroom, setBathroom ] = useState(0);
  const [ tambon, setTambon ] = useState('');
  const [ amphoe, setAmphoe ] = useState('');
  const [ changwat, setChangwat ] = useState('');
  const [ minPrice, setMinPrice ] = useState(null);
  const [ maxPrice, setMaxPrice ] = useState(null);
  const [ secondHand, setSecondHand ] = useState(null);

  const [ sellVisible, setSellVisible ] = useState(true);

  const _listViewOffset = useRef(0);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_PRODUCTS_QUERY,
    {
      variables: {
        category: category, 
        type: type,
        brand: brand,
        model: model,
        fuel: fuel,
        gear: gear,
        color: color,
        memory: memory,
        truckType: truckType,
        jobType: jobType,
        payment: payment,
        minMiles: minMiles,
        maxMiles: maxMiles,
        minYear: minYear,
        maxYear: maxYear,
        bedroom: bedroom,
        bathroom: bathroom,
        tambon: tambon,
        amphoe: amphoe,
        changwat: changwat,
        minPrice: minPrice,
        maxPrice: maxPrice,
        secondHand: secondHand
      }
    }
    );
 
  const flatlistRef = useRef();

  useEffect(() => {
    setCategory(cateParam);
    if(typeParam) setType(typeParam);
    if(brandParam) setBrand(brandParam);
    if(modelParam) setModel(modelParam);
    if(fuelParam) setFuel(fuelParam);
    if(gearParam) setGear(gearParam);
    if(colorParam) setColor(colorParam);
    if(memoryParam) setMemory(memoryParam);
    if(truckTypeParam) setTruckType(truckTypeParam);
    if(jobTypeParam) setJobType(jobTypeParam);
    if(paymentParam) setPayment(paymentParam);
    if(minMilesParam) setMinMiles(minMilesParam);
    if(maxMilesParam) setMaxMiles(maxMilesParam);
    if(minYearParam) setMinYear(minYearParam);
    if(maxYearParam) setMaxYear(maxYearParam);
    if(bedroomParam) setBedroom(bedroomParam);
    if(bathroomParam) setBathroom(bathroomParam);
    if(minPriceParam) setMinPrice(minPriceParam);
    if(maxPriceParam) setMaxPrice(maxPriceParam);
    if(secondHandParam) setSecondHand(secondHandParam);
    if(TambonParam) setTambon(TambonParam);
    if(amphoeParam) setAmphoe(amphoeParam);
    if(changwatParam) setChangwat(changwatParam);
  }, [props.route.params]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
  });

    return unsubscribe;
  }, [props.navigation]);

  function loadMore() {
      fetchMore({
        variables: { 
          cursor: data.getProducts.pageInfo.endCursor
          //categoryArr: category
         },
         updateQuery: (previousResult, { fetchMoreResult }) => {
          const newProducts = fetchMoreResult.getProducts.products;
          const pageInfo = fetchMoreResult.getProducts.pageInfo;

          return newProducts.length
            ? {
                // Put the new.products at the end of the list and update `pageInfo`
                // so we have the new `endCursor` and `hasNextPage` values
                getProducts: {
                  __typename: previousResult.getProducts.__typename,
                  products: [...previousResult.getProducts.products, ...newProducts],
                  pageInfo
                }
              }
            : previousResult;
        }
      });  
  }

  const _renderSectionHeader = useCallback(
    ({ section }) => <PromoteCard
      {...section.promote}
      navigation={props.navigation}
    />
  )

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

  // if (loading) return <PlaceholderProductFeed />
  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>

  const _renderItem = ({ item }) =>  <ProductCard {...item} navigation={props.navigation} />

  return (
    <View style={{
        flex: 1,
        backgroundColor: '#f2f2f2',
        //backgroundColor: 'white'
    }}>
      <Header 
        category={category}
        type={type}
        tambon={tambon}
        amphoe={amphoe}
        changwat={changwat} 
        navigation={props.navigation}
        setCategory={setCategory}
        setType={setType}
        setBrand={setBrand}
        setModel={setModel}
        setFuel={setFuel}
        setGear={setGear}
        setColor={setColor}
        setMemory={setMemory}
        setTruckType={setTruckType}
        setJobType={setJobType}
        setPayment={setPayment}
        setMinMiles={setMinMiles}
        setMaxMiles={setMaxMiles}
        setMinYear={setMinYear}
        setMaxYear={setMaxYear}
        setBedroom={setBedroom}
        setBathroom={setBathroom}
        setTambon={setTambon}
        setAmphoe={setAmphoe}
        setChangwat={setChangwat}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        setSecondHand={setSecondHand} 
      />
        <SectionList
          ListHeaderComponent={
            <ProductFeedHeader 
              tambon={tambon}
              amphoe={amphoe}
              changwat={changwat}
              setTambon={setTambon}
              setAmphoe={setAmphoe}
              setChangwat={setChangwat}
              type={type}
              setType={setType}
              category={category}
              setCategory={setCategory}
            />
          }
          contentContainerStyle={{ alignSelf: 'stretch' }}
          sections={data.getProducts.sections}
          getItemLayout={(data, index) => (
            {length: 200, offset: 200 * index, index}
          )}
          renderItem={_renderItem}
          renderSectionFooter={_renderSectionHeader}
          keyExtractor={item => item.id}
          onEndReachedThreshold={0.5}
          onEndReached={data.getProducts.pageInfo.hasNextPage? loadMore() : null}
          removeClippedSubviews={true}
          refreshing={networkStatus === 4}
          onRefresh={refetch}
          ref={flatlistRef}
          onScroll={_onScroll}
        />
        {/* <FlatList
             ListHeaderComponent={
                <ProductFeedHeader 
                  tambon={tambon}
                  amphoe={amphoe}
                  changwat={changwat}
                  setTambon={setTambon}
                  setAmphoe={setAmphoe}
                  setChangwat={setChangwat}
                  type={type}
                  setType={setType}
                  category={category}
                  setCategory={setCategory}
                />
             }
             contentContainerStyle={{ alignSelf: 'stretch' }}
             data={data.getProducts.products}
             keyExtractor={item => item.id}
             getItemLayout={(data, index) => (
              {length: 200, offset: 200 * index, index}
            )}
             renderItem={_renderItem}
             onEndReachedThreshold={0.9}
             onEndReached={() =>data.getProducts.pageInfo.hasNextPage? loadMore() : null}
             removeClippedSubviews={true}
             refreshing={networkStatus === 4}
             onRefresh={() => refetch()}
             ref={flatlistRef}
             onScroll={_onScroll}
        /> */}
        {sellVisible ? 
          <FAB
            onPress={() => props.navigation.navigate('PostProductPicture')}
            icon={props => <Icon type="entypo" name='megaphone' {...props} />}
            label="ลงขาย"
            accessibilityLabel="ลงประกาศ"
            style={styles.fab}
            color="white"
          />
          // <FAB 
          //   onPress={() => props.navigation.navigate('PostProductPicture')}
          //   icon={ props => <Icon type="entypo" name='megaphone' { ...props }/> }
          //   label="ลงประกาศ"
          //   accessibilityLabel="ลงประกาศ"
          //   style={{
          //     position: 'absolute', 
          //     bottom: 30, 
          //     alignSelf: 'center', 
          //     backgroundColor: 'red'
          //   }}
          // /> 

        : null}
    </View>
    
        
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'red',
  },
})



export default ProductFeedScreen;