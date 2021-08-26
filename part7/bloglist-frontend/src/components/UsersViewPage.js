import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import React from 'react'
import { Page } from '../styles/styledComponents'

const UsersViewPage = () => {
  const allUsers = useSelector(state => state.allUsers)
  return (
    <Page>
      <h2>blog app</h2>
      <h2>Users</h2>
      <table>
        <tr>
          <td></td>
          <td>
            <b>blogs created</b>
          </td>
        </tr>
        {allUsers.map(user => <tr key={user.id}>
          <td>
            <Link to={`/users/${user.id}`}> {user.username} </Link>
          </td>
          <td>
            {user.blogs.length}
          </td>
        </tr>)}
      </table>
    </Page>
  )
}

export default UsersViewPage