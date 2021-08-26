import React, { useState } from 'react'

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const Header = (props) => <div><h1>{props.text}</h1></div>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blod tests when dianosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length+1).join('0').split('').map(parseFloat))
  const [maxVote, setMaxVote] = useState(selected)

  const handleVote = () => {
    let newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
    if(newVotes[selected]>newVotes[maxVote])
      setMaxVote(selected)
  } 
  
  return (
    <div> 
      <Header text={"Anecdote of the day"}/>
      <div>{anecdotes[selected]}</div>
      <div>{ "has " + votes[selected] + " votes"} </div>

      <div>
        <button onClick={handleVote}>vote</button>
        <button onClick={() => setSelected(getRandomInt(7))}>next anecdotes</button>
      </div>

      <Header text={"Anecdote with most votes"}/>
      <div>{anecdotes[maxVote]}</div>
    </div>
  )
}

export default App