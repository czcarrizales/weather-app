import axios from 'axios';
import  {  useState } from 'react'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import './CompareWeather.css'

interface CompareWeatherProps {
    convertToFahrenheit: (number: number) => string;
  }

  type LocationData = { location: string; temperature: string };

const CompareWeather: React.FC<CompareWeatherProps> = ({ convertToFahrenheit}) => {
    
    const [location1Input, setLocation1Input] = useState('')
    const [location2Input, setLocation2Input] = useState('')
    const [location1Data, setLocation1Data] = useState<LocationData[]>([]);
    const [location2Data, setLocation2Data] = useState<LocationData[]>([]);

    const handleLocation1Change = (newAddress: string) => {
        setLocation1Input(newAddress);
    };

    const handleLocation2Change = (newAddress: string) => {
        setLocation2Input(newAddress);
    };

    const handleLocation1Select = async (selectedAddress: string) => {
        try {
            const results = await geocodeByAddress(selectedAddress);
            const latLng = await getLatLng(results[0]);
            const { lat, lng } = latLng;
            searchLocation1Data(lat, lng)
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    };

    const handleLocation2Select = async (selectedAddress: string) => {
        try {
            const results = await geocodeByAddress(selectedAddress);
            const latLng = await getLatLng(results[0]);
            const { lat, lng } = latLng;
            searchLocation2Data(lat, lng)
        } catch (error) {
            console.error('Error fetching location data:', error);
        }
    };

    const searchLocation1Data = async (lat: number, lon: number) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e17d9f28655ac27f972639f336659737`)
            setLocation1Data([{ location: response.data.name, temperature: convertToFahrenheit(response.data.main.temp) }])
        } catch (error) {
            console.error('Error searching and getting current weather data:', error)
        }
    }

    const searchLocation2Data = async (lat: number, lon: number) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e17d9f28655ac27f972639f336659737`)
            setLocation2Data([{ location: response.data.name, temperature: convertToFahrenheit(response.data.main.temp) }])
        } catch (error) {
            console.error('Error searching and getting current weather data:', error)
        }
    }


    return (
        <div className='compare-weather-container'>
            <h2>Temperature Comparison</h2>
            <PlacesAutocomplete
                value={location1Input}
                onChange={handleLocation1Change}
                onSelect={handleLocation1Select}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input {...getInputProps({ placeholder: 'Search for a location' })} />
                        <div>
                            {loading ? <div>Loading...</div> : null}
                            {suggestions.map((suggestion) => {
                                return (
                                    <div {...getSuggestionItemProps(suggestion, )}>
                                        {suggestion.description}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
            <PlacesAutocomplete
                value={location2Input}
                onChange={handleLocation2Change}
                onSelect={handleLocation2Select}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input {...getInputProps({ placeholder: 'Search for a location' })} />
                        <div>
                            {loading ? <div>Loading...</div> : null}
                            {suggestions.map((suggestion) => {
                                return (
                                    <div {...getSuggestionItemProps(suggestion)}>
                                        {suggestion.description}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
            <ResponsiveContainer width={'100%'} height={500}>
                <BarChart width={600} height={400} data={[...location1Data, ...location2Data]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" stroke='white' />
                    <YAxis stroke='white' />
                    <Tooltip formatter={(value, name) => [`${value}° F`, name]} />
                    <Legend />
                    <Bar dataKey="temperature" fill="black" />
                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}

export default CompareWeather