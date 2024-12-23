import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CheckRoom(
    $userId: String!,
    $username: String!,
    $userAvatar: String,
    ){
  checkRoom(
    userId: $userId,
    username: $username,
    userAvatar: $userAvatar,
    ){
      ...room
  }
}
${fragments.room}
`;


