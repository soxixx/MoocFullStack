import React from 'react'

const Recommended = (props) => {
  const books = props.books_to_recommend

  if (!props.show) {
    return null
  }
  return (
    <div>
      <h2>Recommendations</h2>
      <div>books in you favorite genre <b>patterns</b></div>
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
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended

