import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
{
  getMe{
    ...user
  }
}
${fragments.user}
`;
