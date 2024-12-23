import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query SearchShops(
  $searchTerm: String!
  $skip: Int
  $limit: Int
  ){
    searchShops(
      searchTerm: $searchTerm
      skip: $skip
      limit: $limit
      ) {
      pageInfo{
        ...page
      }
      shops{
        ...shop
      }
    }
  }
${fragments.page}
${fragments.shop}
`;

