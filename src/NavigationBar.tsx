import { Link } from 'react-router-dom'
import { Nav, Navbar } from 'react-bootstrap'
import PlacesAutocomplete from 'react-places-autocomplete'
import './NavigationBar.css'

interface NavigationBarProps {
  address: any;
  handleChange: any;
  handleSelect: any;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ address, handleChange, handleSelect }) => {
  return (
    <Navbar expand="lg" id='navbar'>
      <Navbar.Brand>Weather App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" className='navbar-toggle' />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto nav-in-collapse">
          <Nav.Item><Nav.Link><Link to={'/'}>Home</Link></Nav.Link></Nav.Item>
          <Nav><Nav.Link><Link to={'/compareweather'}>Compare</Link></Nav.Link></Nav>
          <Nav><Nav.Link><Link to={'/temperaturetrends'}>Temp Trends</Link></Nav.Link></Nav>
          <Nav><Nav.Link><Link to={'/windspeedtrends'}>Wind Speed Trends</Link></Nav.Link></Nav>
          <PlacesAutocomplete
            value={address}
            onChange={handleChange}
            onSelect={handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div id='places-search'>
                <input {...getInputProps({ placeholder: 'Search for a location' })} className='searchbar' />
                <div>
                  {loading ? <div>Loading...</div> : null}
                  {suggestions.map((suggestion) => {
                    const style = {
                      backgroundColor: suggestion.active ? 'white' : 'transparent',
                    };
                    return (
                      <div className='navbar-search-suggestion' {...getSuggestionItemProps(suggestion, { style })}>
                        {suggestion.description}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
        </Nav>
      </Navbar.Collapse>

    </Navbar>

  )
}

export default NavigationBar