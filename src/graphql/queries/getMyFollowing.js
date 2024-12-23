import { gql } from '@apollo/client';

export default gql`
query GetMyFollowing {
    getMyFollowing {
        id
        itemName
        avatar
    }
}
`;

