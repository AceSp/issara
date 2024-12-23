import { gql } from '@apollo/client';

export default gql`
query GetArea($amphoe: String $changwat: String){
    getArea(amphoe: $amphoe changwat: $changwat) 
}
`;
