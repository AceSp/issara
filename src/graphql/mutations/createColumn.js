import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
mutation CreateColumn($columnName: String!  $category: [String!]!){
    createColumn(columnName: $columnName category: $category) {
        column{
            ...column
        }
        me{
            ...user
        }
    }
}
${fragments.column}
${fragments.user}
`;

