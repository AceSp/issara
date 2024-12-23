import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation ChangeGroupAdmin($groupId: ID!){
    changeGroupAdmin(groupId: $groupId) {
       ...group
   }
 }
 ${fragments.group}
`;


