

var SQLite = require('react-native-sqlite-storage')
//SQLite.DEBUG(true);
SQLite.enablePromise(true);
var ropa;


export function updateClothes(arrayFavoritas,arrayGuardarropas){
  console.log("UPDATE CLOTHES")
  return {type : "UPDATE_CLOTHES", arrayFavoritas , arrayGuardarropas}
  
}

export function updateSugeridas(arraySugeridas){
  console.log("UPDATE SUGERIDAS")
  return {type : "UPDATE_SUGERIDAS", arraySugeridas}
  
}
