import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetAddress(
    $findOne: Boolean 
    $tambon: String 
    $amphoe: String 
    $changwat: String 
    ){
    getAddress(
        findOne: $findOne 
        tambon: $tambon 
        amphoe: $amphoe 
        changwat: $changwat 
        ) {
            ...address
    }
}
${fragments.address}
`;
