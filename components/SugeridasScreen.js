import { Button, Text, View } from 'react-native';
import React from 'react';

console.ignoredYellowBox=true;

const apikey = '0efd092318208df58c1aa6a0a64c4ec6' ;


// TODO , CUANDO "ERROR" ESTA EN TRUE DEBE TIRAR ALGUN MODAL, AL CERRARLO CAMBIAR A FALSO

export default class SugeridasScreen extends React.Component {

  
	
	state = {
		loading: false,
		error: false,
		location: '',
		temperature: 999,
		weather: '',
		message : '', 
		latitude: '' ,
		longitude: '',
	};

	constructor(props){
		super(props)
		this.handleLocation = this.handleLocation.bind(this)
	}
	
  componentDidMount(){
		
	
			if(this.state.temperature==999)		// para que no la vuelva a llamar si cambio de tab, me ahorraria bloqueos (testear si hace falta)
					this.handleLocation()

  }

  handleLocation = async () => {
	
			if(!this.state.loading){
				try {
					this.setState({loading : true})

					
					await this.fetchLocation()
					
					//console.log(clima)
						
					
				
				}catch (e) {
					this.setState({
						loading: false,
						error: true,
						message: "Error al obtener clima actual"
					});
				}
			}
			else{
				//TODO: ESTA CARGANDO 
		
			}
	}

	fetchLocation = async () => {

		navigator.geolocation.getCurrentPosition(
			async (position) => {	
				console.log("FUNCIONE")	
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					error: false,
				});
		
				clima = await this.fetchWeather(position.coords.latitude , position.coords.longitude)
				
				//console.log(clima)
				
				const weather = clima.weather[0].main
				const temp = Math.round( parseFloat(clima.main.temp))
				
				this.setState({
					loading: false,
					error: false,
					temperature : temp ,
					weather: weather
				});

			},
			(error) => { console.log("ERROR") , this.setState({ message : error.message , error : true })} , 
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },
		);
		
	}

	fetchWeather = async (lat,long) => {   // y esta traeria los datos del clima en relacion a mi ciudad 

		console.log("ENTRE A FETCHWEATHER" , lat , long)

		const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=0efd092318208df58c1aa6a0a64c4ec6&units=Metric`);
		
		//Latitud: -34.6556    Longitud: -58.6426				CASTELAR
		//Latitud: -41.1500000 Longitud: -71.3000000	 	BARILOCHE
		var a = response.json();
		return a;

	}
	
	/*const locationId = await fetchLocationId(city);
				const {
					location,
					weather,
					temperature,
					humidity,
					minTemp,
					maxTemp,
					windSpeed
				} = await fetchWeather(locationId);*/
  

  render() {

		//console.log(this.state.temperature , this.state.weather)
		const temperature = this.state.temperature
		const weather = this.state.weather
		

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>SUGERIDAS!</Text>
         <View>   
				  <Text>Latitude: {this.state.latitude}</Text>
          <Text>Longitude: {this.state.longitude}</Text>
					<Text style={{fontSize:22}}>TEMPERATURA: {temperature+'º    '} { weather}  </Text>

					<Text> {this.state.message}</Text>
				
        </View>
     
      </View>
    );
  }
}