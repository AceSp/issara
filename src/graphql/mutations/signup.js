import { gql } from '@apollo/client';

export default gql`
mutation Signup
( $username: String!,
  $email: String!, 
  $password: String!
  $pinLocation: LocationInput
){
  signup
  ( username: $username
    email: $email
    password: $password
    pinLocation: $pinLocation
  ) 
  {
    accessToken
  }
}
`;