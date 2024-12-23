import { gql } from '@apollo/client';

export default gql`
mutation ResetPassword(
    $userId: ID!
    $token: String!
    $password: String!
    ){
    resetPassword(
        userId: $userId
        token: $token
        password: $password
        ) 
 }
`;


