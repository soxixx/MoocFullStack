import React, { useState } from 'react'
import Select from 'react-select'

const Books = (props) => {
  const books = props.books

  const genres_array = [].concat(...books.map(book => book.genres))
  const genres_set = [...new Set(genres_array)]

  let options = genres_set.map(genre => ({value: genre, label: genre}))
  options = options.concat({value:'all',label:'all'})
  const [selectedOption, setSelectedOption] = useState('all')

  const books_to_show = selectedOption.value === 'all' ?
                        books :
                        books.filter(book=>book.genres.includes(selectedOption.value))

  if (!props.show) {
    return null
  }
  return (
    <div>
      <h2>books</h2>
      <div>in genre <b>patterns</b></div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books_to_show.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>

      <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
      />
    </div>
  )
}

export default Books