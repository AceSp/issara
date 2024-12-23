import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
  subscription MessageSub($roomId: ID!) {
    messageSub(roomId: $roomId) {
      ...message
    }
  }
  ${fragments.message}
`;