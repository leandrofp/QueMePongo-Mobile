import { Button, Text, View , Alert } from 'react-native';
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
		
			//if(this.state.temperature==999)		// para que no la vuelva a llamar si cambio de tab, me ahorraria bloqueos (testear si hace falta)
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
				Alert.alert("La aplicacion esta cargando la informacion y no esta lista")
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
				
				let weather = clima.weather[0].main
				const temp = Math.round( parseFloat(clima.main.temp))


				/* TRADUCCION CLIMA */

				if(weather == 'Rainy')
					weather = 'Lluvia'
				else if(weather == 'Cloudy')
					weather = 'Nublado'
				else if(weather == 'Clear' || weather == 'Sunny')
					weather = 'Despejado'
				else if(weather == 'Haze')
					weather = 'Neblina'		// nublado ponele
				else if(weather == 'Thunderstorm')
					weather = 'Tormenta Electrica'		// nublado ponele
			

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
		var a = response.json();
		return a;

	}
	

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
					{temperature != 999 &&
						<Text style={{fontSize:22}}>TEMPERATURA: {temperature+'º    '} { weather}  </Text>
					}
					<Text> {this.state.message}</Text>
				
        </View>
     
      </View>
    );
  }
}