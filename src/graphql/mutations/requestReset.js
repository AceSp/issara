import { gql } from '@apollo/client';

export default gql`
mutation RequestReset($username: String!){
    requestReset(username: $username) 
 }
`;

