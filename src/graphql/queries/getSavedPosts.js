import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetSavedPosts($cursor: String $limit: Int) {
  getSavedPosts(cursor: $cursor limit: $limit) {
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