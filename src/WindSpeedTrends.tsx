import axios from 'axios'
import  { useEffect, useState } from 'react'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts'
import './WindSpeedTrends.css'
import { format } from 'date-fns'

interface WindSpeedTrendsProps {
    weatherData: any;
  }

const WindSpeedTrends: React.FC<WindSpeedTrendsProps>  = ({ weatherData }) => {

    const [windSpeedChartData, setWindSpeedChartData] = useState([])

    useEffect(() => {
        if(weatherData?.coord) {
            axios
            .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&cnt=40&appid=e17d9f28655ac27f972639f336659737`)
            .then((response) => {
                console.log(response.data)
                const temperatureData = response.data.list.map((item: any) => ({
                    time: format(new Date(item.dt * 1000), 'MM/dd HH:mm'),
                    wind: item.wind.speed
                }))
                setWindSpeedChartData(temperatureData)
            })
        }
        


    }, [weatherData])
    return (
        <div className='wind-speed-trends-container'>
            <h2>Wind Speed Trends</h2>
            <p>({weatherData?.name})</p>
            <ResponsiveContainer width={'100%'} height={400}>
                <LineChart width={550} height={400} data={windSpeedChartData}>
                    <CartesianGrid />
                    <XAxis dataKey={'time'} className='x-axis' stroke='white' />
                    <YAxis stroke='white' />
                    <Tooltip formatter={(value, name) => [`${value} mph`, name]}  />
                    <Legend />
                    <Line type="monotone" dataKey="wind"  activeDot={{ r: 5 }} stroke='black' />
                </LineChart>
            </ResponsiveContainer>
        </div>

    )
}

export default WindSpeedTrends