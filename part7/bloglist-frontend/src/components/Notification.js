import { useSelector } from 'react-redux'
import React from 'react'

const Notification = () => {
  const notification= useSelector(state => state.notification)
  if (notification === null) {
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

  NotificaitonStyle.color = notification.color

  return (
    <div className="error" style={NotificaitonStyle}>
      {notification.msg}
    </div>
  )
}

export default Notification