import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetProducts(
  $cursor: String
  $isJob: Boolean
  $category: [String!] 
  $type: String
  $brand: String
  $model: String
  $fuel: String
  $gear: String
  $color: String
  $memory: Int
  $truckType: String
  $jobType: String
  $payment: String
  $minMiles: Int
  $maxMiles: Int
  $minYear: Int
  $maxYear: Int
  $bedroom: Int
  $bathroom: Int
  $tambon: String
  $amphoe: String
  $changwat: String
  $minPrice: Int
  $maxPrice: Int
  $secondHand: Boolean
  ){
    getProducts(
      cursor: $cursor
      isJob: $isJob
      category: $category 
      type: $type
      brand: $brand
      model: $model
      fuel: $fuel
      gear: $gear
      color: $color
      memory: $memory
      truckType: $truckType
      jobType: $jobType
      payment: $payment
      minMiles: $minMiles
      maxMiles: $maxMiles
      minYear: $minYear
      maxYear: $maxYear
      bedroom: $bedroom
      bathroom: $bathroom
      tambon: $tambon
      amphoe: $amphoe
      changwat: $changwat
      minPrice: $minPrice
      maxPrice: $maxPrice
      secondHand: $secondHand
      ) {
      pageInfo{
        ...page
      }
      sections{
        data{
          ...product
        }
        promote{
          ...ad
        }
      }
    }
  }
${fragments.page}
${fragments.product}
${fragments.ad}
`;
