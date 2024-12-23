import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation PauseAd($pk: ID! $adId: ID!){
    pauseAd(pk: $pk adId: $adId) {
        ...ad
    }
  }
${fragments.ad}
`;
