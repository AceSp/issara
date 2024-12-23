import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetNewsPosts($getNewPosts: Boolean $categoryArr: [String!] $cursor: String $limit: Int $restart: Boolean ) {
  getNewsPosts(getNewPosts: $getNewPosts categoryArr: $categoryArr cursor: $cursor limit: $limit restart: $restart) {
    pageInfo{
      ...page
    }
    posts {
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
