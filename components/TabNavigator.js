import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from 'react-navigation';
import PrecargadasScreen from './PrecargadasScreen';
import EscanerScreen from './EscanerScreen';
import FavoritasScreen from './FavoritasScreen';
import SugeridasScreen from './SugeridasScreen';
import GuardarropasScreen from './GuardarropasScreen'

console.disableYellowBox=true

export default createBottomTabNavigator(
  {
    Escaner: EscanerScreen,                         // FALLA EL RUTEO , OSEA NO CARGA LOS COMOPNENTES DEL TODO BIEN (MOVER BARRA A ABAJO TMB)
    Precargadas: PrecargadasScreen,
    Favoritos: FavoritasScreen,
    Sugeridas: SugeridasScreen,
    Guardarropas: GuardarropasScreen,
   
  },
  {
    // cambiar la logica de esto los iconos son una caca
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Escaner') {
          //iconName = `${focused ? 'qr-scanner' : 'qr-scanner-outline'}`;
          
          iconName = "ios-qr-scanner"
        } else if (routeName === 'Precargadas') {
            //iconName = `${focused ? 'ios-options' : 'ios-options-outline'}`;
            iconName = 'ios-timer'
        }
          else if (routeName === 'Favoritos') {
            //iconName = `${focused ? 'ios-star' : 'ios-star-outline'}`;
            iconName =  'ios-star' 
        
        } else if (routeName === 'Sugeridas') {
            //iconName = `${focused ? 'ios-options' : 'ios-options-outline'}`;
            iconName =  'ios-megaphone' 
        
        } else if (routeName === 'Guardarropas') {
            //iconName = `${focused ? 'ios-shirt' : 'ios-shirt'}`;
            iconName =  'ios-shirt' 
          }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      showIcon: true,
      activeTintColor: '#205791',
      //inactiveTintColor: '#0c223a',
      style: {
        backgroundColor: '#fff'
      }
    }
  }
);