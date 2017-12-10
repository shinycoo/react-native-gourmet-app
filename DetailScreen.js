import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  Image
} from 'react-native';

const GLOBAL = require('./Globals');
export default class DetailScreen extends Component<{}> {
  static navigationOptions = {
    title: '식당정보',
  };

  constructor(props) {
    super(props);

    let imageUrl = GLOBAL.HOST + props.navigation.state.params.info.images[0].url
    this.state = {
      info: props.navigation.state.params.info,
      token: props.navigation.state.params.token,
      imageUrl: imageUrl,
    }
    console.log(this.state);
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <Image
          style={styles.imageStyle} 
          source={{uri: this.state.imageUrl}}
        />
        <View style={styles.body}>
          <Text style={styles.header}>
            { this.state.info.name }
          </Text>
          <Text style={styles.address}>
            { this.state.info.address }
          </Text>
          <Text style={styles.description}>
            { this.state.info.description }
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  imageStyle: {
    alignSelf: 'stretch',
    height: 160,
    resizeMode: 'cover'
  },
  body: {
    padding:20,
  },
  header: {
    fontSize: 18,
    fontWeight:'bold',
    color:'black',
  },
  address: {
    fontSize: 12,
    fontWeight:'bold',
  },
  description: {
    fontSize: 14,
    marginTop:20,
  },
});