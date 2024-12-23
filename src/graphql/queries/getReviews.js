import { gql } from '@apollo/client';

import fragments from '../fragment';

export default gql`
query GetReviews($id: ID! $cursor: String $limit: Int){
    getReviews(id:$id cursor:$cursor limit:$limit) {
        pageInfo {
            ...page
        }
        reviews {
            ...review
        } 
    }
  }
${fragments.review}
${fragments.page}
`;
