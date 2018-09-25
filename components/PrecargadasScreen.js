import {  Text, View , TouchableOpacity ,   PermissionsAndroid } from 'react-native';
import React from 'react';




console.ignoredYellowBox=true;

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;

export default class PrecargadasScreen extends React.Component {

    constructor(props){
    super(props)
    this.state = {
    
      data: [], 
      //flag: 10
    }

    this.apretame = this.apretame.bind(this);
 
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

      //ropa = SQLite.openDatabase("Ropa.db")
      SQLite.openDatabase("ropa.bd").then((DB) => {
        ropa = DB;                            // lo asigna a la global, supongo para poder usar esa despues
        console.log("BD ABIERTA")               // hasta aca anda...
        this.postOpenDatabase(DB);
      }).catch((error) => {
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
     
      
      tx.executeSql('CREATE TABLE IF NOT EXISTS Ropa( '
      + 'Ropa_Id INTEGER  NOT NULL PRIMARY KEY,'
      + 'Tipo_Id INTEGER  NOT NULL , Precargada INTEGER NOT NULL , '  
      +	'Cantidad INTEGER , Cod_Processing INTEGER NOT NULL , '
      +	'Uso INTEGER NOT NULL);' ).catch((error) => {
        this.errorCB(error)
      });
      
      tx.executeSql('CREATE TABLE IF NOT EXISTS Tipo_ropa( '
      + 'Tipo_Id INTEGER  PRIMARY KEY NOT NULL, '
      + 'Name VARCHAR(50) NOT NULL  ); ').catch((error) => {
      this.errorCB(error)
      });
      
  
      //Para eliminar las tablas (tipo un truncate que no se si existe)
      //tx.executeSql('DROP TABLE IF EXISTS Ropa;');
      //tx.executeSql('DROP TABLE IF EXISTS Tipo_ropa;');


    
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
      //-----------------------------------------------------------------------------------//


      // INSERCION  DE ROPA ACA ------------------------
      // CANTIDAD = -1 es porque es precargada, no se puede modificar
      // console.log(img1,img2 , "PEPEPEPEPE")
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , cod_processing , uso ) VALUES (1 ,2 , 1 , -1 , ? , 0 );', [5]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , cod_processing , uso ) VALUES (2 ,1 , 1 , -1 , ? , 0 );', [6]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , cod_processing , uso ) VALUES (3 ,2 , 0 , 0 , ? , 0 );', [5]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , cod_processing , uso ) VALUES (4 ,1 , 0 , 0 , ? , 0 );', [6]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , cod_processing , uso ) VALUES (5 ,1 , 0 , 0 , ? , 5 );', [6]);
      
       // el 5 seria remera, el 6 pantalon por ahora en processing por suponer algo


      //-----------------------------------------------------------------------------------//


    console.log("all config SQL done");

    }

    apretame(){
     
      ropa.transaction(tx => {
        tx.executeSql(
          `select * from Tipo_ropa;`).then(([tx,results]) => {
          
            console.log("Query completed");

            let array=[]

            var len = results.rows.length;
            
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              //console.log(row.Name)
              array.push(row.Name)
            }
            //console.log(array)
            this.setState({data:array})
          }).catch((error) => {
            console.log(error);
          });

        tx.executeSql(
            `select * from Ropa;`).then(([tx,results]) => {
            
              console.log("Query completed");
  
              let array=[]
  
              var len = results.rows.length;
              
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                console.log(row)
                //array.push(row.Name)
              }
              //console.log(array)
              //this.setState({data:array})
            }).catch((error) => {
              console.log(error);
            });

        
      });
    }

    /*agregar(){

      ropa.transaction(tx => { 
        tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (7,"Corpiño");');
        tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (8,"Boxer");');
      });

    }*/

    render() {

      //data = this.state.data;

      const data= this.state.data

      // console.log(img1);
      // console.log(img2);
      // console.log("LALALALALALAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALLLLLLLLLLLLLLLLLLLLLLL")
     

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>PRECARGADAS!</Text>
         
         
          <TouchableOpacity
          onPress = {this.apretame}
          >
          <Text style={{fontSize: 14}}> Apretame para ver datos </Text>
          </TouchableOpacity>
                    
          {data.map((item,index) => <Text>{item}</Text> )}


       
          
        </View>
      );
    }
  }

 