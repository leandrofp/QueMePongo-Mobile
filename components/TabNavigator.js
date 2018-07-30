import React, {Component} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';
import PrecargadasScreen from './PrecargadasScreen';
import EscanerScreen from './EscanerScreen';

export default createBottomTabNavigator(
  {
    Escaner: EscanerScreen,
    Precargadas: PrecargadasScreen,
    //Favoritos: FavoritasScreen,
    //Sugeridas: SugeridasScreen,
    //Guardarroppas: GuardarropasScreen,
   
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Escaner') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        } else if (routeName === 'Precargadas') {
            iconName = `ios-options${focused ? '' : '-outline'}`;
        }
        //   else if (routeName === 'Settings') {
        //     iconName = `ios-options${focused ? '' : '-outline'}`;
        
        // } else if (routeName === 'Settings') {
        //     iconName = `ios-options${focused ? '' : '-outline'}`;
        
        // } else if (routeName === 'Settings') {
        //     iconName = `ios-options${focused ? '' : '-outline'}`;
        //   }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
  }
);