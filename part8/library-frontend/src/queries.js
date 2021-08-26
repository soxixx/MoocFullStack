import { gql  } from '@apollo/client'

const AUTHOR_DETAILS = gql`
fragment AuthorDetails on Author {
  id
  name
  born
  bookCount
}
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`
export const ALL_BOOKS = gql`
  query {
    allBooks { 
      id
      title 
      author{
        ...AuthorDetails
      }
      published 
      genres
    }
  }
  ${AUTHOR_DETAILS}
`

export const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres:[String!]!) {
    addBook(
        title: $title,
        author: $author,
        published: $published,
        genres: $genres
      ) {
        id,
        title,
        author{
          ...AuthorDetails
        },
        published,
        genres
      }
  }
  ${AUTHOR_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ME= gql`
query {
  me{
    username
    favoriteGenre
    id
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded { 
      id
      title 
      author{
        ...AuthorDetails
      }
      published 
      genres
    }
  }
  ${AUTHOR_DETAILS}
`