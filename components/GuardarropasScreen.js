import { Button, Text, View } from 'react-native';
import React from 'react';

console.ignoredYellowBox=true;


var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
//var ropa;
export default class GuardarropasScreen extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    
      ropa: [], 
      //flag: 10
    }

  }
  componentWillMount(){  

    //ropa = SQLite.openDatabase("Ropa.db")
    /*SQLite.openDatabase("ropa.bd").then((DB) => {
      ropa = DB;                            // lo asigna a la global, supongo para poder usar esa despues
      console.log("BD ABIERTA")               // hasta aca anda...
      this.postOpenDatabase(DB);
    }).catch((error) => {
      console.log(error);
    });*/
  
  postOpenDatabase = (db) => {
      console.log("LLEGUE")
      db.transaction(this.readTables).then(() =>{
        console,log("Transaccion Finalizada")
          //this.closeDatabase()});
      });
      
  }

  readTables = (tx) => {
   
      ropa.transaction(tx => {
      tx.executeSql(
          `select * from Ropa;`).then(([tx,results]) => {
          
            console.log("Query completed");

            let array=[]

            var len = results.rows.length;
            
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(row)
              array.push(row.Name)
            }
            //console.log(array)
            this.setState({ropa:array})
          }).catch((error) => {
            console.log(error);
          });

      
    });
  console.log("all config SQL done");
  }

  this.postOpenDatabase(DB);

}
  render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>GUARDARROPAS!</Text>
          
        </View>
      );
    }
  }