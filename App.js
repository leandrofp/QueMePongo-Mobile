/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

console.ignoredYellowBox=true;

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import TabNavigator from './components/TabNavigator';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { ropa } from './reducers/ropaReducer';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var firebase = require("firebase");
//type Props = {};
export default class App extends Component {

  
  render() {

    const appReducer = combineReducers({
      ropa
    });

    const createStoreWithMidddleware = applyMiddleware(thunk)(createStore);
    const store = createStoreWithMidddleware(appReducer);

    return (
      <Provider store={store}>
        <TabNavigator/>
      </Provider>
      

    );
  }
}
