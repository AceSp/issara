import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetPost($postId: ID!){
  getPost(postId: $postId){
    relation {
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
