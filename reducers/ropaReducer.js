const initialState = {
    //prendasPrecargadas:[],
    prendasFavoritas:[],
    prendasGuardarropas:[],
    prendasSugeridas:[],
    prueba: 55,
    error: ''
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

        //console.log("LONG DE FAVORITAS:  " ,  action.arrayFavoritas.length)

        return {
          ...state,
          prendasFavoritas : action.arrayFavoritas,
          prendasGuardarropas : action.arrayGuardarropas,
          prueba: 123
        };     
      }
      case 'UPDATE_SUGERIDAS':{
        console.log("AL CASE LLEGUE")
        return {
          ...state,
          prendasSugeridas : action.arraySugeridas,
        }; 
      } 
      default:
        return state;
    }
}




