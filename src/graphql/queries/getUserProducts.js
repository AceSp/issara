import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetUserProducts($userId: ID $online: Boolean $limit: Int $cursor: String){
    getUserProducts(userId: $userId online: $online limit: $limit cursor: $cursor) {
      pageInfo{
        ...page
      }
      sections{
        data{
          ...product
        }
        promote{
          ...ad
        }
      }
    }
  }
${fragments.page}
${fragments.product}
${fragments.ad}
`;
