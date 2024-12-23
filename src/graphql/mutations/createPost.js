import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreatePost(
  $text: String!
  $tags: [String!]
  $video: String!
  $thumbnail: String!
  $isProduct: Boolean
  ) {
  createPost(
    text: $text
    tags: $tags
    video: $video
    thumbnail: $thumbnail
    isProduct: $isProduct
    ) {
      relation{
        ...relation
      }
      postInfo{
        ...post
      }
      sponsor {
        ...ad
      }
  }
}
${fragments.post}
${fragments.relation}
${fragments.ad}
`;