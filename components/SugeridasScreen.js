import { Text, View ,  FlatList , Modal, TouchableOpacity, StyleSheet , Alert} from 'react-native';
import { ListItem , Divider } from 'react-native-elements';
import React from 'react';
//import { updateClothes } from '../actions/ropaActions'
import { connect } from 'react-redux';
import { updateClothes , updateSugeridas } from '../actions/ropaActions'
import firebase from 'react-native-firebase';

console.ignoredYellowBox=true;

const apikey = '0efd092318208df58c1aa6a0a64c4ec6' ;

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;


// TODO , CUANDO "ERROR" ESTA EN TRUE DEBE TIRAR ALGUN MODAL, AL CERRARLO CAMBIAR A FALSO

class SugeridasScreen extends React.Component {

	constructor(props){
		super(props)
		this.ref = firebase.firestore().collection('prendas').doc("codigo");
		this.handleLocation = this.handleLocation.bind(this)
		this.state = {
			loading: false,
			error: false,
			location: '',
			temperature: 999,
			weather: '',
			message : '', 
			latitude: '' ,
			longitude: '',
			modalRopa: false, 
			ropa: [], 
			prenda: {}
		};
	}
	

	componentWillMount(){  

    SQLite.openDatabase("ropa.bd").then((DB) => {
      ropa = DB;                            // lo asigna a la global, supongo para poder usar esa despues
      console.log("BD ABIERTA")    
      //console.log(ropa)       
      //this.postOpenDatabase(ropa);
    }).catch((error) => {
      console.log(error);
    
    });
  }

  handleLocation = async () => {
	
			if(!this.state.loading){
				try {
					this.setState({loading : true})

					
					await this.fetchLocation()
					
					//console.log(clima)
						
					
				
				}catch (e) {
					Alert.alert("Error al obtener clima actual")
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
				//console.log("FUNCIONE")	
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
				else if(weather == 'Cloudy' || weather == 'Clouds')
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

				this.BuscarSugeridas(temp);

			},
			(error) => { console.log("ERROR") , this.setState({ message : error.message , error : true , loading:false }),
									 Alert.alert("Error al obtener ubicacion actual")} , 
			{ enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 },		// parametros 
		);
		
	}

