import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetComments($getNewComments: Boolean $pk: ID! $cursor: String $limit: Int) {
  getComments(getNewComments: $getNewComments pk: $pk cursor: $cursor limit: $limit) {
    pageInfo{
      ...page
    }
    comments {
      commentInfo{
        ...comment
      }
      relation{
        ...relation
      }
      replies {
        relation {
          ...relation
        }
        commentInfo {
          ...comment
        }
      }
    }
  }
}
${fragments.page}
${fragments.comment}
${fragments.relation}
`;
