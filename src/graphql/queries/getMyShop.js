import { gql } from '@apollo/client';

export default gql`
query GetMyShop {
    getMyShop {
      id
      itemName
      avatar
    }
  }
`;

