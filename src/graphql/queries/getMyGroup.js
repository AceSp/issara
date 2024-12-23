import { gql } from '@apollo/client';

export default gql`
query GetMyGroup {
    getMyGroup {
        id
        itemName
        avatar
    }
}
`;
