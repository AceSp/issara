import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreateReply($text: String! $id: ID! $post_id: ID! $parent_id: ID) {
    createReply(text: $text id: $id post_id: $post_id parent_id: $parent_id){
      postInfo{
      ...post
      }
      comment{
       ...comment
      }
      child{
        relation{
          ...relation
        }
        commentInfo{
          ...comment
        }
      }
    }
  }
${fragments.post}
${fragments.comment}
${fragments.relation}
`;
  