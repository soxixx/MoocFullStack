// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

// const getId = () => (100000 * Math.random()).toFixed(0)
import anecdoteService from '../services/anecdotes'

const anecdoteReducer = (state = [], action) => {
  // console.log('state now: ', state)
  // console.log('action', action)
  if(action.type === 'VOTE') {
    const id_to_vote = action.data.id
    const updated_state = state.map(ele=> (ele.id===id_to_vote)? {...ele,votes:ele.votes+1} : ele)
    return updated_state
  }
  else if (action.type === 'NEW_ANECDOTE'){
    return state.concat(action.data)
  }
  else if (action.type === 'INIT_ANECDOTES'){
    return action.data
  }
  else return state
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const data = await anecdoteService.update(anecdote.id,{...anecdote,votes:anecdote.votes+1})
    dispatch({
      type:'VOTE',
      data
    })
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}



export default anecdoteReducer