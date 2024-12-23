import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation LikeComment($commentId: ID!){
  likeComment(commentId: $commentId){
   relation{
    ...relation
  }
    commentInfo {
      ...comment
    }
  }
}
${fragments.comment}
${fragments.relation}
`;
