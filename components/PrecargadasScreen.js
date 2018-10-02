import {  Text, View , TouchableOpacity ,   PermissionsAndroid , Alert , FlatList , Modal , StyleSheet } from 'react-native';
import React from 'react';
import { ListItem } from 'react-native-elements';
//import { updateClothes } from '../actions/ropaActions'
import { connect } from 'react-redux';




console.ignoredYellowBox=true;

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;

class PrecargadasScreen extends React.Component {

    constructor(props){
    super(props)
    this.state = {
      modalRopa: false , 
      ropa: [], 
      prenda: {}
    
    }

    //this.apretame = this.apretame.bind(this);
 
    //this.errorCB = this.errorCB.bind(this)
    }

    errorCB = (err) => {
      console.log("error: ",err);
      //this.updateProgress("Error " + (err.message || err));
    }
    
    /*componentWillUnmount(){
      console.log("ABASDAF")
      this.closeDatabase();
    }*/

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
     
      
      tx.executeSql('CREATE TABLE IF NOT EXISTS Ropa( '
      + 'Ropa_Id INTEGER  NOT NULL PRIMARY KEY,'
      + 'Tipo_Id INTEGER  NOT NULL , Precargada INTEGER NOT NULL , '  
      +	'Cantidad INTEGER , Cod_Processing INTEGER NOT NULL , '
      +	'Uso INTEGER NOT NULL , Color VARCHAR(20) NOT NULL);' ).catch((error) => {
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
     
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , Cod_Processing , Uso , Color) VALUES (1 ,2 , 1 , -1 , ? , 0, \'Blanco\' );', [5]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , Cod_Processing , Uso , Color) VALUES (2 ,1 , 1 , -1 , ? , 0, \'Blanco\' );', [6]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , Cod_Processing , Uso , Color) VALUES (3 ,2 , 0 , 0 , ? , 0, \'Verde\' );', [5]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , Cod_Processing , Uso , Color) VALUES (4 ,1 , 0 , 0 , ? , 0, \'Amarillo\' );', [6]);
       tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , Cod_Processing , Uso , Color) VALUES (5 ,1 , 0 , 0 , ? , 5, \'Rojo\' );', [6]);
        
       // el 5 seria remera, el 6 pantalon por ahora en processing por suponer algo

       tx.executeSql(
        `select * from Ropa r INNER JOIN Tipo_Ropa t on r.Tipo_Id = t.Tipo_Id where Precargada == 1;`).then(([tx,results]) => {
        
          console.log("Query completed");

          arrayPrecargadas=[]

          var len = results.rows.length;
          
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            //console.log(row)
            arrayPrecargadas.push(row)     
          }
       
          this.setState({ropa:arrayPrecargadas,modalRopa:false})
        }).catch((error) => {
          this.setState({modalRopa:false})
          Alert.alert("Fallo la Busqueda en la Base de datos")
          console.log(error);
        });
      

      //-----------------------------------------------------------------------------------//
      

    console.log("all config SQL done");

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

    usarRopa = () => {

      this.setState({modalRopa:false})
  
    }

    render() {
  
        return (
          <View style={{ flex: 1 , backgroundColor:'orange'}}>
            
            <FlatList keyExtractor={this.keyExtractor} data={this.state.ropa} renderItem={this.renderItem} />
          
          <View style={{backgroundColor:'orange', flex:1}}>
            <Modal visible={this.state.modalRopa}>
            
            <Text>
              {"Nombre: " + this.state.prenda.Name + ' color ' + this.state.prenda.Color }
            </Text>
            
            <TouchableOpacity
              style = {styles.send}
              onPress ={ () => {this.setState({modalRopa:false})}}
            >
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style = {styles.send}
              onPress ={this.usarRopa}    // LLAMAR a una funcion que use una trasaccion para sumar 1 a USO
            >
              <Text>Probar</Text>
            </TouchableOpacity>
            </Modal>
          </View>
          </View>
  
        );
    }

    

    

    // apretame(){

      
    //   console.log("APRETAME")
      
      

    //   ropa.transaction(tx => {
    //     tx.executeSql(
    //       `select * from Tipo_ropa;`).then(([tx,results]) => {
          
    //         console.log("Query completed");

    //         let array=[]

    //         var len = results.rows.length;
            
    //         for (let i = 0; i < len; i++) {
    //           let row = results.rows.item(i);
    //           //console.log(row.Name)
    //           array.push(row.Name)
    //         }
    //         //console.log(array)
    //         this.setState({data:array})
           
    //       }).catch((error) => {
    //         console.log(error);
    //       });

        
    //   });
    // }

    


    // render() {

    //   //data = this.state.data;

    //   const data = this.state.data

     

     

    //   return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' , backgroundColor:'orange' }}>
    //       <Text>PRECARGADAS!</Text>
         
         
    //       <TouchableOpacity
    //       onPress = {this.apretame}
    //       >
    //       <Text style={{fontSize: 14}}> Apretame para ver datos </Text>
    //       </TouchableOpacity>
                    
    //       {data.map((item,index) => <Text>{item}</Text> )}


       
          
    //     </View>
    //   );
    // }



  }

  const styles = StyleSheet.create({
    send: {
      margin: 2 ,
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingHorizontal: 22,
      alignSelf: 'center',
      justifyContent: 'flex-end',
      //fontSize:20,
      padding : 8
    }
  });

  const mapStateToProps = state => {
    const { ropa } = state;
        return {
           ropa
        };
  };
  
  export default connect(mapStateToProps)(PrecargadasScreen);

 