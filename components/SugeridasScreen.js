import { Button, Text, View } from 'react-native';
import React from 'react';

console.ignoredYellowBox=true;

const apikey = '0efd092318208df58c1aa6a0a64c4ec6' ;

export default class SugeridasScreen extends React.Component {

  
	
	state = {
		loading: false,
		error: false,
		location: '',
		temperature: 999,
		weather: '',
		message : '' 
	};

	constructor(props){
		super(props)
		this.handleLocation = this.handleLocation.bind(this)
	}
	
  componentDidMount(){
		if(this.state.temperature==999)			// para que no la vuelva a llamar si cambio de tab, me ahorraria bloqueos
    	this.handleLocation()
  }

  handleLocation = async () => {
				
			if(!this.state.loading){
				try {
					this.setState({loading : true})
		
					clima = await this.fetchWeather();
					
					//console.log("DEBERIA TENER LA TEMPERATURA , SE PUEDE AGREGAR LLUVIA")
					//console.log(clima)
					//console.log(clima.weather[0].main)
					//console.log(clima.main.temp)
					
					const weather = clima.weather[0].main
					const temp = Math.round( parseFloat(clima.main.temp))
				
					this.setState({
						loading: false,
						error: false,
						temperature : temp ,
						weather: weather
					});
				
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
	};

  
	  fetchWeather = async () => {   // y esta traeria los datos del clima en relacion a mi ciudad 

		console.log("ENTRE A FETCHWEATHER")

		const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=-34.6556&lon=-58.6426&APPID=0efd092318208df58c1aa6a0a64c4ec6&units=Metric`);
		//Latitud: -34.6556    Longitud: -58.6426				CASTELAR

		//Latitud: -41.1500000 Longitud: -71.3000000	 	BARILOCHE


		var a = response.json();
		return a;
		
  }
  

  render() {

		console.log(this.state.temperature , this.state.weather)
		const temperature = this.state.temperature
		const weather = this.state.weather
		

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>SUGERIDAS!</Text>
         <View>   
					<Text style={{fontSize:22}}>TEMPERATURA: {temperature+'º    '} { weather}  </Text>

					<Text> {this.state.message}</Text>
				
        </View>
     
      </View>
    );
  }
}