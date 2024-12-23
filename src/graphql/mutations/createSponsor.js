import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreateSponsor(
            $text: String!
            $phrase: String
            $image: String
            $video: String
            $mediaName: [String!]
            $shop: AuthorInput
            $product: AuthorInput
            $budget: Float!
            $tambon: String
            $amphoe: String
            $changwat: String
            $region: String
            $all: Boolean
    ){
    createSponsor(
            text: $text
            phrase: $phrase
            image: $image
            video: $video
            mediaName: $mediaName
            shop: $shop
            product: $product
            budget: $budget
            tambon: $tambon
            amphoe: $amphoe
            changwat: $changwat
            region: $region
            all: $all
    ) {
      ...ad
   }
 }
 ${fragments.ad}
`;
