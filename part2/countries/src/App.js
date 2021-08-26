import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Filter from './components/Filter'

const App = () => {
  const [query, setQuery] = useState('')
  const [res,setRes] = useState([])

  const handleQuery = (event) =>{
    setQuery(event.target.value)
  }

  useEffect(() => {    
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        if (query === '') setRes([])
        else setRes(response.data.filter(country => country.name.toLowerCase().includes(query.toLowerCase())))
      })
  }, [query]);

  return (
    <div>
      <Filter res={res} handleQuery={handleQuery}/>
      <Countries res={res} setQuery={setQuery}/>
      
    </div>
  )
}

export default App
