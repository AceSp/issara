import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetShop($shopId: ID!){
    getShop(shopId: $shopId) {
        ...shop
    }
  }
${fragments.shop}
`;
