import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard
} from 'react-native';
import { Icon, Avatar } from 'react-native-elements';
import {
  useQuery,
  useMutation
} from '@apollo/client';
import { iOSColors } from 'react-native-typography';

import GET_PRODUCT_QUERY from '../../graphql/queries/getProduct';
import GET_REVIEWS_QUERY from '../../graphql/queries/getReviews';
import REVIEW_PRODUCT_MUTATION from '../../graphql/mutations/reviewProduct';
import Loading from '../../component/Loading';
import { store } from '../../utils/store';
import ReviewItem from '../../component/commentItem/CommentItem';
import JobCard from '../../component/FeedCard/JobCard';
import { 
  Divider,
  Card,
} from 'react-native-paper';
import ReviewCard from '../shopScreen/component/ReviewCard';
import AvatarWrapper from '../../component/AvatarWrapper';

const HEADER_MAX_HEIGHT = 200;// set the initial height
const HEADER_MIN_HEIGHT = 60;// set the height on scroll
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const JobDetailScreen = (props) => {
  const { state: { me } } = useContext(store);
  const { productId } = props.route.params;

  const { loading, error, data } = useQuery(
    GET_PRODUCT_QUERY,
    { variables: { productId } }
  );

  const [reviewProduct, { data: review_product_data }] = useMutation(REVIEW_PRODUCT_MUTATION);

  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState('');

  const {
    loading: Review_loading,
    error: Review_error,
    data: review_data,
    fetchMore
  } = useQuery(GET_REVIEWS_QUERY,
    { variables: { id: productId } }
  );

  const inputRef = useRef();
  const flatlistRef = useRef();

  useEffect(() => {
    if(data)
      setMyReview(data.getProduct?.myReview?.text);
  }, [data])

  // useLayoutEffect(() => {
  //   getShow();
  // }, [])

  function focusInput() {
    if (review_data.getReviews.reviews.length)
      flatlistRef.current.scrollToIndex({ index: 0, viewPosition: 0.16 });
  };

  function loadMore() {
    if (!review_data.getReviews.pageInfo.hasNextPage) {
      return
    }
    fetchMore({
      variables: {
        id: productId,
        cursor: review_data.getReviews.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newReviews = fetchMoreResult.getReviews.reviews;
        const pageInfo = fetchMoreResult.getReviews.pageInfo;

        return newReviews.length
          ? {
            // Put the new reviews at the end of the list and update `pageInfo`
            // so we have the new `endCursor` and `hasNextPage` values
            getReviews: {
              __typename: previousResult.getReviews.__typename,
              reviews: [...previousResult.getReviews.reviews, ...newReviews],
              pageInfo
            }
          }
          : previousResult;
      }
    });
  }

  const submit = () => {
    reviewProduct({
      variables: {
        text: myReview,
        productPk: data.getProduct.author.id,
        productId: productId
      }
    })
  }

  if (loading || Review_loading) return <Loading />
  if (error) return <View><Text>`Error! ${error.message}`</Text></View>
  if (Review_error) return <View><Text>`Error! ${Review_error.message}`</Text></View>

  // const _renderItem = ({ item }) => <ReviewItem 
  //     navigation={props.navigation}
  //     {...item} 
  //     />

  const _renderItem = ({ item }) => <ReviewCard {...item} />

  return (
    <View style={styles.Root}>
      <FlatList
        ListHeaderComponent={
          <View>
            <JobCard
              {...data.getProduct}
              hideReview
            />
            <Divider />
            <Card>
              <View style={styles.myReviewHeaderContainer}>
                <Text style={styles.myReviewHeader}>รีวิวของคุณ</Text>
                <TouchableOpacity onPress={() => submit()}>
                  <Text style={styles.sendButton}>
                    ส่ง
                  </Text>
                </TouchableOpacity>
              </View>
              <Card.Content>
                <TextInput
                  label="เขียนรีวิว"
                  value={myReview}
                  onChangeText={(value) => setMyReview(value)}
                  multiline={true}
                />
              </Card.Content>
            </Card>
            <Divider />
          </View>
        }
        contentContainerStyle={{ alignSelf: 'stretch' }}
        data={review_data.getReviews.reviews}
        keyExtractor={item => item.id}
        renderItem={_renderItem}
        onEndReachedThreshold={0.5}
        onEndReached={() => loadMore()}
        scrollEventThrottle={16}
        ref={flatlistRef}
      />
      <View style={styles.footer}>
        <AvatarWrapper 
          uri={me.avatar}
          label={me.itemName[0]}
        />
        <View style={styles.reviewBox}>
          <TextInput
            style={styles.inputBox}
            value={myReview}
            placeholder='เขียนความคิดเห็น..'
            onChangeText={(value) => setMyReview(value)}
            onFocus={() => focusInput()}
            onBlur={() => setMyReview('')}
            ref={inputRef}
          />
          <TouchableOpacity>
            <View style={styles.photoInput}>
              <Icon name="photo-camera" size={30} color={iOSColors.lightGray} />
            </View>
          </TouchableOpacity>
        </View>
        {myReview == '' ? null :
          <TouchableOpacity onPress={() => submit()}>
            <View style={styles.sendButton}>
              <Icon name="send" size={30} color={iOSColors.orange} />
            </View>
          </TouchableOpacity>}
      </View>
    </View>


  )
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  },
  myReviewContainer: {
    backgroundColor: 'white',
    marginTop: 6,
  },
  myReviewHeader: {
    marginTop: 10,
    marginLeft: 10,
    fontSize: 24,
  },
  myReviewHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoInput: {
    marginLeft: 10,
    padding: 5,
    borderRadius: 20,
    marginVertical: 'auto',
  },
  Root: {
    flex: 1,
    backgroundColor: iOSColors.lightGray,
    justifyContent: 'center'
  },
  inputBox: {
    flex: 1
  },
  reviewBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,
    marginRight: 10,
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
  },
  sendButton: {
    marginRight: 10
  }
})

export default JobDetailScreen;