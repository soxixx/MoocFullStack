import React, { useState } from 'react'

const Header = (props) => <h1>{props.text}</h1>

const Statistic = (props) => {
  const { text, value } = props
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad} = props
  if (good === 0 && neutral === 0 && bad === 0) {
    return (<div>No feedback given</div>)
  }
  return (
    <table>
      <Statistic text={"good"} value={good}/>
      <Statistic text={"neutral"} value={neutral}/>
      <Statistic text={"bad"} value={bad}/>
      <Statistic text={"all"} value={bad+good+neutral}/>
      <Statistic text={"average"} value={(good-bad)/(good+bad+neutral)}/>
      <Statistic text={"positive"} value={100*good/(bad+good+neutral) + " %"}/>
    </table>
  )
}

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header text={"give feedback"}/>
      <button onClick={() => setGood(good + 1)}>good</button>
      <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
      <button onClick={() => setBad(bad + 1)}>bad</button>

      <Header text={"statistics"}/>
      <Statistics good={good} neutral={neutral} bad={bad}/>
      
    </div>
  )
}

export default App