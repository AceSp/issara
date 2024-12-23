import { gql } from '@apollo/client';

export default gql`
mutation ApiLogin(
    $id: ID!
    $name: String!
    $avatar: String
    $first_name: String
    $last_name: String
    $email: String
    $phone_number: String
    ) {
  apiLogin(
    id: $id
    name: $name
    avatar: $avatar
    first_name: $first_name
    last_name: $last_name
    email: $email
    phone_number: $phone_number
      ) {
    accessToken
  }
}
`;

