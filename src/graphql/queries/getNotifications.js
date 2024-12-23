import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetNotifications{
  getNotifications{
   ...notification
  }
}
${fragments.notification}
`;
