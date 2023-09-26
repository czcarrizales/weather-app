import axios from 'axios'
import { useEffect, useState } from 'react'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from 'recharts'
import './TemperatureTrends.css'
import { format } from 'date-fns'

interface TemperatureTrendsProps {
    weatherData: any;
    convertToFahrenheit: any;
  }

const TemperatureTrends: React.FC<TemperatureTrendsProps> = ({weatherData, convertToFahrenheit}) => {
    const [temperatureChartData, setTemperatureChartData] = useState([])

    useEffect(() => {
        if(weatherData?.coord) {
            axios
            .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&cnt=40&appid=e17d9f28655ac27f972639f336659737`)
            .then((response) => {
              console.log(response.data)
              const temperatureData = response.data.list.map((item: any) => ({
                  time: format(new Date(item.dt * 1000), 'MM/dd HH:mm'),
                  temperature: convertToFahrenheit(item.main.temp)
              }))
              setTemperatureChartData(temperatureData)
            })
        }
      
      
    }, [weatherData])

  return (
    <div className='temperature-trends-container'>
        <h2>Temperature Trends</h2>
        <p>({weatherData?.name})</p>
        <ResponsiveContainer className={'temperature-chart-container'} width={'100%'} height={400}>
        <LineChart data={temperatureChartData}>
        <CartesianGrid />
        <XAxis dataKey={'time'} stroke='white' />
        <YAxis stroke='white' />
        <Tooltip formatter={(value, name) => [`${value}° F`, name]} />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="black" activeDot={{ r: 5 }} />
      </LineChart>
        </ResponsiveContainer>
      
    </div>
  )
}

export default TemperatureTrends