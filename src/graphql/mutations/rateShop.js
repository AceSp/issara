import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation RateShop($shopId: ID! $star: Int!){
  rateShop(shopId: $shopId star: $star){
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
