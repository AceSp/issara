import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation Review($id: ID! $text: String!){
  review(id: $id text: $text){
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
