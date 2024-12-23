import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetRooms{
    getRooms {
        room {
            ...room
        }
        lastMessage {
            ...message
        }
    }
  }
${fragments.room}
${fragments.message}
`;

