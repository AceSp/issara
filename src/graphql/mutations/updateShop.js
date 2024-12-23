import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation UpdateShop(
            $id: ID!
            $name: String!
            $mainPic: String
            $images: [String]
            $videos: [String]
            $haveStoreFront: Boolean!
            $haveOnline: Boolean!
            $openTime: OpenDayInput
            $phoneNumber: String!
            $website: String
            $email: String
            $phrase: String
            $description: String
            $latitude: Float
            $longitude: Float
            $address: String
            $district: String
            $amphoe: String
            $province: String
            $category: String!
            $type: String!
    ){
    updateShop(
           id: $id
           name: $name
           mainPic: $mainPic
           images: $images
           videos: $videos
           haveStoreFront: $haveStoreFront
           haveOnline: $haveOnline
           openTime: $openTime
           phoneNumber: $phoneNumber
           website: $website
           email: $email
           phrase: $phrase
           description: $description
           latitude: $latitude
           longitude: $longitude
           address: $address
           district: $district
           amphoe: $amphoe
           province: $province
           category: $category
           type: $type
        ) {
      ...shop
   }
 }
 ${fragments.shop}
`;
