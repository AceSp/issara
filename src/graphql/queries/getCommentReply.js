import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetCommentReply($id: ID!) {
    getCommentReply(id: $id) {
      parent{
        relation{
          ...relation
        }
        commentInfo{
          ...comment
        }
      }
      replies{
        relation{
          ...relation
        }
        commentInfo{
          ...comment
        }
      }
    }
  }
${fragments.comment}
${fragments.relation}
`;
