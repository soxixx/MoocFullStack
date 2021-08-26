import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { useQuery, 
  useSubscription, 
  useApolloClient, 
  useLazyQuery 
} from '@apollo/client'

import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from './queries'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const [errorMessage, setErrorMessage] = useState(null)
  const client = useApolloClient()

  const [page, setPage] = useState('authors')
  const authors_result = useQuery(ALL_AUTHORS)
  const [authors, setAuthors] = useState([])
  const books_result = useQuery(ALL_BOOKS)
  const [books, setBooks] = useState([])

  const [loadUser, user_result ] = useLazyQuery(ME)
  const [user, setUser] = useState(null)

  const [booksToRecommend, setBooksToRecommend]= useState([])
  
  useEffect(() => {
    if (token) {
      loadUser()
    }
  }, [token, loadUser])
  
  useEffect(() => {
    if (token && user_result.data) {
      setUser(user_result.data.me)
    }
  }, [token, user_result])
  //console.log(user)

  useEffect(() => {
    if (books_result.data){
      setBooks(books_result.data.allBooks)
    }
  },[books_result])

  useEffect(() => {
    if (authors_result.data){
      setAuthors(authors_result.data.allAuthors)
    }
  },[authors_result])

  useEffect(() => {
    if(user){
      setBooksToRecommend(books.filter(
        book => book.genres.includes(user.favoriteGenre))
      )
    }
  },[user,books])
  
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setUser(null)
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const booksInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(booksInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : booksInStore.allBooks.concat(addedBook) }
      })
    }

    const authorsInStore = client.readQuery({ query: ALL_AUTHORS })
    if (!includedIn(authorsInStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors : authorsInStore.allAuthors.concat(addedBook.author) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      notify(`${addedBook.title} by ${addedBook.author.name} added`)
      updateCacheWith(addedBook)
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {user && <button onClick={() => setPage('add')}>add book</button>}
        {user && <button onClick={() => setPage('recommended')}>recommended</button>}
        {user && <button onClick={logout}>logout</button>}
        {!user && <button onClick={() => setPage('login')}>login</button>}
      </div>
      <Notification errorMessage={errorMessage} />

      <Authors
        show={page === 'authors'}
        authors={authors}
      />

      <Books
        show={page === 'books'}
        books={books}
      />

      {user && <NewBook
        show={page === 'add'}
        setError={notify}
        updateCacheWith={updateCacheWith}
      />}

      {user && <Recommended
        show={page === 'recommended'}
        books_to_recommend={booksToRecommend}
      />}

      {!user && <LoginForm
        show={page === 'login'}
        setError={notify}
        setToken={setToken} 
      />}
    </div>
  )
}

export default App