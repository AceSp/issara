import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetSponsorById($sponsorId: ID!) {
    getSponsorById(sponsorId: $sponsorId) {
        ...ad
    }
  }
${fragments.ad}
`;

