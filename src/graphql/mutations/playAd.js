import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation PlayAd($pk: ID! $adId: ID!){
    playAd(pk: $pk adId: $adId) {
        ...ad
    }
  }
${fragments.ad}
`;
