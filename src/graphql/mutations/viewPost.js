import { gql } from '@apollo/client';

export default gql`
mutation ViewPost($postId: ID!){
  viewPost(postId: $postId)
}
`;
