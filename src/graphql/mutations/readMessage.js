import { gql } from '@apollo/client';

export default gql`
mutation ReadMessage($roomId: ID! $messageId: [ID!]!){
    readMessage(roomId: $roomId messageId: $messageId) 
 }
`;

