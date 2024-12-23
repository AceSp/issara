import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetLikedPosts($cursor: String $limit: Int) {
  getLikedPosts(cursor: $cursor limit: $limit) {
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