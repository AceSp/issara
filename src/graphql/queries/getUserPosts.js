import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetUserPosts($cursor: String $limit: Int $userId: ID) {
  getUserPosts(cursor: $cursor limit: $limit userId: $userId) {
    pageInfo{
      ...page
    }
    posts{
      postInfo{
        ...post
      }
      relation{
        ...relation
      }
    }
  }
}
${fragments.page}
${fragments.post}
${fragments.relation}
`;