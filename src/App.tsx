import { useEffect, useState } from 'react'
import axios from 'axios';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TemperatureTrends from './TemperatureTrends';
import WindSpeedTrends from './WindSpeedTrends';
import DefaultWeatherView from './DefaultWeatherView';
import CompareWeather from './CompareWeather';
import NavigationBar from './NavigationBar';

function App() {

  const [loadingWeatherData, setLoadingWeatherData] = useState<boolean>(true)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [dailyWeatherData, setDailyWeatherData] = useState(null)
  const [hourlyWeatherData, setHourlyWeatherData] = useState(null)

  const getWeatherData = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords

          try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=e17d9f28655ac27f972639f336659737`)
            setWeatherData(response.data)
            const dailyResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timeformat=unixtime&timezone=auto`)
            const hourlyResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code&forecast_days=1&temperature_unit=fahrenheit&timeformat=unixtime&timezone=auto`)
            const dailyWeatherDataArray = dailyResponse.data.daily
            const hourlyWeatherDataArray = hourlyResponse.data.hourly
            setDailyWeatherData(dailyWeatherDataArray)
            setHourlyWeatherData(hourlyWeatherDataArray)
            setLoadingWeatherData(false)
          } catch (error) {
            console.error('Error getting current weather data:', error)
          }
        }
      )
    } else {
      console.log('Geolocation is not available.')
    }
  }

  const getDailyWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weather_code&temperature_unit=fahrenheit&timeformat=unixtime&timezone=auto`)
      console.log(response, 'daily weather')
      const dailyWeatherDataArray = response.data.daily
      console.log(dailyWeatherDataArray)
      setDailyWeatherData(dailyWeatherDataArray)
    } catch (error) {
      console.log(error)
    }
  }

  // const getHourlyWeatherData = async (lat: number, lon: number) => {
  //   try {
  //     const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,weather_code&temperature_unit=fahrenheit&timeformat=unixtime&timezone=auto`)
  //     console.log(response, 'hourly weather')
  //     const hourlyWeatherDataArray = response.data.hourly
  //     console.log(hourlyWeatherDataArray)
  //     setHourlyWeatherData(hourlyWeatherDataArray)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const searchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e17d9f28655ac27f972639f336659737`)
      getDailyWeatherData(lat, lon)
      setWeatherData(response.data)
      setLoadingWeatherData(false)
    } catch (error) {
      console.error('Error searching and getting current weather data:', error)
    }
  }

  const convertToFahrenheit = (number: number) => {
    const fahrenheit = ((number - 273.15) * (9 / 5) + 32).toFixed(0);
    return fahrenheit
  }

  const [address, setAddress] = useState('');
  const handleChange = (newAddress: string) => {
    setAddress(newAddress);
  };

  const handleSelect = async (selectedAddress: string) => {
    try {
      setLoadingWeatherData(true)
      const results = await geocodeByAddress(selectedAddress);
      const latLng = await getLatLng(results[0]);
      const { lat, lng } = latLng;
      setAddress(selectedAddress);
      searchWeatherData(lat, lng)
      console.log(lat, lng)
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  useEffect(() => {
    getWeatherData()
  }, [])

  return (
    <>
      <BrowserRouter>
        <NavigationBar address={address} handleChange={handleChange} handleSelect={handleSelect} />
        <Routes>
          <Route path='/' element={<DefaultWeatherView weatherData={weatherData} convertToFahrenheit={convertToFahrenheit} dailyWeatherData={dailyWeatherData} hourlyWeatherData={hourlyWeatherData} loadingWeatherData={loadingWeatherData} />} />
          <Route path='compareweather' element={<CompareWeather convertToFahrenheit={convertToFahrenheit} />} />
          <Route path='/temperaturetrends' element={<TemperatureTrends weatherData={weatherData} convertToFahrenheit={convertToFahrenheit} />} />
          <Route path='windspeedtrends' element={<WindSpeedTrends weatherData={weatherData} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
