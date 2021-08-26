import React from 'react'

const Filter =({query,handleQuery}) =>{
    return (
        <div>find countries <input value={query} onChange={handleQuery}/></div>
    )
}

export default Filter