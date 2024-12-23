import { gql } from '@apollo/client';

export default gql`
mutation VerifyPassToken($userId: ID! $token: String!){
    verifyPassToken(userId: $userId token: $token) 
 }
`;


