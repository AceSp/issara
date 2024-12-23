import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation UpdateGroup($id: ID! $name: String! $public: Boolean! $category: [String]! $about: String){
    updateGroup(id: $id name: $name public: $public category: $category about: $about) {
        ...group
    }
}
${fragments.group}
`;
