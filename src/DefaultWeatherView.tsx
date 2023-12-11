import './DefaultWeatherView.css'
import { format, getHours } from 'date-fns'

interface DefaultWeatherViewProps {
    weatherData: any;
    convertToFahrenheit: (number: number) => string;
    dailyWeatherData: any;
    hourlyWeatherData: any;
    loadingWeatherData: boolean;
}

const DefaultWeatherView: React.FC<DefaultWeatherViewProps> = ({ weatherData, convertToFahrenheit, dailyWeatherData, hourlyWeatherData, loadingWeatherData }) => {

    const getWeatherCodeIcon = (weatherCode: number) => {
        switch (weatherCode) {
            case 0:
                return 'fa-sun'
            case 1:
            case 2:
            case 3:
                return 'fa-cloud'
            case 45:
            case 48:
                return 'fa-smog'
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
            case 61:
            case 63:
            case 65:
                return 'fa-cloud-rain'
            case 71:
            case 73:
            case 75:
            case 77:
                return 'fa-snowflake'
            case 80:
            case 81:
            case 82:
                return 'fa-cloud-showers-heavy'
            case 85:
            case 86:
                return 'fa-snowflake'
            case 95:
            case 96:
            case 99:
                return 'fa-cloud-bolt'
            default:
                break
        }
    }

    const getOpenWeatherCodeDescription = (weatherCodeId: number) => {
        const weatherCodeString = String(weatherCodeId)
        const weatherCodeGroup = Number(weatherCodeString[0])
        console.log(weatherCodeGroup)
        switch(weatherCodeGroup) {
            case 2:
                return "You may be in for a shock! Beware of Thunderstorms!"
            case 3:
                return "You hear the pitter patter sounds? Some drizzle may be occuring!"
            case 5:
                return "Take that umbrella! Or buy one! Rain incoming, so don't get it all over your clothes!"
            case 6:
                return "Snowmen, snowballs, and snow forts. Wouldn't you know it, it's snowing!"
            case 7:
                switch(weatherCodeId) {
                    case 701:
                        return "Feel the cool mist on your skin!"
                    case 711:
                        return "Treat your lungs with care, because there's some smoke out today!"
                    case 721:
                        return "You feel dizzy? That's okay, it may just be the haze."
                    case 731:
                        return "You might want to wear a mask, because there's a lot of dust swirling around!"
                }
                break
            case 8:
                switch(weatherCodeId) {
                    case 800:
                        return "Looks clear right now. Enjoy it!"
                    case 801:
                    case 802:
                    case 803:
                    case 804:
                        return "Some clouds out there today. Get some of that shade!"
                }
                break
            default:
                break
        }
    }

    const getPartOfDay = (time: any) => {
        const timeToHour = Number(format(new Date(time * 1000), 'k'))
        if (timeToHour >= 5 && timeToHour < 12) {
            return 'morning'
        } else if (timeToHour >= 12 && timeToHour < 17) {
            return 'afternoon'
        } else {
            return 'evening'
        }
       
    }

    return (
        <>
            <div className='main-temperature'>
                <h1>{loadingWeatherData ? 'Loading...' : convertToFahrenheit(weatherData?.main.temp) + '°'}</h1>
                <h2 id='main-weather-location'>{loadingWeatherData ? 'Loading...' : weatherData?.name !== '' ? weatherData?.name : 'Remote Area'}</h2>
                <div className='main-min-max-container'>
                    <p className='min-temperature'>Min: {loadingWeatherData ? 'Loading...' : convertToFahrenheit(weatherData?.main.temp_min) + '°'}</p>
                    <p className='max-temperature'>Max: {loadingWeatherData ? 'Loading...' : convertToFahrenheit(weatherData?.main.temp_max) + '°'}</p>
                </div>
            </div>
            <div className='forecast-container'>
                <h3 className='forecast-title'>Summary</h3>
                {
                    loadingWeatherData
                        ?
                        'Loading...'
                        :
                        <div>
                            <p><b>Good {getPartOfDay(weatherData.dt)}!</b></p>
                            <p>It's currently <b>{loadingWeatherData ? 'Loading...' : convertToFahrenheit(weatherData?.main.temp) + '°'}</b>, but it feels like <b>{convertToFahrenheit(weatherData?.main.feels_like) + '°'}</b>!</p>
                                {loadingWeatherData ? 'Loading...' : weatherData?.weather.map((data: any) => {
                                    return <p>{getOpenWeatherCodeDescription(data.id)}</p>
                                })}
                        </div>
                }
            </div>
            <div className='forecast-container seven-day-container'>
                <h3 className='forecast-title'>7 Day Forecast</h3>
                <div className="inner-forecast-container">
                    {
                        loadingWeatherData
                            ?
                            <p className='inner-forecast-loading'>Loading...</p>
                            :
                            dailyWeatherData?.time.map((date: any, index: any) => {
                                const maxTemp = dailyWeatherData?.temperature_2m_max[index]
                                const weatherCode = dailyWeatherData?.weather_code[index]
                                return (
                                    <div className='forecast-box'>
                                        <p className='forecast-temp'>{maxTemp + '°'}</p>
                                        <i className={`fa-solid ${getWeatherCodeIcon(weatherCode)}`}></i>
                                        <p>{format(new Date(date * 1000), 'MM/dd')}</p>
                                    </div>
                                )
                            })
                    }
                </div>

            </div>
            <div className='forecast-container'>
                <h3 className='forecast-title'>Hourly Forecast</h3>
                <div className="inner-forecast-container">
                    {
                        loadingWeatherData
                            ?
                            <p className='inner-forecast-loading'>Loading...</p>
                            :
                            hourlyWeatherData?.time.map((date: any, index: any) => {
                                const temp = hourlyWeatherData?.temperature_2m[index]
                                const weatherCode = hourlyWeatherData?.weather_code[index]
                                return (
                                    <div className='forecast-box'>
                                        <p className='forecast-temp'>{temp + '°'}</p>
                                        <i className={`fa-solid ${getWeatherCodeIcon(weatherCode)}`}></i>
                                        <p>{format(new Date(date * 1000), 'MM/dd')}</p>
                                        <p>
                                            {format(new Date(date * 1000), 'h a')}</p>
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
            <div className='forecast-container'>
                <h3 className='forecast-title'>Other</h3>
                <div className="other-boxes">
                    <div className='box'>
                        <i className="fa fa-solid fa-wind fa-2xl"></i>
                        <p className='box-data'>{loadingWeatherData ? 'Loading...' : weatherData?.wind.speed + 'mph'}</p>
                        <p className='box-text'>Wind</p>
                    </div>
                    <div className='box'>
                        <i className="fa fa-solid fa-droplet fa-2xl"></i>
                        <p className='box-data'>{loadingWeatherData ? 'Loading...' : weatherData?.main.humidity + '%'}</p>
                        <p className='box-text'>Humidity</p>
                    </div>
                    <div className='box'>
                        <i className="fa fa-solid fa-location-crosshairs fa-2xl"></i>
                        <p className='box-data'>{loadingWeatherData ? 'Loading...' : weatherData?.coord.lat.toFixed(2) + ', ' + weatherData?.coord.lon.toFixed(2)}</p>
                        <p className='box-text'>Coordinates</p>
                    </div>
                    <div className='box'>
                        <i className="fa fa-solid fa-arrows-down-to-line fa-2xl"></i>
                        <p className='box-data'>{loadingWeatherData ? 'Loading...' : weatherData?.main.pressure + 'hPa'}</p>
                        <p className='box-text'>Pressure</p>
                    </div>
                    <div className='box'>
                        <i className="fa fa-solid fa-cloud fa-2xl"></i>
                        <p className='box-data'>{loadingWeatherData ? 'Loading...' : weatherData?.clouds.all + '%'}</p>
                        <p className='box-text'>Cloudiness</p>
                    </div>
                    <div className='box'>
                        <i className="fa fa-solid fa-eye fa-2xl"></i>
                        <p className='box-data'>{loadingWeatherData ? 'Loading...' : weatherData?.visibility + 'm'}</p>
                        <p className='box-text'>Visibility</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DefaultWeatherView