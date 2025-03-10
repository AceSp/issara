import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreatePromote(
        $postId: ID!
    ){
    createPromote(
        postId: $postId
    ) {
      ...post
   }
 }
 ${fragments.post}
`;
