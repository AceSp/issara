import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
  subscription MeSub {
    meSub {
      ...user
    }
  }
  ${fragments.user}
`;