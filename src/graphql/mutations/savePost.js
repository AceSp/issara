import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation SavePost($postId: ID!){
  savePost(postId: $postId){
   relation{
    ...relation
  }
    postInfo {
      ...post
    }
  }
}
${fragments.post}
${fragments.relation}
`;
