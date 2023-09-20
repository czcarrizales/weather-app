import { useEffect, useState } from 'react'
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {format} from 'date-fns'
import './App.css'

function App() {

  const [weatherData, setWeatherData] = useState<any>(null)
  const [temperatureChartData, setTemperatureChartData] = useState(null)
  const [windChartData, setWindChartData] = useState(null)
  const [minChartTemperature, setMinChartTemperature] = useState(null)
  const [maxChartTemperature, setMaxChartTemperature] = useState(null)
  const [minChartDT, setMinChartDT] = useState(null)
  const [maxChartDT, setMaxChartDT] = useState(null)
  const [temperature, setTemperature] = useState(null)
  const [unit, setUnit] = useState<string | null>(null);
  const [locationQuery, setLocationQuery] = useState(null)
  const apiKey = 'e17d9f28655ac27f972639f336659737'

  const getData = async () => {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=e17d9f28655ac27f972639f336659737')
      setWeatherData(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Error getting the weather data: ', error)
    }
  }

  const getCurrentLocationWeatherData = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=e17d9f28655ac27f972639f336659737`)
            setWeatherData(response.data)
            console.log(response.data)
          } catch (error) {
            console.error('Error getting current weather data:', error)
          }
        }
      )
    } else {
      console.log('Geolocation is not available.')
    }
  }

  const getRandomLocationWeatherData = async () => {
    const randomLatitude = -90 + (Math.random() * (90 - -90));
    const randomLongitude = -180 + (Math.random() * (180 - -180));
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${randomLatitude}&lon=${randomLongitude}&appid=e17d9f28655ac27f972639f336659737`)
      setWeatherData(response.data)
      setTemperature(response.data.main.temp)
      setUnit('kelvin')
      console.log(response.data)
    } catch (error) {
      console.error('Error getting current weather data:', error)
    }
  }

  const handleInputChange = (event: string) => {
    setLocationQuery(event.target.value)
  }

  const displayKelvin = () => {
    const kelvin = weatherData?.main.temp
    setTemperature(kelvin)
    setUnit('kelvin')
  }

  const displayFahrenheit = () => {
      const fahrenheit = ((weatherData?.main.temp - 273.15) * (9 / 5) + 32).toFixed(2);
      setTemperature(fahrenheit);
      setUnit('fahrenheit');
  }

  const displayCelsius = () => {
      const celsius = (((weatherData?.main.temp - 32) * 5) / 9).toFixed(2);
      setTemperature(celsius);
      setUnit('celsius');
  }

  useEffect(() => {
    axios
    .get(`https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&cnt=40&appid=e17d9f28655ac27f972639f336659737`)
      .then((response) => {
        console.log(response.data)
        const temperatureData = response.data.list.map((item) => ({
          time: item.dt,
          temperature: (((item.main.temp - 273.15) * 9/5) + 32).toFixed(2),
        }));
        const windData = response.data.list.map((item) => ({
          time: item.dt,
          wind: item.wind.speed
        }))
        const minTemperature = Math.min(temperatureData.map((item) => item.temperature))
        const maxTemperature = Math.max(temperatureData.map((item) => item.temperature))
        const minDT = Math.min(temperatureData.map((item) => item.dt))
        const maxDT = Math.max(temperatureData.map((item) => item.dt))
        setTemperatureChartData(temperatureData);
        setWindChartData(windData)
        setMinChartTemperature(minTemperature)
        setMaxChartTemperature(maxTemperature)
        setMinChartDT(minDT)
        setMaxChartDT(maxDT)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [])

  return (
    <>
    <a href="">Default</a>
    <a href="">Wind Speed</a>
    <a href="">Temperature Trends</a>
    <br />
    <h2>Wind Speed Trends</h2>
    <LineChart width={550} height={400} data={windChartData}>
        <CartesianGrid />
        <XAxis dataKey={'time'} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="wind" stroke="#8884d8" activeDot={{ r: 5 }} />
      </LineChart>
    <br />
    <h2>Temperature Trends (5 day / 3 hour)</h2>
    <LineChart width={550} height={400} data={temperatureChartData}>
        <CartesianGrid />
        <XAxis dataKey={'time'} domain={[minChartDT, maxChartDT]} />
        <YAxis domain={[minChartTemperature - 1, maxChartTemperature + 1]} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 5 }} />
      </LineChart>
    <br />
      <nav>
        <a href="">Text</a>
        <a href="">Maps</a>
      </nav>
      <p>Location: {weatherData?.name !== '' ? weatherData?.name : 'Remote Area'}</p>
      <p>Temperature: {temperature}{unit !== null && (unit === 'kelvin' ? ' K' : unit === 'celsius' ? '\u00b0 C' : '\u00b0 F')}</p>
      <button onClick={displayKelvin}>Kelvin</button>
      <button onClick={displayFahrenheit}>Fahrenheit</button>
      <button onClick={displayCelsius}>Celsius</button>
      <p>Humidity: {weatherData?.main.humidity}</p>
      <p>Weather: {weatherData?.weather[0].description}</p>
      <p>Latitude: {weatherData?.coord.lat}</p>
      <p>Longitude: {weatherData?.coord.lon}</p>
      <button onClick={getData}>Get Weather Data</button>
      <button onClick={getCurrentLocationWeatherData}>Get Current Location Weather Data</button>
      <button onClick={getRandomLocationWeatherData}>Get Random Location Weather Data</button>
      <br />
      <input type="text" value={locationQuery} onChange={handleInputChange} />
      <button>Search By Location</button>
    </>
  )
}

export default App
