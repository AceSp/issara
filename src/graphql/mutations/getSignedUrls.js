import { gql } from '@apollo/client';

export default gql`
mutation GetSignedUrls($arg: [GetSignedUrlInput!]!){
    getSignedUrls(arg: $arg) 
 }
`;

