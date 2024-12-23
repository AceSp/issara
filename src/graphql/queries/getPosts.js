import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetPosts($cursor: String $limit: Int $isJob: Boolean) {
  getPosts(cursor: $cursor limit: $limit isJob: $isJob) {
    pageInfo {
      endCursor
      hasNextPage
    }
    posts {
      postInfo{
        ...post
      }
      relation {
        ...relation
      }
      sponsor {
        ...ad
      }
    }
    promote {
      ...ad
    }
  }
}
${fragments.post}
${fragments.relation}
${fragments.ad}
`;
