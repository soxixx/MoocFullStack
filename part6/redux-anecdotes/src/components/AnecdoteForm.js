import React from 'react'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteForm = (props) => {
    const addAnecdote = async (event) => {
      event.preventDefault()
      const content = event.target.new_anecdote.value
      event.target.new_anecdote.value = ''
      props.createAnecdote(content)
      props.setNotification(`you created '${content}'`,5)
    }

    return (
        <div>
          <h2>create new</h2>
          <form onSubmit={addAnecdote}>
            <div><input name='new_anecdote'/></div>
            <button>create</button>
          </form>
        </div>
    )
}

export default connect(
  null, 
  { 
    createAnecdote,
    setNotification 
  }
)(AnecdoteForm)

//-------------------- Before 6.19

// import React from 'react'
// import { useDispatch } from 'react-redux'
// import { createAnecdote } from '../reducers/anecdoteReducer'
// import { setNotification } from '../reducers/notificationReducer'

// const AnecdoteForm = () => {
//     const dispatch = useDispatch()

//     const addAnecdote = async (event) => {
//       event.preventDefault()
//       const content = event.target.new_anecdote.value
//       event.target.new_anecdote.value = ''
//       dispatch(createAnecdote(content))
//       dispatch(setNotification(`you created '${content}'`,5))
//     }

//     return (
//         <div>
//           <h2>create new</h2>
//           <form onSubmit={addAnecdote}>
//             <div><input name='new_anecdote'/></div>
//             <button>create</button>
//           </form>
//         </div>
//     )

// }

// export default AnecdoteForm