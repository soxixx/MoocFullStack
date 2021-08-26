import React from 'react'
import Weather from './Weather'

const Country = ({country}) =>{
    return (
        <div>
        <h1>{country.name}</h1> 
        <div>capital {country.capital}</div>
        <div>population {country.population}</div>
        <h2>languages</h2>
        <ul>{country.languages.map(language=><li key={language.name}>{language.name}</li>)}</ul>
        <div><img src={country.flag} alt={`national flag of ${country.name}`} width="150px" height="150px" /></div>
        <Weather capital={country.capital}/>
        </div>
    )
}
 
const Countries = ({res,setQuery}) => {
    if (res.length > 10) return <div>{"Too many matches, specify another"}</div>
    else if(res.length > 1) {
        return (
        res.map(country=><div key={country.name}>{country.name}
            <button onClick={() => setQuery(country.name)}> Show</button></div>)
        )
    }
    else {
        if (res.length === 1) return <Country country={res[0]}/>
        else return <div>no result</div>
    }
}

export default Countries