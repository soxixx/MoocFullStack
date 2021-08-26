import usersService from '../services/users'

const allUsersReducer = (state=[], action) => {
  if(action.type==='GET_ALL_USERS') return action.data
  return state
}

export const getAllUsers = () => {
  return async dispatch => {
    const all_users = await usersService.getAll()
    dispatch({
      type: 'GET_ALL_USERS',
      data: all_users,
    })
  }
}

export default allUsersReducer