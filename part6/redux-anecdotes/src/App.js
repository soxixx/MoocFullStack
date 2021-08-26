import AnecdoteForm from "./components/AnecdoteForm"
import AnecdoteList from "./components/AnecdoteList"
import Notification from "./components/Notification"
import Filter from "./components/Filter"

import anecdoteService from './services/anecdotes'
import { useDispatch } from 'react-redux'
import {initializeAnecdotes} from './reducers/anecdoteReducer'
import React, {useEffect} from 'react'


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    anecdoteService.getAll().then(() => 
      dispatch(initializeAnecdotes()))
  }, [dispatch])

  return (
    <div>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App