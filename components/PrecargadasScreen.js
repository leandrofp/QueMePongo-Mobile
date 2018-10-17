import {  Text, View , TouchableOpacity ,   PermissionsAndroid , Alert , FlatList , Modal , StyleSheet , Image , Dimensions } from 'react-native';
import React from 'react';
import { ListItem , Divider} from 'react-native-elements';
//import { updateClothes } from '../actions/ropaActions'
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

// PATH DE PRENDAS

var RemeraBlancoPre = require('../assets/RemeraBlancaPre.jpg');
var PantalonBlancoPre = require('../assets/PantalonBlancoPre.png');


const window = Dimensions.get('window');




console.ignoredYellowBox=true;

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;

class PrecargadasScreen extends React.Component {

    constructor(props){
    super(props)

    this.ref = firebase.firestore().collection('prendas').doc("codigo");

    

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
              //-----------------------------------------------------------------------------------//


              // INSERCION  DE ROPA ACA ------------------------
              // CANTIDAD = -1 es porque es precargada, no se puede modificar
              //   1=GRIS
              //   2=MARRON
              //   3=ROJO
              //   4=VERDE
              //   5=AMARILLO
              //   6=AZUL
              //   7=NEGRO
              //   8=BLANCO
              //   9=VIOLETA
              //   10=OCRE
              //   11=ROSA
              //   12=PURPURA
              

              // Precargadas

              
              /* TODO:  REVISAR LA INSERCION DE LOS VARCHAR, CREO QUE ROMPE AHI */

              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (1, 2 , 1 , -1 , 8 , 0, "Blanco", 0);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (2, 1 , 1 , -1 , 8 , 0, "Blanco", 0);');
              
              
              // Normales para Testing
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (3, 2 , 0 , 0 , 4 , 0, "Verde", 3);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (4, 1 , 0 , 0 , 5 , 0, "Amarillo", 3);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (5, 1 , 0 , 0 , 3 , 5, "Rojo", 3);');
              tx.executeSql('INSERT OR IGNORE INTO Ropa (Ropa_Id , Tipo_Id , Precargada , Cantidad , CodColor , Uso , Color , Cant_Max)  VALUES (6, 3 , 0 , 1 , 7 , 2, "Gris", 3);');
              

              //el 5 seria remera, el 6 pantalon por ahora en processing por suponer algo

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
        containerStyle={{ borderStyle:'solid', backgroundColor:'green', margin:3 , 
                          borderWidth: 2 , borderBottomWidth: 2 , borderBottomColor : 'blue' ,borderColor: 'blue' }}
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

      
      if(item.Name == 'Pantalon' && item.Color=='Blanco' )
        this.setState({image: PantalonBlancoPre  , modalRopa:true , prenda: item })
      else if(item.Name ==  'Remera' && item.Color=='Blanco' )
        this.setState({image: RemeraBlancoPre , modalRopa:true , prenda: item })
      

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
    lista:{
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
  
  export default connect(mapStateToProps)(PrecargadasScreen);

 