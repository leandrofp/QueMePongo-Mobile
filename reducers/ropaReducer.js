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
    console.log("ROPA REDUCER", action)
    
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
        return {
          ...state,
          prendasFavoritas : action.arrayFavoritas,
          prendasGuardarropas : action.arrayGuardarropas,
          //prendasSugeridas : action.arraySugeridas,
          prueba: 123
      };  
        
      }
      default:
        return state;
    }
}




