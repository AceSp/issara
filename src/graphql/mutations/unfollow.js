import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation Unfollow($userId: ID!){
    unfollow(userId: $userId) {
      ...user
   }
 }
 ${fragments.user}
`;
