import { gql } from '@apollo/client';

export default gql`
mutation CompleteMultiPartUploads($multipartResponse: [MultipartResponse!]!) {
    completeMultipartUploads(multipartResponse: $multipartResponse) 
}
`;

