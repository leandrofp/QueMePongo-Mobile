import { Text, View ,  FlatList , Modal, TouchableOpacity, StyleSheet , Alert,Image} from 'react-native';
import { ListItem , Divider } from 'react-native-elements';
import React from 'react';
//import { updateClothes } from '../actions/ropaActions'
import { connect } from 'react-redux';
import { updateClothes , updateSugeridas } from '../actions/ropaActions'
import firebase from 'react-native-firebase';
import { RNCamera } from 'react-native-camera';
import ImageRotate from 'react-native-image-rotate';
import ImgToBase64 from 'react-native-image-base64';
import RNFetchBlob from 'rn-fetch-blob'
//import { Buffer } from 'buffer'

console.ignoredYellowBox=true;

const apikey = '0efd092318208df58c1aa6a0a64c4ec6' ;

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;

var PantalonHombreAmarillo = require('../assets/PantalonHombreAmarillo.png');
var PantalonHombreAzul = require('../assets/PantalonHombreAzul.png');
var PantalonHombreGris = require('../assets/PantalonHombreGris.png');
var PantalonHombreNegro = require('../assets/PantalonHombreNegro.png');

var RemeraHombreAmarillo = require('../assets/RemeraHombreAmarillo.png');
var RemeraHombreAzul = require('../assets/RemeraHombreAzul.png');
var RemeraHombreGris = require('../assets/RemeraHombreGris.png');
var RemeraHombreNaranja = require('../assets/RemeraHombreNaranja.png');
var RemeraHombreNegro = require('../assets/RemeraHombreNegro.png');
var RemeraHombreRojo = require('../assets/RemeraHombreRojo.png');
var RemeraHombreVerde = require('../assets/RemeraHombreVerde.png')


var VestidoMujerAmarillo = require('../assets/VestidoMujerAmarillo.png');
var VestidoMujerAzul = require('../assets/VestidoMujerAzul.png');
var VestidoMujerBlanco = require('../assets/VestidoMujerBlanco.png');
var VestidoMujerNaranja = require('../assets/VestidoMujerNaranja.png');
var VestidoMujerNegro = require('../assets/VestidoMujerNegro.png');
var VestidoMujerRojo = require('../assets/VestidoMujerRojo.png');
var VestidoMujerRosa = require('../assets/VestidoMujerRosa.png');
var VestidoMujerVioleta = require('../assets/VestidoMujerVioleta.png');

