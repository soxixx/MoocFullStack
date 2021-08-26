import React from 'react'

const Header = (props) => {
  return (
    <div>
      <h2>{props.text}</h2>
    </div>
  )
}

const Part = (props) =>{
  return (
    <div>
      <p>{props.name} {props.exe}</p>
    </div>
  )
}

const Content =({parts}) =>{
  return (
    <div>
      {parts.map(part=><Part name={part.name} exe={part.exercises} />)}
    </div>
  ) 
}

const Total = ({parts}) =>{
  const array1 = parts.map(part=>part.exercises)
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  const tot = array1.reduce(reducer)
  return (
    <div>
      <b>total of {tot} exercises</b>
    </div>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header text={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course