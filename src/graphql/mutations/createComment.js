import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreateComment(
  $text: String! 
  $parentId: ID! 
  ) {
    createComment(
      text: $text 
      parentId: $parentId
      ){
        relation{
          ...relation
        }
        commentInfo{
          ...comment
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
${fragments.comment}
${fragments.relation}
`;
