import { gql } from '@apollo/client';

export default gql`
mutation ViewAd($pk: ID! $id: ID! $isSponsor: Boolean){
  viewAd(pk: $pk id: $id isSponsor: $isSponsor)
}
`;

