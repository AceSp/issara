import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetMessages($roomId: ID! $cursor: String) {
    getMessages(roomId: $roomId cursor: $cursor) {
        pageInfo {
            ...page
        }
        messages {
            ...message
        }
    }
  }
${fragments.page}
${fragments.message}
`;

