import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation LikePost($postId: ID!){
  likePost(postId: $postId){
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
