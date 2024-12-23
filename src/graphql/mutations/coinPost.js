import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CoinPost($postId: ID!, $giveCoinCount: Int!) {
    coinPost(postId: $postId, giveCoinCount: $giveCoinCount) {
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
