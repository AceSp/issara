import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreateShop(
            $shopName: String!
            $headerPic: String
            $images: [String!]
            $videos: [String!]
            $mediaName: [String!]
            $haveStoreFront: Boolean!
            $haveOnline: Boolean!
            $openTime: OpenDayInput
            $phoneNumber: String!
            $website: String
            $email: String
            $phrase: String
            $description: String
            $pinLocation: LocationInput
            $address: String
            $tambon: String
            $amphoe: String
            $changwat: String
            $category: [String!]!
            $type: String!
    ){
    createShop(
           shopName: $shopName
           headerPic: $headerPic
           images: $images
           videos: $videos
           mediaName: $mediaName
           haveStoreFront: $haveStoreFront
           haveOnline: $haveOnline
           openTime: $openTime
           phoneNumber: $phoneNumber
           website: $website
           email: $email
           phrase: $phrase
           description: $description
           pinLocation: $pinLocation
           address: $address
           tambon: $tambon
           amphoe: $amphoe
           changwat: $changwat
           category: $category
           type: $type
        ) {
          shop {
            ...shop
          }
          me {
            ...user
          }
   }
 }
 ${fragments.shop}
 ${fragments.user}
`;
