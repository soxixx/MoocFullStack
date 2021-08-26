import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({capital}) =>{
    const [weather, setWeather] = useState(null)
    useEffect(() => {
      const api_key = process.env.REACT_APP_API_KEY
      axios
        .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
        .then(response => {
          setWeather(response.data.current)
          console.log(weather)
        })
    }, [weather,capital]);

    if (weather === null){
      return <div><h3>Weather in {capital} not ready yet</h3></div>
    }
    else{
      return (
        <div>
          <h3>Weather in {capital}</h3>
          <div><b>temperature: </b>{weather.temperature} Celcius</div>
          <div><img src={weather.weather_icons} alt={`weather in ${capital}`} width="100px" height="100px" /></div>
          <div><b>wind: </b>{weather.wind_speed} Kmph direction {weather.wind_dir}</div>
        </div>
      )}
}

export default Weather