import './DefaultWeatherView.css'
import { format } from 'date-fns'

interface DefaultWeatherViewProps {
    weatherData: any;
    convertToFahrenheit: (number: number) => string;
    dailyWeatherData: any;
  }

const DefaultWeatherView: React.FC<DefaultWeatherViewProps> = ({ weatherData, convertToFahrenheit, dailyWeatherData }) => {
    
    return (
        <>
            <div className='main-temperature'>
                <h1>{convertToFahrenheit(weatherData?.main.temp)}°</h1>
                <h2>{weatherData?.name !== '' ? weatherData?.name : 'Remote Area'}</h2>
                <div className='main-min-max-container'>
                    <p className='min-temperature'>Min: {convertToFahrenheit(weatherData?.main.temp_min)}°</p>
                    <p className='max-temperature'>Max: {convertToFahrenheit(weatherData?.main.temp_max)}°</p>
                </div>
            </div>
            <div className='forecast-container'>
                <h3>7 Day Forecast</h3>
                <div className="inner-forecast-container">
                {
                    dailyWeatherData?.time.map((date: any, index: any) => {
                        const maxTemp = dailyWeatherData?.temperature_2m_max[index]
                        return (
                            <div className='forecast-box'>
                                <p>{maxTemp}°</p>
                                <p>{format(new Date(date * 1000), 'MM/dd')}</p>
                            </div>
                        )
                    })
                }
                </div>
                
            </div>
            <div className="other-boxes">
                <div className='box'>
                    <p>Wind Speed</p>
                    <p>{weatherData?.wind.speed} mph</p>
                </div>
                <div className='box'>
                    <p>Humidity</p>
                    <p>{weatherData?.main.humidity}%</p>
                </div>
                <div className='box'>
                    <p>Coordinates</p>
                    <p>{weatherData?.coord.lat.toFixed(2) + ', ' + weatherData?.coord.lon.toFixed(2)}</p>
                </div>
                <div className='box'>
                    <p>Pressure</p>
                    <p>{weatherData?.main.pressure} hPa</p>
                </div>
            </div>

        </>
    )
}

export default DefaultWeatherView