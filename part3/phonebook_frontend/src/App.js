import React, { useState, useEffect } from 'react'

import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

import personService from './services/PersonService'

function contains(arr,ele){
  arr = arr.toLowerCase()
  ele = ele.toLowerCase()
  if (null === arr.match(ele)){return false}
  else {return true}
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ noticeMessage, setNoticeMessage ] = useState(null)
  const [ noticeColor, setNoticeColor ] = useState('green')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const handleNewName = (event) => setNewName(event.target.value)
  const handleNewNumber = (event) => setNewNumber(event.target.value)
  const handleNewFilter = (event) => setNewFilter(event.target.value)

  const toNotify = (msg) =>{
    setNoticeMessage(msg)
    setTimeout(() => {
      setNoticeMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const currentPerson = persons.find(person => person.name === newName)
    if (null == currentPerson){
      const personObject = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
      }
      personService
        .create(personObject)
        .then(returnedPerson=>{
          setPersons(persons.concat(returnedPerson))
          setNoticeColor('green')
          toNotify(`Added ${newName}`)
        })
        .catch(error =>{
          // console.log(error.response.data.error)
          setNoticeColor('red')
          toNotify(error.response.data.error)
        })
    }
    else{
      const sameNameAndNum = currentPerson.number === newNumber
      if (!sameNameAndNum){
        const confirmUpdate = (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one? `))
        if (confirmUpdate) { 
          const updatedPerson = { ...currentPerson, number: newNumber}
          personService
            .update(updatedPerson.id, updatedPerson)
            .then(response => {
              setPersons(persons.map(person => person.id !== updatedPerson.id ? person :response))
              setNoticeColor('green')
              toNotify(`Info of ${newName} has been Updated `)
            })
            .catch(
              error => {
                // console.log(`Information of ${newName} has already been removed from server`)
                setNoticeColor('red')
                toNotify(error.response.data.error)
              }
            )
        } 
      }
      else window.alert(`${newName} is already added to phonebook`)
    }
    setNewName('')
    setNewNumber('') 
  }

  const handleDelete = (person) => {
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    if (confirmDelete) {
      personService
        .deletePerson(person)
        .then(() => {
          setPersons(persons.filter(one => one.id !== person.id))
        })
        .catch(() => {
          alert(`The person ${person.name} was already deleted from the server.`)
          setPersons(persons.filter(one => one.id !== person.id))
        })
    }
  }

  const personsToShow = '' === newFilter ? persons : persons.filter(person => contains((person.name),newFilter))

  return (
    <div>
       <Notification message={noticeMessage} color={noticeColor}/>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleNewFilter} />

      <h3>Add a new</h3>
      <PersonForm onSubmit={addPerson} nameValue={newName} numValue={newNumber} nameChange={handleNewName} numChange={handleNewNumber}/>

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App