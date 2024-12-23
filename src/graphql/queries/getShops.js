import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetShops(
  $cursor: String
  $category: String
  $type: String
  $tambon: String
  $amphoe: String
  $changwat: String
  $haveStoreFront: Boolean
  $haveOnline: Boolean 
  $limit: Int
  ){
    getShops(
      cursor: $cursor
      category: $category
      type: $type
      tambon: $tambon
      amphoe: $amphoe
      changwat: $changwat
      haveStoreFront: $haveStoreFront
      haveOnline: $haveOnline
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
