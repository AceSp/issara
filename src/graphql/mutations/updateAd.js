import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation UpdateAd(
            $id: ID!
            $text: String
            $image: String
            $video: String
            $tambon: String
            $amphoe: String
            $changwat: String
            $region: String
            $all: Boolean
    ){
    updateAd(
            id: $id
            text: $text
            image: $image
            video: $video
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
