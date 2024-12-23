import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
  subscription NotificationSub {
    notificationSub{
      ...notification
    }
  }
  ${fragments.notification}
`;