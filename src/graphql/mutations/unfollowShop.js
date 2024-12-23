import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation UnfollowShop($shopId: ID!){
    unfollowShop(shopId: $shopId) {
    ...user
   }
 }
 ${fragments.user}
`;