var facetest = require('../assets/facetest.jpg');


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
			prenda: {},
			animo:'',
			focusedScreen: true,
			getAnimo: false,
			frontal: true

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
	
	componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }

  handleLocation = async () => {
	
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

				if(weather == 'Rainy' || weather == 'Rain')
					weather = 'Lluvia'
				else if(weather == 'Cloudy' || weather == 'Clouds')
					weather = 'Nublado'
				else if(weather == 'Clear' || weather == 'Sunny')
					weather = 'Despejado'
				else if(weather == 'Haze' || weather == 'Mist')
					weather = 'Neblina'	
				else if(weather == 'Thunderstorm')
					weather = 'Tormenta Eléctrica'		
			

				this.setState({
					loading: false,
					error: false,
					temperature : temp ,
					weather: weather
				});

				this.BuscarSugeridas(temp);

			},
			(error) => { console.log("ERROR") , this.setState({ message : error.message , error : true , loading:false }),
									 Alert.alert("Error al obtener ubicación actual")} , 
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
			let animo= this.state.animo
			
			let tiempo;
			let arrayTipo;
			let colores;

			let queryTipo='';
			let queryColor='';
			
			// DETERMINO TIEMPO
			if(temp > 18)
				tiempo = 'calor'
			else if(temp >= 10 && temp <= 18)
				tiempo = 'fresco'
			else if(temp < 10)
				tiempo = 'frio'

			switch (tiempo){
				case 'calor':{
						arrayTipo=["Short","Remera","Pollera","Camisa","Vestido"]
						break;
				}
				case 'fresco':{
					  arrayTipo=["Pantalon","Buzo","Saco"]
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
						colores=["Rojo","Azul","Verde","Amarillo","Rosa","Naranja","Violeta"]
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
						'select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Precargada == 0 and Cantidad > 0 and t.name IN (' + queryTipo +  ') and r.Color IN (' +
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
              this.setState({loading:false})
            }).catch((error) => {
              this.setState({loading:false})
              Alert.alert("Fallo la busqueda de sugeridas en la base de datos")
              console.log(error);
            });
          
      }).then( () => {   
        this.setState({getAnimo:false})  
        const {dispatch} = this.props
        dispatch( updateSugeridas(arraySugeridas) );
             
      }).catch((error) => {
      this.setState({loading:false})
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

		let NumeroPrenda 
		
		NumeroPrenda = this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor


	 firebase.database().ref().set({
		 NumeroPrenda,     
	 }).then((data)=>{
		 //console.log(`Transaction successfully committed, codigoPrenda es : '${nuevoCodigoPrenda}'.`  );
		 this.setState({modalRopa:false});
	 }).catch((error)=>{
		 console.log('Transaction failed: ', error);
		 Alert.alert("Falla en la comunicacion con la aplicacion de escritorio")
		 this.setState({modalRopa:false});
	 })
	 
  }

	cambiarAnimo = () => {
		if(this.state.animo == 'feliz')
			this.setState({ animo : 'triste' })
		else if(this.state.animo == 'triste')
			this.setState({ animo : 'feliz' })
		else
			Alert.alert("Falló cambio de ánimo")
	}

	determinarImagenPrenda = (item) =>{

    console.log(item)

    if (item.Name == 'Pantalon' && item.Color=='Amarillo' )
        this.setState({image: PantalonHombreAmarillo , modalRopa:true , prenda: item })
    else if (item.Name == 'Pantalon' && item.Color=='Azul' )
        this.setState({image: PantalonHombreAzul , modalRopa:true , prenda: item })
    else if (item.Name == 'Pantalon' && item.Color=='Gris' )
        this.setState({image: PantalonHombreGris , modalRopa:true , prenda: item })
    else if (item.Name == 'Pantalon' && item.Color=='Negro' )
        this.setState({image: PantalonHombreNegro , modalRopa:true , prenda: item })
    
    else if(item.Name == 'Remera' && item.Color=='Amarillo' )
        this.setState({image: RemeraHombreAmarillo , modalRopa:true , prenda: item })
    else if (item.Name == 'Remera' && item.Color=='Azul' )
        this.setState({image: RemeraHombreAzul , modalRopa:true , prenda: item })
    else if (item.Name == 'Remera' && item.Color=='Gris' )
        this.setState({image: RemeraHombreGris , modalRopa:true , prenda: item })
    else if (item.Name == 'Remera' && item.Color=='Naranja' )
        this.setState({image: RemeraHombreNaranja , modalRopa:true , prenda: item })
    else if (item.Name == 'Remera' && item.Color=='Negro' )
        this.setState({image: RemeraHombreNegro , modalRopa:true , prenda: item })
    else if (item.Name == 'Remera' && item.Color=='Rojo' )
        this.setState({image: RemeraHombreRojo , modalRopa:true , prenda: item })
    else if (item.Name == 'Remera' && item.Color=='Verde' )
        this.setState({image: RemeraHombreVerde , modalRopa:true , prenda: item })
    
    else if (item.Name == 'Vestido' && item.Color=='Amarillo' )
        this.setState({image: VestidoMujerAmarillo , modalRopa:true , prenda: item })
    else if (item.Name == 'Vestido' && item.Color=='Azul' )
        this.setState({image: VestidoMujerAzul , modalRopa:true , prenda: item })
    else if (item.Name == 'Vestido' && item.Color=='Blanco' )
        this.setState({image: VestidoMujerBlanco , modalRopa:true , prenda: item })
    else if (item.Name == 'Vestido' && item.Color=='Naranja' )
        this.setState({image: VestidoMujerNaranja , modalRopa:true , prenda: item })
    else if (item.Name == 'Vestido' && item.Color=='Negro' )
        this.setState({image: VestidoMujerNegro , modalRopa:true , prenda: item })
    else if (item.Name == 'Vestido' && item.Color=='Rojo' )
        this.setState({image: VestidoMujerRojo , modalRopa:true , prenda: item })
    else if (item.Name == 'Vestido' && item.Color=='Rosa' )
        this.setState({image: VestidoMujerRosa , modalRopa:true , prenda: item })
    else if (item.Name == 'Vestido' && item.Color=='Violeta' )
        this.setState({image: VestidoMujerVioleta , modalRopa:true , prenda: item })
    /*else if (item.Name == 'Pantalon' && item.Color=='Rojo' )
        this.setState({image: PantalonRojoM , modalRopa:true , prenda: item })*/
    else
        this.setState({image: '', modalRopa:true , prenda: item })
	}

	getAnimo = () =>{
		this.setState({getAnimo:true})
	}
	
	changeCamera = () => {
    this.setState({frontal: !(this.state.frontal)})
	}

	closeCameraModal = () =>{
		this.setState({getAnimo:false})
	}

	//TODO: ARREGLAR ESTE
	takePicture = async function() {
    if (this.camera) {
			this.setState({ loading:true })
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      //console.log(data)                 // DATA ES LA FOTO TOMADA, URI ES LA UBICACION EN CACHE DONDE LA GUARDA
      this.setState({data:data.uri, /* MODAL DE SUGERENCIAS O ALGO  , */ })

      //console.log("MI FOTO ES :" + data.uri)

      ImageRotate.rotateImage( data.uri,	this.state.frontal ? -90 :90 	, (uri) => {

        console.log("uri: " , uri)

        let data = uri
        this.setState({
        data: uri,
        });

      ImgToBase64.getBase64String( 
          data ).then( (cadena) => {

						
						//console.log(facetest.url)

						var key = '74a185e8e5d0455fa2c7f939d523685f'
						//d7337f28b92f4f75bf1ae43cebc623a7
						//console.log(cadena)
						// LE QUITE EL RETURN FACEID

						RNFetchBlob.fetch('POST', 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceAttributes=age,gender,emotion,smile', {
							'Accept': 'application/json',
							'Content-Type': 'application/octet-stream',
							'Ocp-Apim-Subscription-Key': key}, cadena ).then((res) => {
								return res.json();      
								}).then((json) => {	
									this.setState({getAnimo:false})
									console.log("ENTRE POR REVISION DE ROSTROS")
									console.log(json)

									if(json.length){

										console.log(json[0].faceAttributes.emotion.happiness)
										if(json[0].faceAttributes.emotion.happiness > 0.6)
											this.setState({animo:'feliz',facedata:json[0].faceAttributes.emotion.happiness})
										else
											this.setState({animo:'triste',facedata:json[0].faceAttributes.emotion.happiness})

										this.handleLocation()
										console.log("DE FACE API TRAIGO:")
									
										/*this.setState({
													face_data: json,
													animo: animo
											});*/


									}else{
											this.setState({loading:false})
											alert("No se detecto rostro en la foto");
									}
									
									return json;
								}).catch (function (error) {
								//this.setState({loading:false})
								console.log(error);
								alert('Fallo reconocimiento de expresion facial' + JSON.stringify(error));
						});
						

						// EL HANDLE VA DENTRO DEL THEN DEL JSON DEL FACEPI EXITOSO JUNTO CON EL SETSTATE DE ANIMO
						// handle antes estaba aca
						//console.log("ACA DEBERIA LLAMAR A FACEAPI PERO NO HAY KEY :( ")
					
          
          
      })
      },
      (error) => {
				this.setState({loading:false})
        console.error(error);
      });

      
    }
  }

	keyExtractor = (item, index) => index;
  
    renderItem = ({ item, index }) => (
      <ListItem 
				containerStyle={{ borderStyle:'solid', backgroundColor:'#E0E0E0', margin:3 , 
													borderWidth: 2 , borderBottomWidth: 2 , borderBottomColor : '#80CBC4' ,borderColor: '#80CBC4' }}
				title={
					<Text style={styles.lista}> {item.Name} color {item.Color} </Text>
				}
        //leftAvatar={{ source: item.avatar_url, rounded: true }}
        onPress={() => {
          //this.setState({ modalRopa: true , prenda : item });
          this.determinarImagenPrenda(item);
        }}
      />
	);


  render() {

	const {  focusedScreen } = this.state;
	let ayuda ="Pantalla donde se pueden solicitar\n las sugerencias de ropa de Que Me Pongo"

	if(this.props.ropa.prendasSugeridas.length)		
      data = this.props.ropa.prendasSugeridas
  else{
		data = []	// no hay ropa sugeridas
	}

		//console.log(this.state.temperature , this.state.weather)
		const temperature = this.state.temperature
		const weather = this.state.weather
		let image = this.state.image
		const happiness = this.state.animo 
		const facedata = this.state.facedata
		

    return (

    <View style={{ flex: 1 , backgroundColor:'orange' }}>

		{/* <View>
		{this.props.ropa.prendasSugeridas.length == 0 &&
				<Text style={styles.vacio}>No hay Prendas Sugeridas</Text>
		}
		</View> */}
		
	  	<FlatList keyExtractor={this.keyExtractor} data={data} renderItem={this.renderItem} />

			{/* <View style={{flex: 1 ,  }}>
              <Image
                source={{uri: this.state.data}}
                resizeMode='contain'    // cover o contain seria la posta, uno renderiza para arriba y el otro achica 
                resizeMethod='resize'
                style={{width: '100%' ,
                  height: '100%' ,
                  //position:'absolute',
                  alignSelf:'center'}}
              />
          </View> */}

	  	
	  	<View style={{flex: 0 }}>
			{/* <Divider style={{ backgroundColor: 'red' }} /> */}
				<View style={{flexDirection:'row',alignSelf:'center'}}>
					<TouchableOpacity
						style = {styles.sugerencias}
						onPress ={this.getAnimo}
					>
						<Text style={styles.sendText}>Pedir sugerencias</Text>
					</TouchableOpacity>
					{/* <TouchableOpacity
						style = {styles.sugerencias}
						onPress ={this.cambiarAnimo}
					>
						<Text style={styles.sendText}> {this.state.animo=='feliz' ? "Cambiar a triste" : "Cambiar a felíz"}</Text>
					</TouchableOpacity> */}
				</View>
				{/* <Text>Latitude: {this.state.latitude}</Text>
				<Text>Longitude: {this.state.longitude}</Text> */}
				<View>
				{temperature != 999 &&
					<View>
						<Text style={{fontSize:22, textAlign:'center',fontWeight:'bold' , color:'green'}}>TEMPERATURA: {temperature+'º    '} { weather}  </Text>
						<Text style={{fontSize:22, textAlign:'center',fontWeight:'bold' , color:'green'}} > { "estado de animo : " + happiness /*+ "  " + facedata*/}</Text> 
				</View> }
				</View>
			</View>
      <Divider style={{ backgroundColor: 'red' }} />
	
			<View style={styles.ayudaContainer} >
    		<Text style={styles.ayuda}>{ayuda}</Text>
    	</View>

			<Modal visible={this.state.getAnimo}>
			<View style={styles.container}>
			  <Text style={styles.ayuda}>Apunte a su cara para detectar estado de animo</Text>
				{ focusedScreen &&
					
					<RNCamera
						ref={ref => {
							this.camera = ref;
						}}
						style = {styles.preview}
						type={ this.state.frontal ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
		
				
						flashMode={ RNCamera.Constants.FlashMode.off }
	
						permissionDialogTitle={'Permisos de la cámara'}
						permissionDialogMessage={'¿Deséa permitir a Que Me Pongo utilizar la cámara del dispositivo?'}
					/>
				}
				<View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', alignSelf:'center'}}>
					<TouchableOpacity
							onPress={this.takePicture.bind(this)}
							style = { this.state.loading ? styles.captureDisabled : styles.capture}
							disabled= {this.state.loading}
					>
							<Text style={{fontSize: 16, color:'#fff', fontWeight:'bold', textAlign:'center'}}> Tomar Foto </Text>
					</TouchableOpacity>
					<TouchableOpacity
							onPress={ this.changeCamera }
							style = {styles.capture}    
					>
						<Text style={{fontSize: 16, color:'#fff', fontWeight:'bold', textAlign:'center'}}> {this.state.frontal? "Común" : "Frontal"} </Text>
					</TouchableOpacity>
				</View>
				<View style={{flex: 0, flexDirection: 'row', justifyContent: 'center', alignSelf:'center'}}>
					<TouchableOpacity
							onPress={ this.closeCameraModal  }
							style = {styles.capture}  
							disabled= {this.state.loading}  
					>
							<Text style={{fontSize: 16, color:'#fff', fontWeight:'bold', textAlign:'center'}}> Cancelar </Text>
					</TouchableOpacity>
				</View>


			</View>

			</Modal>

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

					<View style={{flex: 1 ,  }}>
              <Image
                source={ image }
                resizeMode='contain'    // cover o contain seria la posta, uno renderiza para arriba y el otro achica 
                resizeMethod='resize'
                style={{width: '100%' ,
                  height: '100%' ,
                  //position:'absolute',
                  alignSelf:'center'}}
              />
          </View>
					
					<View style={{flexDirection:'row' , alignSelf:'center' }}>
						<TouchableOpacity
							style = {styles.send}
							onPress ={this.probarPrenda}   
						
						>
							<Text style={styles.sendText}>Probar</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style = {this.state.prenda.Cantidad <= 0 ? styles.sendDisable :  styles.send}
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
		sendDisable: {
      margin: 2 ,
      backgroundColor: '#9E9E9E',
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
		flex: 0,
		margin: 2 ,
		backgroundColor: '#3A51E8',
		borderRadius: 5,
		//width: 150 ,
		alignSelf: 'center',
		justifyContent: 'center',
		//fontSize:20,
		padding : 6
	},
	sugerenciasDisabled: {
		flex: 0,
		margin: 2 ,
		backgroundColor: '#9E9E9E',
		borderRadius: 5,
		//width: 150 ,
		alignSelf: 'center',
		justifyContent: 'center',
		//fontSize:20,
		padding : 6
	},
	vacio:{
		fontSize:22 , 
		fontWeight:'bold', 
		alignSelf:'center', 
		color:'red',
		textAlign:'center'
	},lista:{
		color:'orange',
		fontSize:18,
		fontWeight:'bold'
	},
	container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'orange'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    //fontSize:20,
    //fontWeight:'bold',
    flex: 0,
    backgroundColor: '#3A51E8',
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
		margin: 5,
		width: 120
  },
  captureDisabled: {
    //fontSize:20,
    //fontWeight:'bold',
    flex: 0,
    backgroundColor: '#9E9E9E',
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 10,
		alignSelf: 'center',
    margin: 5,
		width: 120
  },
  });

const mapStateToProps = state => {
    const { ropa } = state;
        return {
           ropa
        };
  };
  
export default connect(mapStateToProps)(SugeridasScreen);