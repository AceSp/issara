import { gql } from '@apollo/client';

export default gql`
query GetMyColumn {
    getMyColumn {
      id
      itemName
      avatar
    }
  }
`;


