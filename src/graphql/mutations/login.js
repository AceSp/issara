import { gql } from '@apollo/client';

export default gql`
mutation Login($username: String!, $password: String!) {
  login(username: $username password: $password) {
    accessToken
  }
}
`;
