import React from 'react'

const Notification = ({ message, color }) => {
    if (message === null) {
      return null
    }
    const NotificaitonStyle = {
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    NotificaitonStyle.color = color
  
    return (
      <div style={NotificaitonStyle}>
        {message}
      </div>
    )
  }
 
export default Notification