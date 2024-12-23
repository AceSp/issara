import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetUser($userId: ID!){
  getUser(userId: $userId){
    ...user
  }
}
${fragments.user}
`;
