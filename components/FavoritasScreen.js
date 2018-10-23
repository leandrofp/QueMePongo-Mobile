import { Text, View ,  FlatList , Modal, TouchableOpacity, StyleSheet , Alert} from 'react-native';
import { ListItem , Divider } from 'react-native-elements';
import React from 'react';
import { updateClothes } from '../actions/ropaActions'
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';


console.ignoredYellowBox=true;


var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
//var ropa;



class FavoritasScreen extends React.Component {

  constructor(props){
    super(props)
    this.ref = firebase.firestore().collection('prendas').doc("codigo");
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

      let arrayGuardarropas;
      let arrayFavoritas;
   
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

          }).catch((error) => {
            Alert.alert("Fallo la carga de Prendas con la Base de datos")
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

          }).catch((error) => {
            Alert.alert("Fallo la carga de Prendas con la Base de datos")
            console.log(error);
          });

      
    }).then( () => {
             
        // console.log("PRECARGA")
        // console.log("ARRAY FAVORITAS:   "  , arrayFavoritas);        // aca pega luego de las 3 transacciones
        // console.log("ARRAY GUARDARROPAS:   "  , arrayGuardarropas) 
        
        const {dispatch} = this.props
        dispatch( updateClothes(arrayFavoritas,arrayGuardarropas) );
      
    });


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
              
           
              // console.log("ARRAY FAVORITAS:   "  , arrayFavoritas);        // aca pega luego de las 3 transacciones
              // console.log("ARRAY PRECARGADAS:   "  , arrayPrecargadas) 
              
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

  reset = () => {



    let arrayGuardarropas;
    let arrayFavoritas;
    let arraySugeridas;

    ropa.transaction(tx => {
      tx.executeSql(
          `UPDATE Ropa SET Uso = 0 where Uso > 4;`).then(([tx,results]) => {
          
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
        containerStyle={{ borderStyle:'solid', backgroundColor:'#E0E0E0', margin:3 , 
                          borderWidth: 2 , borderBottomWidth: 2 , borderBottomColor : '#80CBC4' ,borderColor: '#80CBC4' }}
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

    let ayuda ="En esta pantalla se encuentran todas \nlas prendas que utilizaste al menos 5 veces!"
    let vacio = false
    let data;


    //console.log( "ARRAY FAVORITAS:  " + this.props.ropa.prendasFavoritas)   // muestra un object object aunque este vacio y x eso rompe el hdp
    //console.log( "LENGHT:  " + this.props.ropa.prendasFavoritas.length)
    if(this.props.ropa.prendasFavoritas){
     
      if(this.props.ropa.prendasFavoritas.length){
        //console.log("IF 2")
        data = this.props.ropa.prendasFavoritas
        vacio = false
      }
      else
        vacio=true
    }
    else{
      vacio=true
    }

      
      return (
        <View style={{ flex: 1 , backgroundColor:'orange'}}>

          
         
          { vacio &&
          <View>
              <Text style={styles.vacio}>No hay prendas favoritas.Utilice más</Text>
              <Text style={styles.vacio}>prendas para que aparezcan en esta seccion</Text>
          </View> }
          
         
          
          <FlatList keyExtractor={this.keyExtractor} data={data} renderItem={this.renderItem} />
          {/* <Divider style={{ backgroundColor: 'red' }} /> */}
          <TouchableOpacity
                style = {styles.reset}
                onPress ={this.reset}   
                //disabled={this.state.prenda.Cantidad <= 0} 
              >
                <Text style={styles.sendText}>Resetear favoritos</Text>
          </TouchableOpacity>
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
                {"Cantidad disponible: " + this.state.prenda.Cantidad + "/" + this.state.prenda.Cant_Max}
              </Text>
              <Text style={styles.text}>
                {"Cantidad de veces que se uso: " + this.state.prenda.Uso}
              </Text>
              <View style={{flexDirection:'row' , alignSelf:'center' }}>
                <TouchableOpacity
                  style = {styles.send}
                  onPress ={this.probarPrenda}    
                >
                  <Text style={styles.sendText}>Probar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style = {this.state.prenda.Cantidad <= 0 ? styles.sendDisable : styles.send}
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
    vacio:{
      fontSize:22 , 
      fontWeight:'bold', 
      alignSelf:'center', 
      color:'red',
      textAlign:'center'
    },
    reset: {
      margin: 2 ,
      backgroundColor: '#3A51E8',
      borderRadius: 5,
      width: 180 ,
      alignSelf: 'center',
      justifyContent: 'center',
      //fontSize:20,
      padding : 8
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
  
  export default connect(mapStateToProps)(FavoritasScreen);