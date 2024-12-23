import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation FollowShop($shopId: ID!){
    followShop(shopId: $shopId) {
    ...user
   }
 }
 ${fragments.user}
`;

