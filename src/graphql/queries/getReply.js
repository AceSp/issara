import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetReply($id: ID! $parent_id: ID!) {
    getReply(id: $id parent_id: $parent_id) {
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
