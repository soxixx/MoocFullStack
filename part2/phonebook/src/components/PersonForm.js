import React from 'react'

const PersonForm = ({onSubmit,nameValue,numValue,nameChange,numChange}) =>{
    return (
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={nameValue} onChange={nameChange}/>
        </div>
        <div>
          number: <input value={numValue} onChange={numChange}/>
        </div>
        
        <div><button type="submit">add</button></div>
      </form>
    )
  }

export default PersonForm