import { Text, View ,  FlatList , Modal, TouchableOpacity, StyleSheet , Alert} from 'react-native';
import { ListItem , Divider } from 'react-native-elements';
import React from 'react';
import { updateClothes } from '../actions/ropaActions'
import { connect } from 'react-redux';


console.ignoredYellowBox=true;


var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
//var ropa;



class FavoritasScreen extends React.Component {

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
          `select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Uso > 4;`).then(([tx,results]) => {
          
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

  usarRopa = () => {

    let arrayGuardarropas;
    let arrayFavoritas;

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
              
              //console.log("ARRAY FAVORITAS:   "  , arrayFavoritas);        // aca pega luego de las 3 transacciones
              //console.log("ARRAY PRECARGADAS:   "  , arrayPrecargadas) 
              
              const {dispatch} = this.props
              dispatch( updateClothes(arrayFavoritas,arrayGuardarropas) );
             
            });


          }).catch((error) => {
            this.setState({modalRopa:false})
            Alert.alert("Fallo la actualizacion en la base de datos")
            console.log(error);
          });      
    });

  }


  keyExtractor = (item, index) => index;
  
    renderItem = ({ item, index }) => (
      <ListItem
        title={item.Name + ' color ' + item.Color}
        //leftAvatar={{ source: item.avatar_url, rounded: true }}
        onPress={() => {
          this.setState({ modalRopa: true , prenda : item });
        }}
      />
  );

  

  render() {

    let ayuda ="En esta pantalla se encuentran todas \nlas prendas que fueron utilizadas\n que utilizaste al menos 5 veces!"

    if(this.props.ropa.prendasFavoritas.length)
      data = this.props.ropa.prendasFavoritas
    else
      data = this.state.ropa

      return (
        <View style={{ flex: 1 , backgroundColor:'orange'}}>
          
          <FlatList keyExtractor={this.keyExtractor} data={data} renderItem={this.renderItem} />
          <Divider style={{ backgroundColor: 'red' }} />
          <View style={styles.ayudaContainer} >
            <Text style={styles.ayuda}>{ayuda}</Text>
          </View>
        

          <Modal visible={this.state.modalRopa}>
            <View style={{backgroundColor:'grey', flex:1}}>
            
            
              <Text style={styles.text}>
                {"Nombre: " + this.state.prenda.Name + ' color ' + this.state.prenda.Color }
              </Text>
              <Text style={styles.text}>
                {"Cantidad disponible: " + this.state.prenda.Cantidad}
              </Text>
              <Text style={styles.text}>
                {"Cantidad de veces que se uso: " + this.state.prenda.Uso}
              </Text>
              <TouchableOpacity
                style = {styles.send}
                //onPress ={this.usarRopa}   
                disabled={this.state.prenda.Cantidad <= 0} 
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
              <TouchableOpacity
                style = {styles.send}
                onPress ={ () => {this.setState({modalRopa:false})}}
              >
                <Text style={styles.sendText}>Cancelar</Text>
              </TouchableOpacity>
              
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
      margin: 2 ,
      color: '#ffffff',
      textAlign:'center'
    },
    text:{
      fontSize: 22,
      color: 'black',
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
    }
  });

  const mapStateToProps = state => {
    const { ropa } = state;
        return {
           ropa
        };
  };
  
  export default connect(mapStateToProps)(FavoritasScreen);