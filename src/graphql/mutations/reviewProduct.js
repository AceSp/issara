import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation ReviewProduct($productPk: ID! $productId: ID! $text: String!){
  reviewProduct(productPk: $productPk productId: $productId text: $text){
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

