import React , { useState } from 'react'
import Select from 'react-select'
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries'
import { useMutation } from '@apollo/client'

const Authors = (props) => {
  const authors = props.authors
  const options = authors.map(author => ({value: author.name, label:author.name}))
  const [selectedOption, setSelectedOption] = useState(null)
  const [born, setBorn] = useState(null)

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      props.setError(error.graphQLErrors[0].message)
    }
  })

  const localToken = localStorage.getItem('library-user-token')

  const updateAuthorView = () => {
    return (
      <div>
        <h2>Set birthday</h2>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
        />
        <div>
          born
          <input type='number' onChange={({ target }) => setBorn(Number(target.value))}/>
          <button onClick={updateAuthor}>update author</button>
        </div>
      </div>
    )
  }

  if (!props.show) {
    return null
  }

  const updateAuthor = (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: selectedOption.value, setBornTo: born }})
    setSelectedOption(null)
    setBorn(null)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      {localToken && updateAuthorView()}
      
    </div>
  )
}

export default Authors
