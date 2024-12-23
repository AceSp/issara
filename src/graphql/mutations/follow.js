import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation Follow($userId: ID!){
    follow(userId: $userId) {
    ...user
   }
 }
 ${fragments.user}
`;
