import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreateProduct(
            $productName: String!
            $price: Int!
            $tag: [String!]
            $isJob: Boolean
            $phoneNumber: String
            $pictures: [String!]
            $mediaName: [String!]
            $secondHand: Boolean
            $detail: String
            $place: String
            $tambon: String
            $amphoe: String
            $changwat: String
            $region: String
            $miles: Int
            $model: String
            $brand: String
            $year: Int
            $fuel: String
            $gear: String
            $color: String
            $type: String
            $area: String
            $bedroom: Int
            $bathroom: Int
            $memory: Int
            $jobType: String
            $payment: String
            $category: [String!]) {
  createProduct(
            productName: $productName
            price: $price
            tag: $tag
            isJob: $isJob
            phoneNumber: $phoneNumber
            pictures: $pictures
            mediaName: $mediaName
            secondHand: $secondHand
            detail: $detail
            place: $place
            tambon: $tambon
            amphoe: $amphoe
            changwat: $changwat
            region: $region
            miles: $miles
            model: $model
            brand: $brand
            year: $year
            fuel: $fuel
            gear: $gear
            color: $color
            type: $type
            area: $area
            bedroom: $bedroom
            bathroom: $bathroom
            memory: $memory
            jobType: $jobType
            payment: $payment
            category: $category) {
      ...product
  }
}
${fragments.product}
`;
