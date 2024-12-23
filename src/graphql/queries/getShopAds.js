import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetShopAds($shopId: ID!) {
    getShopAds(shopId: $shopId) {
        ...ad
    }
  }
${fragments.ad}
`;

