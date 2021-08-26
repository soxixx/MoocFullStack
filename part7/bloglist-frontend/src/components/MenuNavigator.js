import React from 'react'
import {  useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutSignedInUser } from '../reducers/signedInUserReducer'
import { Navigation } from '../styles/styledComponents'

const MenuNavigator = () => {
  const signedInUser = useSelector(state => state.signedInUser)
  const dispatch = useDispatch()
  return (
    <Navigation >
      <Link to='/'> blogs </Link>
      <Link to={'/users'}> users </Link>
      {signedInUser.name} logged in
      <button type="submit" onClick={() =>
        dispatch(logoutSignedInUser())}> logout </button>
    </Navigation>
  )
}

export default MenuNavigator