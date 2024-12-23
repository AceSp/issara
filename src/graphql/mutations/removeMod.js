import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation RemoveMod($id: ID! $memberId: ID!){
    removeMod(id: $id memberId: $memberId) {
      ...group
   }
 }
 ${fragments.group}
`;
