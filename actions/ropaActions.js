

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;


export function updateClothes(arrayFavoritas,arrayGuardarropas,arrayPrecargadas){
  console.log("UPDATE CLOTHES")
  return {type : "UPDATE_CLOTHES", arrayFavoritas , arrayGuardarropas , arrayPrecargadas}
  
}

// RECICLAR LO QUE SIRVA DE ACA
/*
async function readDatabase(){

  SQLite.openDatabase("ropa.bd").then((DB) => {
      ropa = DB;                            // lo asigna a la global, supongo para poder usar esa despues
      console.log("BD ABIERTA")               // hasta aca anda...
      return updateDatabase(DB);
     
    }).catch((error) => {
      console.log(error);
    });
}

function updateDatabase(){

    console.log("POSTOPENDATABASE")

    ropa.transaction(tx => {
       
        tx.executeSql(
            `select * from Ropa where Precargada == 1;`).then(([tx,results]) => {
            
              //console.log("Query completed");
  
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
        
          //console.log("Query completed");

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
            
              //console.log("Query completed");
    
              var len = results.rows.length;
              
              for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                //console.log(row)
                arrayGuardarropas.push(row)
              }
              
            }).catch((error) => {
              console.log(error);
            });  

    }).then( () => {   
        //console.log("ARRAY FAVORITAS:   "  , arrayFavoritas);        // aca pega luego de las 3 transacciones
        console.log("ARRAY PRECARGADAS:   "  , arrayPrecargadas)   
       
      });
}

*/