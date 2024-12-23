import { gql } from '@apollo/client';

export default gql`
mutation ReportPost($pk: ID! $id: ID! $reason: Int!){
    reportPost(pk: $pk id: $id reason: $reason) 
 }
`;




