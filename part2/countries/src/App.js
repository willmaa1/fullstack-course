import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({capital}) => {
  const [newWeather, setWeather] = useState([])
  
  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${process.env.REACT_APP_API_KEY}&units=metric`)
      .then(response =>{
        setWeather(response.data)
      })
  }, [capital])

  if (newWeather.length === 0)
    return (<></>)
  return(
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {newWeather.main.temp} Celsius</p>
      <img alt={newWeather.weather[0].description} src={`https://openweathermap.org/img/wn/${newWeather.weather[0].icon}@2x.png`} />
      <p>wind {newWeather.wind.speed} m/s</p>
    </div>
  )
}


const Country = ({country}) =>
  <div>
    <h1>{country.name.common}</h1>
    <p>capital {country.capital[0]}</p>
    <p>area {country.area}</p>
    <h2>languages:</h2>
    <ul>
      {Object.values(country.languages).map((lang) => <li key={lang}>{lang}</li>)}
    </ul>
    <img alt={`${country.name.common} flag`} src={country.flags.png} />
    <Weather capital={country.capital[0]}/>
  </div>


const App = () => {

  const [countries, setCountries] = useState([])
  const [newFilter, setFilter] = useState("")
  
  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(response =>{
        setCountries(response.data)
      })
  }, [])

  const filtered = countries.filter((country) => country.name.common.toLocaleLowerCase().includes(newFilter.toLocaleLowerCase()))


  let countrydata;
  if (filtered.length > 10) {
    countrydata = <div>Too many matches, specify another filter</div>
  } else if (filtered.length > 1) {
    countrydata =
      <div>{filtered.map((country) =>
        <p key={country.name.common}>{country.name.common} <button onClick={() => setFilter(country.name.common)}>show</button></p>
      )}</div>
  } else if (filtered.length === 1) {
    countrydata = <div><Country country={filtered[0]}/></div>
  } else {
    countrydata = <div>No matches</div>
  }

  return (
    <>
    <div>find countries <input value={newFilter} onChange={(e) => setFilter(e.target.value)} /></div>
    {countrydata}
  </>
  )
}

export default App