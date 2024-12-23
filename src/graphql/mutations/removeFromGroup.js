import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation RemoveFromGroup($id: ID! $memberId: ID!){
    removeFromGroup(id: $id memberId: $memberId) {
      ...group
   }
 }
 ${fragments.group}
`;
