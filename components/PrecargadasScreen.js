import { Button, Text, View , TouchableOpacity } from 'react-native';
import React from 'react';

console.ignoredYellowBox=true;

var SQLite = require('react-native-sqlite-storage')
SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;

export default class PrecargadasScreen extends React.Component {

    constructor(props){
    super(props)
    this.state = {
    
      data: [], 
      flag: 10
    }

    this.apretame = this.apretame.bind(this);
    this.agregar = this.agregar.bind(this);
    //this.errorCB = this.errorCB.bind(this)
    }

    errorCB = (err) => {
      console.log("error: ",err);
      //this.updateProgress("Error " + (err.message || err));
    }
    
    componentWillMount(){  
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
      + 'Tipo_Id INTEGER  NOT NULL ,'
      + 'Estilo_Id INTEGER  NOT NULL ,'  
      +	'Imagen BLOB);' ).catch((error) => {
        this.errorCB(error)
      });
      

      tx.executeSql('CREATE TABLE IF NOT EXISTS Tipo_ropa( '
      + 'Tipo_Id INTEGER  PRIMARY KEY NOT NULL, '
      + 'Name VARCHAR(50) NOT NULL  ); ').catch((error) => {
      this.errorCB(error)
      });
      
      tx.executeSql('CREATE TABLE IF NOT EXISTS Estilo_ropa( '
      + 'Estilo_Id INTEGER  NOT NULL PRIMARY KEY,  '
      + 'Name VARCHAR(50)  NOT NULL);').catch((error) => {
      this.errorCB(error)
      });

      //Para eliminar las tablas (tipo un truncate que no se si existe)
      // tx.executeSql('DROP TABLE IF EXISTS Ropa;');
      // tx.executeSql('DROP TABLE IF EXISTS Tipo_ropa;');
      // tx.executeSql('DROP TABLE IF EXISTS Estilo_ropa;');

    // DEBERIA VALIDAR QUE NO LOS INSERTE SI LA TABLA NO ESTA VACIA, PERO POR AHORA REBOTA POR PK 

      /*tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (1,"Pantalon");');
      tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (2,"Remera");');
      tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (3,"Buzo");');
      tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (4,"Vestido");');
      tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (5,"Pulover");');
      tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (6,"Camisa");');
      */

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
        
      });
    }

    agregar(){

      ropa.transaction(tx => { 
        tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (7,"Corpiño");');
        tx.executeSql('INSERT INTO Tipo_ropa (Tipo_id, name) VALUES (8,"Boxer");');
      });

    }

    render() {

      //data = this.state.data;

      const data= this.state.data
      //console.log(this.state.data , data , "TEXTO")

      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>PRECARGADAS!</Text>
          <TouchableOpacity
          onPress = {this.agregar}
          >
            <Text style={{fontSize: 14}}> Agregar Corpiño y Boxer </Text>
          </TouchableOpacity>    
          <TouchableOpacity
          onPress = {this.apretame}
          >
          <Text style={{fontSize: 14}}> Apretame para ver datos </Text>
          </TouchableOpacity>
          
          {/* <Text>{this.state.flag}</Text>      */}
          
          {data.map((item,index) => <Text>{item}</Text> )}
       
          
        </View>
      );
    }
  }

 