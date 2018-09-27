import { Text, View ,  FlatList , Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
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
      modalRopa: false , 
      ropa: [], 
      prenda: {}
      //flag: 10
    }

  }
  componentWillMount(){  

    

    SQLite.openDatabase("ropa.bd").then((DB) => {
      ropa = DB;                            // lo asigna a la global, supongo para poder usar esa despues
      console.log("BD ABIERTA")    
      console.log(ropa)       
      this.postOpenDatabase(ropa);
    }).catch((error) => {
      console.log(error);
    
    });
  }


  
  postOpenDatabase = (db) => {
      //console.log("LLEGUE")
      ropa.transaction(this.readTables).then(() =>{
        console,log("Transaccion Finalizada")
          //this.closeDatabase()});
      });
      
  }

  readTables = (tx) => {
   
      ropa.transaction(tx => {
      tx.executeSql(
          `select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Precargada == 0;`).then(([tx,results]) => {
          
            console.log("Query completed");

            let array=[]

            var len = results.rows.length;
            
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              //console.log(row)
              array.push(row)      // GUARDO SOLO NOMBRE
            }
            //console.log(array , "AAA")
            this.setState({ropa:array})
          }).catch((error) => {
            console.log(error);
          });

      
    });
  console.log("all config SQL done");
  }


  keyExtractor = (item, index) => index;
  
    renderItem = ({ item, index }) => (
      <ListItem
        title={item.Name}
        //leftAvatar={{ source: item.avatar_url, rounded: true }}
        onPress={() => {
          this.setState({ modalRopa: true , prenda : item });
        }}
      />
  );

  

  render() {
      return (
        <View style={{ flex: 1 , backgroundColor:'orange'}}>
          
          <FlatList keyExtractor={this.keyExtractor} data={this.state.ropa} renderItem={this.renderItem} />
        
        <View>
          <Modal visible={this.state.modalRopa}>
          <Text>
            {"Nombre: " + this.state.prenda.Name }
            {"Cantidad: " + this.state.prenda.Cantidad}
          </Text>
          <TouchableOpacity
            style = {styles.send}
            onPress ={ () => {this.setState({modalRopa:false})}}
          >
            <Text>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style = {styles.send}
            onPress ={ () => {this.setState({modalRopa:false})}}    // LLAMAR a una funcion que use una trasaccion para sumar 1 a USO
          >
            <Text>Usar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style = {styles.send}
            onPress ={ () => {this.setState({modalRopa:false})}}    // LLAMAR a una funcion que use una trasaccion para cambiar el bool Disponibilidad
          >
            <Text>Cambiar Disponibilidad</Text>
          </TouchableOpacity>
          </Modal>
        </View>
        </View>

      );
    }
  }

  const styles = StyleSheet.create({
    send: {
      margin: 2 ,
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingHorizontal: 22,
      alignSelf: 'center',
      justifyContent: 'flex-end',
      fontSize:20,
      padding : 8
    }
  });