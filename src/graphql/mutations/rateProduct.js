import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation RateProduct($productPK : ID! $productId: ID! $star: Int!){
  rateProduct(productPk: $productPk productId: $productId star: $star){
    product {
      ...product
    }
    myReview {
      ...review
    }
  }
}
${fragments.product}
${fragments.review}
`;

