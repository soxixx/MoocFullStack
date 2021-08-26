let timeoutID;
const notificationReducer  = (state=null, action) => {
    if(action.type === 'TO_NOTIFY') return action.data
    else if (action.type === 'CLEAR') return null
    else return state
}

export const clearNotification = () => {
    return {
        type : 'CLEAR'
    }
}

export const setNotification = (msg,time) => {
    return async dispatch => {
        dispatch({
            type : 'TO_NOTIFY',
            data : msg
        })
        clearTimeout(timeoutID)
        timeoutID = setTimeout(() => {dispatch(clearNotification())}, 1000*time)
    }
}

export default notificationReducer