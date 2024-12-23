import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetMyOfflineProducts {
    getMyOfflineProducts {
        ...product
    }
  }
${fragments.product}
`;

