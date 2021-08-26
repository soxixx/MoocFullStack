import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK } from '../queries'
// import {  ALL_AUTHORS, ALL_BOOKS } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ addBook ] = useMutation(ADD_BOOK, {
      // refetchQueries: [ { query: ALL_BOOKS }, { query: ALL_AUTHORS } ],
      onError: (error) => {
        props.setError(error.graphQLErrors[0].message)
      },
      update: (store, response) => {
        props.updateCacheWith(response.data.addBook)
        // const booksInStore = store.readQuery({ query: ALL_BOOKS })
        // store.writeQuery({
        //   query: ALL_BOOKS,
        //   data:  {...booksInStore,
        //     allBooks: [ ...booksInStore.allBooks, response.data.addBook ]
        //   }
        // })
        // const authorsInStore = store.readQuery({ query: ALL_AUTHORS })
        // store.writeQuery({
        //   query: ALL_AUTHORS,
        //   data:  {...authorsInStore,
        //     allAuthors: [ ...authorsInStore.allAuthors, response.data.addBook.author ]
        //   }
        // })
      }
    })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    
    console.log('add book...')
    addBook({ variables: { title, author, published, genres } })

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook