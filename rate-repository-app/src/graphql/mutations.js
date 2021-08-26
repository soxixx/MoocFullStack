import { gql } from '@apollo/client';

export const LOGIN=gql`
mutation authorize($username: String!, $password: String!){
    authorize(credentials: { username: $username, password: $password }) {
      accessToken
    }
  }
`;

export const CREATE_REVIEW = gql`
mutation createReview($ownerName: String!, $repositoryName: String!, $rating: Int!, $text: String){
    createReview(review: { ownerName: $ownerName, repositoryName: $repositoryName, rating: $rating, text: $text}) {
      repositoryId
    }
  }
`;

export const SIGN_UP = gql`
mutation createUser($username: String!, $password: String!){
    createUser(user: { username: $username, password: $password }) {
      id
      username
      createdAt
    }
  }
`;

export const DELETE_REVIEW = gql`
mutation deleteReview($id: ID!){
    deleteReview(id: $id)
  }
`;