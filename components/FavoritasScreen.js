import { Button, Text, View ,ScrollView, Image } from 'react-native';
import React from 'react';

console.ignoredYellowBox=true;

export default class FavoritasScreen extends React.Component {
  render() {
    return (
      <ScrollView>
        <Text>
          On iOS, a React Native ScrollView uses a native UIScrollView.
          On Android, it uses a native ScrollView.

          On iOS, a React Native Image uses a native UIImageView.
          On Android, it uses a native ImageView.

          React Native wraps the fundamental native components, giving you
          the performance of a native app, plus the clean design of React.
        </Text>
      </ScrollView>
    );
  }
  }