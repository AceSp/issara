import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation LikeReply($id: ID! $parent_id: ID!){
  likeReply(id: $id parent_id: $parent_id){
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
