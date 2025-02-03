import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation DeletePromote(
    $id: ID!
    $postId: ID!
    ){
    deletePromote(
        id: $id
        postId: $postId
    ) {
      ...post
   }
 }
 ${fragments.post}
`;

