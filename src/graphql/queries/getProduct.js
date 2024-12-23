import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetProduct($productId: ID!){
    getProduct(productId: $productId) {
        ...product
    }
  }
${fragments.product}
`;
