const initialState = {
    prendasPrecargadas:[],
    prendasFavoritas:[],
    prendasGuardarropas:[],
    prendasSugeridas:[],
    prueba: 55
    //agregar si falta algo
  };

export function ropa(state = initialState, action) {
    console.log("ROPA REDUCER", action.type)
    
    switch (action.type) {
      case 'OPEN_MODAL':{
        return {
          ...state,
          prueba: 45,
          //dataPhoto: action.database64
          
        };
      }
      case 'UPDATE_CLOTHES':{
        console.log("AL CASE LLEGUE")
        readDatabase();
        /* TODO EL CHOCLO DE LOS SELECT */
        return {
          ...state,
          state
          //dataPhoto: action.database64
          
        };
      }
      default:
        return state;
    }
}



var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;

function readDatabase(){

    SQLite.openDatabase("ropa.bd").then((DB) => {
        ropa = DB;                            // lo asigna a la global, supongo para poder usar esa despues
        console.log("BD ABIERTA")               // hasta aca anda...
        postOpenDatabase(DB);

        // ACA TMB RETORNAR ALGO

      }).catch((error) => {
        Alert.alert("Error abriendo la Base de datos")
        console.log(error);
      });
}

function postOpenDatabase(){

    let arrayPrecargadas=[];
    let arrayGuardarropas=[];
    let arrayFavoritas=[];

    ropa.transaction(tx => {
       
        tx.executeSql(
            `select * from Ropa where Precargada == 1;`).then(([tx,results]) => {
            
              console.log("Query completed");
  
        
              var len = results.rows.length;
              
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                //console.log(row)
                arrayPrecargadas.push(row)
              }

              //console.log(array)
              
              // RETORNAR ARRAY ASI LO ASIGNO AL OTRO COSO EN EL REDUCER

            }).catch((error) => {
              console.log(error);
            });  
    
      tx.executeSql(
        `select * from Ropa where Uso > 4;`).then(([tx,results]) => {
        
          console.log("Query completed");

     

          var len = results.rows.length;
          
          for (let i = 0; i < len; i++) {
            let row = results.rows.item(i);
            //console.log(row)
            arrayFavoritas.push(row)
          }

          //console.log(array)
          
          // RETORNAR ARRAY ASI LO ASIGNO AL OTRO COSO EN EL REDUCER

        }).catch((error) => {
          console.log(error);
        });  

        tx.executeSql(
            `select * from Ropa where Precargada == 0;`).then(([tx,results]) => {
            
              console.log("Query completed");
    
       
    
              var len = results.rows.length;
              
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                //console.log(row)
                arrayGuardarropas.push(row)
              }
              
            }).catch((error) => {
              console.log(error);
            });  


            

    }).then( () => {    //console.log("ARRAY FAVORITAS:   "  , arrayFavoritas);        // aca pega luego de las 3 transacciones
                        //console.log("ARRAY PRECARGADAS:   "  , arrayPrecargadas)   
            
                    let var1 = {arrayFavoritas , arrayGuardarropas , arrayPrecargadas};
                    return var1;

            
                   });

   

}

