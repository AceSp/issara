import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetSponsor {
    getSponsor {
        ...ad
    }
  }
${fragments.ad}
`;
