import { gql } from '@apollo/client';

export default gql`
mutation RequestJoinGroup($groupId: ID! $userId: ID){
    requestJoinGroup(groupId: $groupId userId: $userId)
 }
`;

