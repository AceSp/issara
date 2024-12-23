import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation UpdateMe(
  $username: String
  $firstName: String
  $lastName: String
  $avatar: String
  $headerPic: String
  $info: String
  $email: String
  $phoneNumber: String
  $website: String
  $latitude: Float
  $longitude: Float
  $address: String
  $tambon: String
  $amphoe: String
  $changwat: String
  $zipcode: String
  $category: String
  $badgeCount: Int
  $notificationToken: String
  ){
    updateMe(
      username: $username
      firstName: $firstName,
      lastName: $lastName,
      avatar: $avatar,
      headerPic: $headerPic,
      info: $info,
      email: $email,
      phoneNumber: $phoneNumber,
      website: $website,
      latitude: $latitude,
      longitude: $longitude,
      address: $address,
      tambon: $tambon,
      amphoe: $amphoe,
      changwat: $changwat,
      zipcode: $zipcode,
      category: $category,
      badgeCount: $badgeCount,
      notificationToken: $notificationToken,
      ) {
      ...user
   }
 }
 ${fragments.user}
`;
