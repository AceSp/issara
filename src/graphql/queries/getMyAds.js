import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetMyAds {
    getMyAds {
      ...ad
    }
  }
${fragments.ad}
`;
