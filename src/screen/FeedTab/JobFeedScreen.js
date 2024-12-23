import React,
{
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SectionList
} from 'react-native';
import { Icon } from 'react-native-elements';
import { FAB } from 'react-native-paper';
import { useQuery, useMutation } from '@apollo/client';
import { iOSColors } from 'react-native-typography';
// import BackgroundUpload from 'react-native-background-upload';

import FeedCard from '../../component/FeedCard/FeedCard';
import GET_products_QUERY from '../../graphql/queries/getProducts';
import GET_PRODUCTS_QUERY from '../../graphql/queries/getProducts';
// import VIEW_POST_MUTATION from '../../graphql/mutations/viewPost';
import CREATE_PRODUCT_MUTATION from '../../graphql/mutations/createProduct';
import {
  store,
  getShowQuestion
} from '../../utils/store';
import NewFeedHeader from './Component/NewFeedHeader';
import NewFeedTopTab from './Component/NewFeedTopTab';
import Loading from '../../component/Loading';
import PlaceholderFeed from '../../component/FeedCard/PlaceholderFeed';
import PromoteCard from '../../component/FeedCard/PromoteCard';
import JobCard from '../../component/FeedCard/JobCard';
import UploadProgressCard from '../../component/UploadProgressCard';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const JobFeedScreen = (props) => {
  const { state: { me } } = useContext(store);

  const jobParam = props.route.params;

  const [products, setProducts] = useState([]);
  const [testData, setTestData] = useState({});

  const [uploadProgress, setUploadProgress] = useState(-1);
  const [uploadError, setUploadError] = useState(false);

//   const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(GET_products_QUERY);
  const { 
    loading, 
    error, 
    data, 
    fetchMore, 
    refetch, 
    networkStatus 
} = useQuery(
    GET_PRODUCTS_QUERY,
    {
        variables: { isJob: true }
    }
    );

  // const [viewPost, { data: view_data, loading: view_loading }] = useMutation(VIEW_POST_MUTATION);
  const [createProduct, { createProduct_data }] = useMutation(CREATE_PRODUCT_MUTATION, {
    variables: {isJob: true}
  });

  /* ***********collapsible tab broken now fix later***********
    const { scrollUp, scrollDown } = React.useContext(ScrollContext);
  
    let prevOffset = 0
  
    function checkScroll(e) {
      
      const currentOffset = e.nativeEvent.contentOffset.y
      if((currentOffset - prevOffset) > 50 ) {
        scrollDown();
      } else if((currentOffset - prevOffset) < 100) {
        scrollUp();
      }
      console.log(currentOffset);
      prevOffset = currentOffset;
    }*/

  //const _animatedValue = new Animated.Value(0);

  const flatlistRef = useRef();

  // useEffect(() => {
  //   setTestData(data);
  //   if(!data) return;
  //   if(data.getProducts.products.length === 1) {
  //     return setProducts(data.getProducts.products.concat(products));
  //   }
  //   const newProducts = data.getProducts.promote 
  //     ? data.getProducts.products.concat(data.getProducts.promote) 
  //     : data.getProducts.products

  //   setProducts(products.concat(newProducts))
  // }, [data?.getProducts.products[0].postInfo.id])

  useEffect(() => {
    const checkFirstTime = async () => {
      const show = getShowQuestion();
      if(show) props.navigation.navigate('Question');
    }
    checkFirstTime();
  }, []);

  useEffect(() => {
    if (!flatlistRef?.current?.scrollToOffset) return;
    const unsubscribe = props.navigation.addListener('tabPress', (e) => {
      flatlistRef.current.scrollToOffset({ offset: 0 });
    });
    return unsubscribe;
  }, [props.navigation]);

  // useEffect(() => {
  //   if (jobParam?.uploadIdArr) {
  //     if (jobParam?.uploadIdArr.length === 0) {
  //       createJob(jobParam.jobVariable);
  //     }
  //     let progresses = [];
  //     let uploadFinished = 0;
  //     for (let [index, uploadId] of jobParam?.uploadIdArr.entries()) {
  //       progresses.push(0);
  //       BackgroundUpload.addListener('progress', uploadId, (data) => {
  //         progresses[index] = data.progress;
  //         setUploadProgress(Math.min(...progresses));
  //       });
  //       BackgroundUpload.addListener('error', uploadId, (data) => {
  //         setUploadError(true)
  //         console.log(`Error: ${data.error}%`);
  //       });
  //       BackgroundUpload.addListener('cancelled', uploadId, (data) => {
  //         console.log(`Cancelled!`);
  //       });
  //       BackgroundUpload.addListener('completed', uploadId, (data) => {
  //         // data includes responseCode: number and responseBody: Object
  //         uploadFinished++;
  //         if (uploadFinished === jobParam?.uploadIdArr.length) {
  //           createJob(jobParam.jobVariable);
  //           setUploadProgress(-1);
  //         }
  //         console.log('Completed!');
  //       });
  //     }
  //   }
  // }, [jobParam]);

  function loadMore() {
    fetchMore({
      variables: {
        cursor: data.getProducts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        return fetchMoreResult.getProducts.sections.length
          ? {
            // Put the new.products at the end of the list and update `pageInfo`
            // so we have the new `endCursor` and `hasNextPage` values
            getProducts: {
              __typename: previousResult.getProducts.__typename,
              // products: [...previousResult.getProducts.products, ...newProducts],
              pageInfo: fetchMoreResult.getProducts.pageInfo,
              sections: previousResult.getProducts.sections.concat(fetchMoreResult.getProducts.sections)
            }
          }
          : previousResult;
      }
    });
  }

  function createJob({
    productName,
    tag,
    price,
    detail,
    pictures,
  }) {
      createProduct({
          variables: {
              productName,
              tag,
              isJob: true,
              price,
              detail,
              pictures
          }
      })
  };

  // const _getKey = (item) => {
  //   if(item?.postInfo) return item.postInfo.id;
  //   return item?.id + Date.now();
  // }

  const _renderItem = useCallback(
    ({ item, index }) => <JobCard
      {...item}
      index={index}
      navigation={props.navigation}
      me={me}
    />, []
  )

  const _renderSectionHeader = useCallback(
    ({ section }) => <PromoteCard
      {...section.promote}
      navigation={props.navigation}
    />
  )

  // if (loading) return <PlaceholderFeed />
  if (loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>
  console.log('-------------JobFeed---------------')
  console.log(data.getProducts)

  return (
    <View style={styles.Root}>
      <SectionList
        contentContainerStyle={{ alignSelf: 'stretch' }}
        sections={data.getProducts.sections}
        renderItem={_renderItem}
        renderSectionFooter={_renderSectionHeader}
        keyExtractor={item => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={data.getProducts.pageInfo.hasNextPage? loadMore() : null}
        removeClippedSubviews={true}
        refreshing={networkStatus === 4}
        onRefresh={refetch}
        ref={flatlistRef}
      />
      {
        (uploadProgress >= 0 || uploadError) ?
        <UploadProgressCard
          uploadError={uploadError}
          onClose={() => {
            setUploadProgress(-1);
            setUploadError(false);
          }}
          uploadProgress={uploadProgress}
        />
        : null
      }
      <FAB
        onPress={() => props.navigation.navigate('PostJobPicture')}
        icon={props => <Icon type="entypo" name='megaphone' {...props} />}
        label="ลงขาย"
        accessibilityLabel="ลงประกาศ"
        style={styles.fab}
        color="white"
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
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'red',
  },
})

export default JobFeedScreen;