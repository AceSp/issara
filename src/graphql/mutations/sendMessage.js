import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation SendMessage(
    $pk: String!,
    $text: String,
    $images: [String!],
    $video: String,
    ){
  sendMessage(
    pk: $pk,
    text: $text
    images: $images
    video: $video,
    ){
      ...message
  }
}
${fragments.message}
`;

