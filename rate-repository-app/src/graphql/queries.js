import { gql } from '@apollo/client';

export const GET_ALL_REPOSITORIES = gql`
query repositories($orderBy: AllRepositoriesOrderBy, $orderDirection: OrderDirection, $searchKeyword: String, $first: Int, $after: String) {
  repositories(orderBy: $orderBy, orderDirection: $orderDirection, searchKeyword: $searchKeyword, first: $first, after: $after) {
    totalCount
    edges {
      node {
        id
        fullName
        description
        ratingAverage
        reviewCount
        stargazersCount
        forksCount
        ownerAvatarUrl
        language
      }
      cursor
    }
  pageInfo {
    endCursor
    startCursor
    hasNextPage
    }
  }
}
`;

export const GET_AUTHORIZED_USER = gql`
query getAuthorizedUser($includeReviews: Boolean = false) {
  authorizedUser {
    id
    username
    reviews @include(if: $includeReviews) {
      edges {
        node {
          id
          text
          rating
          createdAt
          user {
            id
            username
          }
          repository{
            id
            fullName
            description
          }
        }
      }
    }
  }
}
`;

export const GET_SINGLE_REPOSITORY = gql`
query repository($id: ID!, $first: Int, $after: String) {
  repository(id: $id) {
      id
      fullName
      description
      ratingAverage
      reviewCount
      stargazersCount
      forksCount
      ownerAvatarUrl
      language
      url
      reviews (first: $first, after: $after) {
        edges {
          node {
            id
            text
            rating
            createdAt
            user {
              id
              username
            }
          }
          cursor
        }
        pageInfo {
          endCursor
          startCursor
          hasNextPage
        }
      }
    }
  }
`;