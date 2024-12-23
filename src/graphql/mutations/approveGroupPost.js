import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation ApproveGroupPost($pk: ID! $id: ID!){
    approveGroupPost(pk: $pk id: $id) {
        ...post
    }
 }
${fragments.post}
`;



