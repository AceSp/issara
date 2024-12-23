import { gql } from '@apollo/client';

export default gql`
mutation IncreaseCoin($increaseCoinCount: Int!){
    increaseCoin(increaseCoinCount: $increaseCoinCount) {
        id
        userHaveCoin
    }
 }
`;


