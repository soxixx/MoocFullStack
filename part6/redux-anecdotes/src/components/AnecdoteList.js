import React from 'react'
import { connect } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const Anecdote = ({anecdote,handleVote}) => {
    return (
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={handleVote}>vote</button>
        </div>
      </div>
    )
}


const AnecdoteList = (props) => {
    const anecdotes = props.anecdotes
    const filter_value = props.filter

    return (
        <div>
          <h2>Anecdotes</h2>
          {anecdotes
          .filter(anecdote=>anecdote.content.toLowerCase().includes(filter_value.toLowerCase()))
          .sort((a,b) => (b.votes - a.votes))
          .map(anecdote => 
            <Anecdote anecdote={anecdote} handleVote={() => {
              props.voteAnecdote(anecdote);
              props.setNotification(`you voted '${anecdote.content}'`,5)}
            } />
          )}
        </div>
    )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter,
    notification: state.notification
  }
}

const mapDispatchToProps = {
  voteAnecdote,
  setNotification
}

const ConnectedAnecdoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)

export default ConnectedAnecdoteList


//-------------------- Before 6.19

// import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { voteAnecdote } from '../reducers/anecdoteReducer'
// import { setNotification } from '../reducers/notificationReducer'

// const Anecdote = ({anecdote,handleVote}) => {
//     return (
//       <div key={anecdote.id}>
//         <div>
//           {anecdote.content}
//         </div>
//         <div>
//           has {anecdote.votes}
//           <button onClick={handleVote}>vote</button>
//         </div>
//       </div>
//     )
// }


// const AnecdoteList = () => {
//     const anecdotes = useSelector(state => state.anecdotes)
//     const dispatch = useDispatch()
//     const filter_value = useSelector(state => state.filter)

//     return (
//         <div>
//           <h2>Anecdotes</h2>
//           {anecdotes
//           .filter(anecdote=>anecdote.content.toLowerCase().includes(filter_value.toLowerCase()))
//           .sort((a,b) => (b.votes - a.votes))
//           .map(anecdote => 
//             <Anecdote anecdote={anecdote} handleVote={() => {
//               dispatch(voteAnecdote(anecdote));
//               dispatch(setNotification(`you voted '${anecdote.content}'`,5))}
//             } />
//           )}
//         </div>
//     )
// }

// export default AnecdoteList