	fetchWeather = async (lat,long) => {   // y esta traeria los datos del clima en relacion a mi ciudad 

		console.log("ENTRE A FETCHWEATHER" , lat , long)

		const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=0efd092318208df58c1aa6a0a64c4ec6&units=Metric`);
		
		//Latitud: -34.6556    Longitud: -58.6426				CASTELAR
		var a = response.json();
		return a;

	}

	BuscarSugeridas = (temp) => {

			// POSTERIORMENTE SE HARA CON UN BOTON
			let animo='triste'
			
			let tiempo;
			let arrayTipo;
			let colores;

			let queryTipo='';
			let queryColor='';
			
			// DETERMINO TIEMPO
			if(temp > 20)
				tiempo = 'calor'
			else if(temp >= 10 && temp <= 20)
				tiempo = 'fresco'
			else if(temp < 10)
				tiempo = 'frio'

			switch (tiempo){
				case 'calor':{
						arrayTipo=["Short","Remera","Pollera","Camisa"]
						break;
				}
				case 'fresco':{
					  arrayTipo=["Pantalon","Buzo",""]
						break;
				}
				case 'frio':{
					  arrayTipo=["Campera","Pulover","Pantalon","Buzo"]
						break;
				}
			}		

				// hasta aca pareciera funcionar
			
			switch (animo){
				case 'feliz':{
						colores=["Rojo","Azul","Verde","Amarillo","Rosa"]
						break;
				}
				case 'triste':{
					  colores=["Negro","Gris","Blanco","Ocre"]
						break;
				}
				
			}		
		
			// TODO : IF PREGUNTANDO SI AMBOS VECTORES TIENEN ALGO, SINO SALIR DIRECTAMENTE


			arrayTipo.map((tipo) => {
		
				queryTipo += '"' + tipo + '",'
			})
			queryTipo += '"SOBRA"'
			colores.map((tipo) => {
	
				queryColor += '"' + tipo + '",'
			})
			queryColor += '"SOBRA"'


			//console.log("queryTipo: " + queryTipo)
			//console.log("queryColor: " + queryColor)
			
      ropa.transaction(tx => {
        tx.executeSql(
						'select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Precargada == 0 and t.name IN (' + queryTipo +  ') and r.Color IN (' +
						 queryColor + ') ;').then(([tx,results]) => {
            
              console.log("Query completed");
        
              arraySugeridas=[]
        
							var len = results.rows.length;
							
							if(len > 0){    
								for (let i = 0; i < len; i++) {
									let row = results.rows.item(i);
									console.log(row)
									arraySugeridas.push(row)      
								}
							}
							else
								Alert.alert("No hay prendas en el guardarropas para clima actual y estado de animo" )
													
              // TODO: BORRE ALGO ACA
              //this.setState({modalRopa:false})
            }).catch((error) => {
              //this.setState({modalRopa:false})
              Alert.alert("Fallo la busqueda de sugeridas en la base de datos")
              console.log(error);
            });
          
      }).then( () => {   
              
        const {dispatch} = this.props
        dispatch( updateSugeridas(arraySugeridas) );
             
      }).catch((error) => {
      //this.setState({modalRopa:false})
      Alert.alert("Fallo la busqueda de sugeridas en la base de datos")
      console.log(error);
    });      

		

	}

	usarRopa = () => {

    //this.setState({ropa:[]})

    let arrayGuardarropas;
    let arrayFavoritas;
	 
		console.log("DEBO ACTUALIZAR:" + this.state.prenda.Ropa_Id + " " + this.state.prenda.Name + " " + this.state.prenda.Color + " " + this.state.prenda.Uso )

    ropa.transaction(tx => {
      tx.executeSql(
          `UPDATE Ropa SET Uso = ? where Ropa_Id = ?;`,[this.state.prenda.Uso +1 , this.state.prenda.Ropa_Id]).then(([tx,results]) => {
          
            console.log("Query completed");

              // Tengo que volver a cargar la Ropa con los datos nuevos,  ver si puedo simplemente recargar el registro afectado y no todo
            
              ropa.transaction(tx => {
              tx.executeSql(
                  `select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Precargada == 0;`).then(([tx,results]) => {
                  
                    console.log("Query completed");
        
                    arrayGuardarropas=[]
        
                    var len = results.rows.length;
                    
                    for (let i = 0; i < len; i++) {
                      let row = results.rows.item(i);
                      //console.log(row)
                      arrayGuardarropas.push(row)      // GUARDO SOLO NOMBRE
                    }
                 
                    this.setState({/*ropa:arrayGuardarropas,*/modalRopa:false})
                  }).catch((error) => {
                    this.setState({modalRopa:false})
                    Alert.alert("Fallo la Busqueda en la Base de datos")
                    console.log(error);
                  });

                  tx.executeSql(
                    `select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Uso > 4;`).then(([tx,results]) => {
                    
                      console.log("Query completed");
          
                      arrayFavoritas=[]
          
                      var len = results.rows.length;
                      
                      for (let i = 0; i < len; i++) {
                        let row = results.rows.item(i);
                        //console.log(row)
                        arrayFavoritas.push(row)      // GUARDO SOLO NOMBRE
                      }
                   
                      //this.setState({ropa:arrayGuardarropas,modalRopa:false})
                    }).catch((error) => {
                      this.setState({modalRopa:false})
                      Alert.alert("Fallo la Busqueda en la Base de datos")
                      console.log(error);
                    });

                
            }).then( () => {   
              
              console.log("ARRAY FAVORITAS:   "  , arrayFavoritas);        // aca pega luego de las 3 transacciones
              console.log("ARRAY GUARDARROPAS:   "  , arrayGuardarropas) 
              
              const {dispatch} = this.props
              dispatch( updateClothes(arrayFavoritas,arrayGuardarropas))
							this.BuscarSugeridas(this.state.temperature)
							

            });


          }).catch((error) => {
            this.setState({modalRopa:false})
            Alert.alert("Fallo la actualizacion en la base de datos")
            console.log(error);
          });      
    });
	}
	
	probarPrenda = () => {


		firebase.firestore().runTransaction(async transaction => {
			const doc = await transaction.get(this.ref);
	
			// if it does not exist set the population to one //(NO DEBERIA ENTRAR ACA)
			if (!doc.exists) {
				transaction.set(this.ref, { codigoPrenda: "pase por donde no debia" });
				// return the new value so we know what the new population is
				return 1;
			}
	
			// exists already so lets increment it + 1
			//const newPopulation = doc.data().codigoPrenda + 1;
			nuevoCodigoPrenda = this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor

			transaction.update(this.ref, {
				codigoPrenda: nuevoCodigoPrenda,
			});
	
			// return the new value so we know what the new population is
			return nuevoCodigoPrenda;
		})
		.then(nuevoCodigoPrenda => {
			console.log(`Transaction successfully committed, codigoPrenda es : '${nuevoCodigoPrenda}'.`  );
			this.setState({modalRopa:false});
		})
		.catch(error => {
			console.log('Transaction failed: ', error);
			Alert.alert("Falla en la comunicacion con la aplicacion de escritorio")
			this.setState({modalRopa:false});
		});


	}

	keyExtractor = (item, index) => index;
  
    renderItem = ({ item, index }) => (
      <ListItem 
        containerStyle={{ borderStyle:'solid', backgroundColor:'green', margin:3 , 
                          borderWidth: 2 , borderBottomWidth: 2 , borderBottomColor : 'blue' ,borderColor: 'blue' }}
				title={
					<Text style={styles.lista}> {item.Name} color {item.Color} </Text>
				}
        //leftAvatar={{ source: item.avatar_url, rounded: true }}
        onPress={() => {
          this.setState({ modalRopa: true , prenda : item });
        }}
      />
  );


  render() {

	let ayuda ="Pantalla donde se pueden solicitar\n las sugerencias de ropa de Que Me Pongo"

	if(this.props.ropa.prendasSugeridas.length)		
      data = this.props.ropa.prendasSugeridas
  else{
		data = []	// no hay ropa sugeridas
	}

		//console.log(this.state.temperature , this.state.weather)
		const temperature = this.state.temperature
		const weather = this.state.weather
		

    return (

    <View style={{ flex: 1 , backgroundColor:'orange' }}>

		{/* <View>
		{this.props.ropa.prendasSugeridas.length == 0 &&
				<Text style={styles.vacio}>No hay Prendas Sugeridas</Text>
		}
		</View> */}
		
	  	<FlatList keyExtractor={this.keyExtractor} data={data} renderItem={this.renderItem} />
	  	
	  	<View style={{flex:0  }}>
			<Divider style={{ backgroundColor: 'red' }} />
				<TouchableOpacity
					style = {styles.sugerencias}
					onPress ={this.handleLocation}
				>
					<Text style={styles.sendText}>Pedir sugerencias</Text>
				</TouchableOpacity>
				{/* <Text>Latitude: {this.state.latitude}</Text>
				<Text>Longitude: {this.state.longitude}</Text> */}
				
				{temperature != 999 &&
					<Text style={{fontSize:22, textAlign:'center',fontWeight:'bold' , color:'green'}}>TEMPERATURA: {temperature+'º    '} { weather}  </Text>}
					<Text> {this.state.message}</Text>
				
			</View>
      <Divider style={{ backgroundColor: 'red' }} />
	
			<View style={styles.ayudaContainer} >
    		<Text style={styles.ayuda}>{ayuda}</Text>
    	</View>

			<Modal visible={this.state.modalRopa}>
        <View style={{backgroundColor:'grey', flex:1}}>
            
          <Text style={styles.text}>
            {"Nombre: " + this.state.prenda.Name + ' color ' + this.state.prenda.Color }
          </Text>
          {/* <Text style={styles.text}>
            {"Cantidad disponible: " + this.state.prenda.Cantidad}
          </Text>
          <Text style={styles.text}>
            {"Cantidad de veces que se uso: " + this.state.prenda.Uso}
					</Text> */}
					<View style={{flexDirection:'row' , alignSelf:'center' }}>
						<TouchableOpacity
							style = {styles.send}
							onPress ={this.probarPrenda}   
						
						>
							<Text style={styles.sendText}>Probar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style = {styles.send}
							onPress ={this.usarRopa}   
							disabled={this.state.prenda.Cantidad <= 0} 
						>
							<Text style={styles.sendText}>Usar</Text>
						</TouchableOpacity>
					</View>
					<View style={{flexDirection:'row' , alignSelf:'center' }}>
						<TouchableOpacity
							style = {styles.send}
							onPress ={ () => {this.setState({modalRopa:false})}}
						>
							<Text style={styles.sendText}>Cancelar</Text>
						</TouchableOpacity>
          </View>
        </View>
    	</Modal>
     
    </View>
	);
  }
}

const styles = StyleSheet.create({
    send: {
      margin: 2 ,
      backgroundColor: 'orange',
      borderRadius: 5,
      width: 150 ,
      alignSelf: 'center',
      justifyContent: 'center',
      //fontSize:20,
      padding : 8
    },
    sendText: {
			fontSize:18,
      fontWeight:'bold',
      margin: 2 ,
      color: '#ffffff',
      textAlign:'center'
    },
    text:{
			fontSize: 22,
      color: 'blue',
      alignSelf: 'center',
    },modal: {
      backgroundColor:'orange'
    },
    ayuda:{
      fontWeight:'bold',
      color:'red',
      fontSize: 16,
      textAlign:'center'
    },
    ayudaContainer:{
      alignItems: 'center',
      justifyContent:'center'
	},
	sugerencias: {
		margin: 2 ,
		backgroundColor: 'blue',
		borderRadius: 5,
		width: 200 ,
		alignSelf: 'center',
		justifyContent: 'center',
		//fontSize:20,
		padding : 8
	},
	vacio:{
		fontSize:22 , 
		fontWeight:'bold', 
		alignSelf:'center', 
		color:'red',
		textAlign:'center'
	},lista:{
		color:'#F3EBEB',
		fontSize:18,
	}
  });

const mapStateToProps = state => {
    const { ropa } = state;
        return {
           ropa
        };
  };
  
export default connect(mapStateToProps)(SugeridasScreen);