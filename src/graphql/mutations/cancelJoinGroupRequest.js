import { gql } from '@apollo/client';

export default gql`
mutation CancelJoinGroupRequest($groupId: ID! $userId: ID){
    cancelJoinGroupRequest(groupId: $groupId userId: $userId)
 }
`;


