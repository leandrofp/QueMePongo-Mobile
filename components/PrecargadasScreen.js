import {  Text, View , TouchableOpacity ,   PermissionsAndroid , Alert , FlatList , Modal , StyleSheet , Image , Dimensions } from 'react-native';
import React from 'react';
import { ListItem , Divider} from 'react-native-elements';
//import { updateClothes } from '../actions/ropaActions'
import { connect } from 'react-redux';

import firebase from 'react-native-firebase';

// PATH DE PRENDAS
//aa
//aa
var PantalonHombrePrecargadaGris = require('../assets/PantalonHombrePrecargadaGris.png');
var PantalonHombrePrecargadaLavanda = require('../assets/PantalonHombrePrecargadaLavanda.png');
var PantalonHombrePrecargadaRojo = require('../assets/PantalonHombrePrecargadaRojo.png');

var RemeraHombrePrecargadaAmarillo = require('../assets/RemeraHombrePrecargadaAmarillo.png')
var RemeraHombrePrecargadaAzul = require('../assets/RemeraHombrePrecargadaAzul.png')
var RemeraHombrePrecargadaGris = require('../assets/RemeraHombrePrecargadaGris.png')
var RemeraHombrePrecargadaLavanda = require('../assets/RemeraHombrePrecargadaLavanda.png')

var RemeraHombrePrecargadaNaranja = require('../assets/RemeraHombrePrecargadaNaranja.png')
var RemeraHombrePrecargadaNegro = require('../assets/RemeraHombrePrecargadaNegro.png')
var RemeraHombrePrecargadaRojo = require('../assets/RemeraHombrePrecargadaRojo.png')
var RemeraHombrePrecargadaVerde = require('../assets/RemeraHombrePrecargadaVerde.png')


var RemeraMujerPrecargadaAzul = require('../assets/RemeraMujerPrecargadaAzul.png')
var RemeraMujerPrecargadaLavanda = require('../assets/RemeraMujerPrecargadaLavanda.png')
var RemeraMujerPrecargadaLavanda2 = require('../assets/RemeraMujerPrecargadaLavanda2.png')
var RemeraMujerPrecargadaNaranja = require('../assets/RemeraMujerPrecargadaNaranja.png')
var RemeraMujerPrecargadaNaranja2 = require('../assets/RemeraMujerPrecargadaNaranja2.png')
var RemeraMujerPrecargadaRojo = require('../assets/RemeraMujerPrecargadaRojo.png')
var RemeraMujerPrecargadaVerde = require('../assets/RemeraMujerPrecargadaVerde.png')
var RemeraMujerPrecargadaVioleta = require('../assets/RemeraMujerPrecargadaVioleta.png')


var VestidoMujerPrecargadaAmarillo = require('../assets/VestidoMujerPrecargadaAmarillo.png')
var VestidoMujerPrecargadaAzul = require('../assets/VestidoMujerPrecargadaAzul.png')
var VestidoMujerPrecargadaBlanco = require('../assets/VestidoMujerPrecargadaBlanco.png')
var VestidoMujerPrecargadaLavanda = require('../assets/VestidoMujerPrecargadaLavanda.png')

var VestidoMujerPrecargadaNaranja = require('../assets/VestidoMujerPrecargadaNaranja.png')
var VestidoMujerPrecargadaNegro = require('../assets/VestidoMujerPrecargadaNegro.png')
var VestidoMujerPrecargadaPuntosBlancos = require('../assets/VestidoMujerPrecargadaPuntosBlancos.png')
var VestidoMujerPrecargadaRayas = require('../assets/VestidoMujerPrecargadaRayas.png')
var VestidoMujerPrecargadaRojo = require('../assets/VestidoMujerPrecargadaRojo.png')
var VestidoMujerPrecargadaRosa = require('../assets/VestidoMujerPrecargadaRosa.png')
var VestidoMujerPrecargadaVioleta = require('../assets/VestidoMujerPrecargadaVioleta.png')


console.ignoredYellowBox=true;

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;

class PrecargadasScreen extends React.Component {

    constructor(props){
    super(props)

    // this.ref = firebase.firestore().collection('prendas').doc("codigo");

    

    this.state = {
      modalRopa: false , 
      ropa: [], 
      prenda: {},
      image:''
    
    }

    //this.apretame = this.apretame.bind(this);
 
    //this.errorCB = this.errorCB.bind(this)
    }

    errorCB = (err) => {
      console.log("error: ",err);
      //this.updateProgress("Error " + (err.message || err));
    }
    
