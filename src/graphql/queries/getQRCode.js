import { gql } from '@apollo/client';

export default gql`
query GetQRCode($pk: ID! $id: ID!) {
    getQRCode(pk: $pk id: $id)
  }
`;

