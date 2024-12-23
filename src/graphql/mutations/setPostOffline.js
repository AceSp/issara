import { gql } from '@apollo/client';

export default gql`
mutation SetPostOffline($pk: ID! $id: ID!){
    setPostOffline(pk: $pk id: $id) 
 }
`;




