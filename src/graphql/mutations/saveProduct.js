import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation SaveProduct($productId: ID!){
  saveProduct(productId: $productId){
    id
    itemName
    meSaved
  }
}
`;
