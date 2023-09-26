import { Link } from 'react-router-dom'
import { Nav, Navbar} from 'react-bootstrap'
import PlacesAutocomplete from 'react-places-autocomplete'
import './NavigationBar.css'

interface NavigationBarProps {
  address: any;
  handleChange: any;
  handleSelect: any;
}

const NavigationBar: React.FC<NavigationBarProps> = ({address, handleChange, handleSelect}) => {
  return (
        <Navbar expand="lg">
          
      <PlacesAutocomplete
      value={address}
      onChange={handleChange}
      onSelect={handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input {...getInputProps({ placeholder: 'Search for a location' })} className='searchbar' />
          <div>
            {loading ? <div>Loading...</div> : null}
            {suggestions.map((suggestion) => {
              const style = {
                backgroundColor: suggestion.active ? 'white' : 'transparent',
              };
              return (
                <div {...getSuggestionItemProps(suggestion, { style })}>
                  {suggestion.description}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav><Link to={'/'}>Home</Link></Nav>
          <Nav><Link to={'/compareweather'}>Compare</Link></Nav>
          <Nav><Link to={'/temperaturetrends'}>Temp Trends</Link></Nav>
          <Nav><Link to={'/windspeedtrends'}>Wind Trends</Link></Nav>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    
  )
}

export default NavigationBar