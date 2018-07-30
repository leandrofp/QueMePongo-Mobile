import { Button, Text, View } from 'react-native';
import React from 'react';

console.ignoredYellowBox=true;

export default class PrecargadasScreen extends React.Component {
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Home!</Text>
          <Button
            title="Go to Settings"
            onPress={() => this.props.navigation.navigate('Settings')}
          />
        </View>
      );
    }
  }