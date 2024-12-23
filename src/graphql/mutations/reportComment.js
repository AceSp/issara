import { gql } from '@apollo/client';

export default gql`
mutation ReportComment($pk: ID! $id: ID! $reason: Int!){
    reportComment(pk: $pk id: $id reason: $reason) 
 }
`;





