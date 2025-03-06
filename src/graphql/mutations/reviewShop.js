import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation ReviewShop($shopId: ID! $text: String!){
  reviewShop(shopId: $shopId text: $text){
    shop {
      ...shop
    }
    myReview {
      ...review
    }
  }
}
${fragments.shop}
${fragments.review}
`;