    componentWillMount(){  

      async function requestGPSPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              'title': 'Que Me Pongo GPS',
              'message': 'Que me pongo needs access to your location for weather data '
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use QMP")
          } else {
            console.log("GPS permission denied")
          }
        } catch (err) {
          console.warn(err)
        }
      }
      requestGPSPermission();

      let NumeroPrenda = 'NADA'

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

  
    SQLite.openDatabase("ropa.bd").then((DB) => {
        ropa = DB;                            // lo asigna a la global, supongo para poder usar esa despues
        console.log("BD ABIERTA")               // hasta aca anda...
        this.postOpenDatabase(DB);
      }).catch((error) => {
        Alert.alert("Error abriendo la Base de datos")
        console.log(error);
      });
    }

    postOpenDatabase = (db) => {
        db.transaction(this.createTables).then(() =>{
          console,log("Transaccion Finalizada")
            //this.closeDatabase()});
        });
        
    }

    createTables = (tx) => {

      console.log("CREATE TABLES")

      //Para eliminar las tablas (tipo un truncate que no se si existe)
      // tx.executeSql('DROP TABLE  Ropa;');
      // tx.executeSql('DROP TABLE  Tipo_ropa;');

      tx.executeSql('CREATE TABLE IF NOT EXISTS Ropa( '
            + 'Ropa_Id INTEGER NOT NULL PRIMARY KEY,'
            + 'Tipo_Id INTEGER NOT NULL , Precargada INTEGER NOT NULL , '  
            +	'Cantidad INTEGER , CodColor INTEGER NOT NULL , Uso INTEGER NOT NULL , Color TEXT NOT NULL , Cant_Max INTEGER NOT NULL);' ).catch((error) => {
            this.errorCB(error)
      });
          
      tx.executeSql('CREATE TABLE IF NOT EXISTS Tipo_ropa( '
            + 'Tipo_Id INTEGER  PRIMARY KEY NOT NULL, '
            + 'Name VARCHAR(50) NOT NULL  ); ').catch((error) => {
            this.errorCB(error)
      });

      tx.executeSql('Select * from Ropa;').then(([tx,results]) => {


        var leng = results.rows.length;
        ropa.transaction(tx => {
             
              if(leng==0){

              console.log("REALIZANDO INSERCIONES DE PRIMERA VEZ")
              
              

              // INSERCION DE TIPOS DE ROPA ACA ------------------------
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (1,"Pantalon");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (2,"Remera");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (3,"Buzo");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (4,"Vestido");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (5,"Pulover");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (6,"Camisa");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (7,"Campera");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (8,"Pollera");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (9,"Saco");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (10,"Short");');
              tx.executeSql('INSERT OR IGNORE INTO Tipo_ropa (Tipo_id, Name) VALUES (11,"Remera Femenina");');
              //-----------------------------------------------------------------------------------//


              // INSERCION  DE ROPA ACA ------------------------
              // CANTIDAD = -1 es porque es precargada, no se puede modificar
                // 1=GRIS
                // 2=MARRON
                // 3=ROJO
                // 4=VERDE
                // 5=AMARILLO
                // 6=AZUL
                // 7=NEGRO
                // 8=BLANCO
                // 9=VIOLETA
                // 10=OCRE
                // 11=ROSA
                // 12=PURPURA
                // 13=NARANJA
                // 14=LAVANDA
                // 15=Textura Roja
                // 16=Puntos
                // 17=Rayas
                // 18=Textura Gris

              // Precargadas

              //  TODO: EVALUAR COLORES REPETIDOS CON DISTINTA FORMA 
             
              //PANTALONES 1
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 1 , 1 , -1 , 15 , 0, "Textura Roja", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 1 , 1 , -1 , 14 , 0, "Lavanda", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 1 , 1 , -1 , 18 , 0, "Textura Gris", 0);');
              //REMERAS 2
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 5 , 0, "Amarillo", 0);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 6 , 0, "Azul", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 1 , 0, "Gris", 0);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 14 , 0, "Lavanda", 0);');
              
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 13 , 0, "Naranja", 0);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 7 , 0, "Negro", 0);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 3 , 0, "Rojo", 0);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 1 , -1 , 4 , 0, "Verde", 0);');
              
              
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 6 , 0, "Azul", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 14 , 0, "Lavanda", 1);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 14 , 0, "Lavanda 2", 1);');  // nombre harcodeado
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 13 , 0, "Naranja", 1);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 13 , 0, "Naranja 2", 1);'); // nombre harcodeado
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 3 , 0, "Rojo", 1);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 11 , 0, "Rosa", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 4 , 0, "Verde", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 11 , 1 , -1 , 9 , 0, "Violeta", 1);');
              
              
              
              
              
              //VESTIDOS 4
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 5 , 0, "Amarillo", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 6 , 0, "Azul", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 8 , 0, "Blanco", 0);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 14 , 0, "Lavanda", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 14 , 0, "Lavanda", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 13 , 0, "Naranja", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 7 , 0, "Negro", 0);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 16 , 0, "Puntos Blancos", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 17 , 0, "Rayas", 0);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 3 , 0, "Rojo", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 11 , 0, "Rosa", 0);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 1 , -1 , 9 , 0, "Violeta", 0);');
        

              // Normales para Testing
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 1 , 0 , 1 , 5 , 0, "Amarillo", 2);');
              // tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 1 , 0 , 1 , 3 , 5, "Rojo", 4);');
              
              //camisa
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 6 , 0 , 1 , 7 , 2, "Negro", 1);');
              
              //vestidos
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 0 , 1 , 6 , 7, "Negro", 1);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 0 , 1 , 3 , 7, "Rojo", 1);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 0 , 1 , 11 , 7, "Rosa", 1);');
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 4 , 0 , 1 , 13 , 2, "Naranja", 1);');
              
              //pantalones
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 1 , 0 , 1 , 1 , 2, "Gris", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 1 , 0 , 1 , 6 , 2, "Azul", 1);');
              
              //remeras
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 0 , 1 , 1 , 2, "Gris", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 0 , 1 , 6 , 5, "Azul", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 2 , 0 , 1 , 4 , 0, "Verde", 1);');
              
              //pulover
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 5 , 0 , 1 , 1 , 2, "Gris", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 5 , 0 , 1 , 6 , 5, "Azul", 1);');
              //buzo
              //tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 3 , 0 , 1 , 1 , 2, "Gris", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 3 , 0 , 1 , 6 , 5, "Azul", 1);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (null, 3 , 0 , 1 , 7 , 2, "Negro", 1);');
              
            

              tx.executeSql(
                `select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Precargada = 1;`).then(([tx,results]) => {
                
                  console.log("Query completed Precargadas");
        
                  arrayPrecargadas=[]
        
                  var len = results.rows.length;
                  
                  for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    //console.log(row)
                    arrayPrecargadas.push(row)     
                  }
              
                  this.setState({ropa:arrayPrecargadas})
                }).catch((error) => {
                  this.setState({modalRopa:false})
                  Alert.alert("Fallo la Busqueda en la Base de datos")
                  console.log(error);
                });


              

            }
            else{




            tx.executeSql(
              `select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Precargada = 1;`).then(([tx,results]) => {
              
                console.log("Query completed Precargadas");
      
                arrayPrecargadas=[]
      
                var len = results.rows.length;
                
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  //console.log(row)
                  arrayPrecargadas.push(row)     
                }
            
                this.setState({ropa:arrayPrecargadas})
              }).catch((error) => {
                this.setState({modalRopa:false})
                Alert.alert("Fallo la Busqueda en la Base de datos")
                console.log(error);
              });
            }
        });
        
      });

      

   
    console.log("all config SQL done");

    }

    keyExtractor = (item, index) => index;
  
    renderItem = ({ item, index }) => (
      <ListItem 
        containerStyle={{ borderStyle:'solid', backgroundColor:'#E0E0E0', margin:3 , 
                          borderWidth: 2 , borderBottomWidth: 2 , borderBottomColor : '#80CBC4' ,borderColor: '#80CBC4' }}
        title={ 
        <Text style={styles.lista}> {item.Name} color {item.Color} </Text> 
        }
        onPress={() => {
          //this.setState({ modalRopa: true , prenda : item });
          this.determinarImagenPrenda(item);
        }}
      />
    );

    

    determinarImagenPrenda = (item) =>{

      console.log(item)

      if(item.Name == 'Pantalon' && item.Color=='Textura Gris' )
        this.setState({image: PantalonHombrePrecargadaGris  , modalRopa:true , prenda: item })
      else if(item.Name ==  'Pantalon' && item.Color=='Lavanda' )
        this.setState({image: PantalonHombrePrecargadaLavanda , modalRopa:true , prenda: item })
      else if(item.Name ==  'Pantalon' && item.Color=='Textura Roja' )
        this.setState({image: PantalonHombrePrecargadaRojo , modalRopa:true , prenda: item })
      
      else if(item.Name ==  'Remera' && item.Color=='Amarillo' )
        this.setState({image: RemeraHombrePrecargadaAmarillo , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Azul' )
        this.setState({image: RemeraHombrePrecargadaAzul , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Gris' )
        this.setState({image: RemeraHombrePrecargadaGris , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Lavanda' )
        this.setState({image: RemeraHombrePrecargadaLavanda , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Naranja' )
        this.setState({image: RemeraHombrePrecargadaNaranja , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Negro' )
        this.setState({image: RemeraHombrePrecargadaNegro , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Rojo' )
        this.setState({image: RemeraHombrePrecargadaRojo , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Verde' )
        this.setState({image: RemeraHombrePrecargadaVerde , modalRopa:true , prenda: item })
      
      else if(item.Name ==  'Remera Femenina' && item.Color=='Azul' )
        this.setState({image: RemeraMujerPrecargadaAzul , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Lavanda' )
        this.setState({image: RemeraMujerPrecargadaLavanda , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Lavanda 2' )
        this.setState({image: RemeraMujerPrecargadaLavanda2 , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Naranja' )
        this.setState({image: RemeraMujerPrecargadaNaranja , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Naranja 2' )
        this.setState({image: RemeraMujerPrecargadaNaranja2 , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Rojo' )
        this.setState({image: RemeraMujerPrecargadaRojo , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Rosa' )
        this.setState({image: RemeraMujerPrecargadaRosa , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Verde' )
        this.setState({image: RemeraMujerPrecargadaVerde , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera Femenina' && item.Color=='Violeta' )
        this.setState({image: RemeraMujerPrecargadaVioleta , modalRopa:true , prenda: item })
     
      
      
      else if(item.Name ==  'Vestido' && item.Color=='Amarillo' )
        this.setState({image: VestidoMujerPrecargadaAmarillo , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Azul' )
        this.setState({image: VestidoMujerPrecargadaAzul , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Blanco' )
        this.setState({image: VestidoMujerPrecargadaBlanco , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Lavanda' )
        this.setState({image: VestidoMujerPrecargadaLavanda , modalRopa:true , prenda: item })
     
      else if(item.Name ==  'Vestido' && item.Color=='Naranja' )
        this.setState({image: VestidoMujerPrecargadaNaranja , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Negro' )
        this.setState({image: VestidoMujerPrecargadaNegro , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Puntos Blancos' )
        this.setState({image: VestidoMujerPrecargadaPuntosBlancos , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Rayas' )
        this.setState({image: VestidoMujerPrecargadaRayas , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Rojo' )
        this.setState({image: VestidoMujerPrecargadaRojo , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Rosa' )
        this.setState({image: VestidoMujerPrecargadaRosa , modalRopa:true , prenda: item })
      else if(item.Name ==  'Vestido' && item.Color=='Violeta' )
        this.setState({image: VestidoMujerPrecargadaVioleta , modalRopa:true , prenda: item })
      else
        this.setState({image: '', modalRopa:true , prenda: item })
      

    }

    probarPrenda = () => {

       let NumeroPrenda 
       
      if(this.state.prenda.Tipo_Id == 1)
        NumeroPrenda = '9.' + this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor  // pantalones
      else if(this.state.prenda.Tipo_Id == 11 && (this.state.prenda.Color == 'Naranja 2' || this.state.prenda.Color == 'Lavanda 2') )  
        NumeroPrenda = '5.' + this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor
      else if(this.state.prenda.Tipo_Id == 11)  
        NumeroPrenda = '3.' + this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor
      else if(this.state.prenda.Tipo_Id == 2 && this.state.prenda.CodColor == 14)    // remera lavanda 1
        NumeroPrenda = '1.' + this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor
      else if(this.state.prenda.Tipo_Id == 2)
        NumeroPrenda = '2.' + this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor 
      // else if(this.state.prenda.Ropa_Id == 15)   // vestido lavanda 1
      //   NumeroPrenda = '4.' + this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor
      else if(this.state.prenda.Tipo_Id == 4)
        NumeroPrenda = '7.' + this.state.prenda.Tipo_Id + ":" + this.state.prenda.CodColor


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


    render() {

    image = this.state.image
    console.log(image)

    let ayuda ="En esta pantalla se encuentran aquellas\n prendas de muestra que trae la aplicación"

        return (
          <View style={{ flex: 1 , backgroundColor:'orange'}}>
            
            <FlatList keyExtractor={this.keyExtractor} data={this.state.ropa} renderItem={this.renderItem} />
            <Divider style={{ backgroundColor: 'red' }} />
            <View style={styles.ayudaContainer} >
              <Text style={styles.ayuda}>{ayuda}</Text>
            </View>
          
          <Modal visible={this.state.modalRopa}>
            <View style={{backgroundColor:'grey', flex:1}}>
            
            
              <Text style={styles.text}>
                {"Nombre: " + this.state.prenda.Name + ' color ' + this.state.prenda.Color }
              </Text>

              <View style={{flex:1}}>
              <Image
                source={ image }
                resizeMode='contain'  
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
      fontSize:16,
      fontWeight:'bold',
      margin: 2 ,
      color: '#ffffff',
      textAlign:'center'
    },
    text:{
      color: 'blue',
      fontSize: 22,
      justifyContent:'center',
      textAlign: 'center',
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
    lista:{
      color:'orange',
      fontSize:18,
      fontWeight:'bold'
    }
  });

  const mapStateToProps = state => {
    const { ropa } = state;
        return {
           ropa
        };
  };
  
  export default connect(mapStateToProps)(PrecargadasScreen);

 