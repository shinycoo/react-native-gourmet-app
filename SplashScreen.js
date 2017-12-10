import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  Image
} from 'react-native';

import { NavigationActions } from 'react-navigation';

export default class SplashScreen extends Component<{}> {
  static navigationOptions = {
    title: null,
    header: null 
  };
  componentDidMount() {
    setTimeout(() => {
      this.props.navigation.dispatch({
        type: 'Navigation/RESET',
        index: 0,
        actions: [{ routeName: 'Login' }]
      });

    }, 500);
  }
  render() {
    const { navigate } = this.props.navigation;
    const resizeMode = 'center';
    const text = '맛집!';

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#eee',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              resizeMode: 'cover'
            }}
            source={require("./images/background.png")}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 40,
              marginTop: 100,
              color: '#fff3f1',
            }}
          >
            {text}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});