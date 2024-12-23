import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetFollowingPosts($following: [String!]! $cursor: String $limit: Int) {
  getFollowingPosts(following: $following cursor: $cursor limit: $limit) {
    pageInfo{
      ...page
    }
    posts {
      postInfo{
        ...post
      }
      relation {
        ...relation
      }
    }
  }
}
${fragments.page}
${fragments.post}
${fragments.relation}
`;
