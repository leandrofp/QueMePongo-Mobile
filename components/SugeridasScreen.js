import { Button, Text, View } from 'react-native';
import React from 'react';

console.ignoredYellowBox=true;

const apikey = '0efd092318208df58c1aa6a0a64c4ec6' ;

export default class SugeridasScreen extends React.Component {

  // POCO PRECISA, BUSCAR ALTERNATIVA (SIRVE DE ENTRADA)
       
  
  state = {
		loading: false,
		error: false,
		location: '',
		temperature: 0,
		humidity: 0,
		weather: '',
		minTemp: 0,
		maxTemp: 0,
		windSpeed: 0
	};

 
  fetchLocationId = async city => {  // busca el ID de la ciudad que necesites el clima, despues ver como la obtengo  automatico
    const response = await fetch(
      `https://www.metaweather.com/api/location/search/?query=${city}`      // ACTUALIZAR!!!!!

      
    );
    const locations = await response.json();
    return locations[0].woeid;
  }
  
  fetchWeather = async woeid => {   // y esta traeria los datos del clima en relacion a mi ciudad , 464979 es castelar
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=-34.6556&lon=-58.6426&APPID=0efd092318208df58c1aa6a0a64c4ec6`
      //[-34.6556, -58.6426] CASTELAR
		);
		
    const { title, consolidated_weather } = await response.json();
    const {
      weather_state_name,
      the_temp,
      humidity,
      min_temp,
      max_temp,
      wind_speed
    } = consolidated_weather[0];
  }

  componentDidMount(){
    this.handleUpdateLocation("castelar")
  }

  handleUpdateLocation = async city => {
		if (!city) return;

		this.setState({ loading: true }, async () => {
			try {
				const locationId = await fetchLocationId(city);
				const {
					location,
					weather,
					temperature,
					humidity,
					minTemp,
					maxTemp,
					windSpeed
				} = await fetchWeather(locationId);

				this.setState({
					loading: false,
					error: false,
					location,
					weather,
					temperature,
					humidity,
					minTemp,
					maxTemp,
					windSpeed
				});
			} catch (e) {
				this.setState({
					loading: false,
					error: true
				});
			}
		});
	};
  

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>SUGERIDAS</Text>
        {/* <View>
          <Text>TEMPERATURA</Text>
          <Text>{this.state.temperature}</Text>


        </View> */}
     
      </View>
    );
  }
}