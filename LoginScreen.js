import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  AsyncStorage,
  Image
} from 'react-native';
const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
  LoginManager
} = FBSDK;

import { NavigationActions } from 'react-navigation';

const GLOBAL = require('./Globals');

export default class LoginScreen extends Component<{}> {
  static navigationOptions = {
    title: null,
    header: null 
  };

  constructor(props) {
    super(props);
    this.state = {account: '', password: ''};
    console.log(this.state);
  }

  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    try {
      const token = await AsyncStorage.getItem('@Session:token');
      if (token !== null) {
        this.updatePushToken(token);
        this.props.navigation.dispatch({
          type: 'Navigation/RESET',
          index: 0,
          actions: [{ routeName: 'List' }]
        });
      }
    } catch (error) {
    }
  }

  updatePushToken(sessionToken) {
    var formData = new FormData();
    formData.append('push', global.pushToken);
    formData.append('token', sessionToken);
    fetch(GLOBAL.HOST+'mobile/push', {
        method: 'POST',
        body: formData
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onLoginResult(result) {
    if (!result.success) {
      alert('로그인 정보를 확인해주세요.');
      return;
    }
    try {
      AsyncStorage.setItem('@Session:token', result.token);
    } catch (error) {
      alert('로그인에 실패하였습니다.:'+error);
      return;
    }

    this.updatePushToken(result.token);

    this.props.navigation.dispatch({
      type: 'Navigation/RESET',
      index: 0,
      actions: [{ routeName: 'List' }]
    });
  }

  onLogin() {
    var formData = new FormData();
    formData.append('account', this.state.account);
    formData.append('password', this.state.password);

    fetch(GLOBAL.HOST+'mobile/login', {
        method: 'POST',
        body: formData
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.onLoginResult(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onFacebook() {
    const self = this;
    LoginManager.logInWithReadPermissions(
      ['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          alert("페이스북 로그인이 취소되었습니다.");
        } else {
          AccessToken.getCurrentAccessToken().then(
            (data) => {
              var oauth_token = data.accessToken.toString();

              var formData = new FormData();
              formData.append('oauth_token', oauth_token);

              fetch(GLOBAL.HOST+'mobile/facebook', {
                  method: 'POST',
                  body: formData
                })
                .then((response) => response.json())
                .then((responseJson) => {
                  self.onLoginResult(responseJson);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          );
        }
      },
      function (error) {
        alert("로그인 중 오류가 발생하였습니다: " + error);
      }
    );
  }

  render() {
    const { navigate } = this.props.navigation;
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
            padding: 20,
            justifyContent: 'center',
          }}
        >
          <View style={styles.formBorderStyle}>
            <TextInput
              style={styles.formFieldStyle}
              placeholder="이메일"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={(account) => this.setState({account})}
            />
          </View>
          <View style={styles.formBorderStyle}>
            <TextInput
              style={styles.formFieldStyle}
              placeholder="비밀번호"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={(password) => this.setState({password})}
            />
          </View>


          <TouchableOpacity
            onPress={this.onLogin.bind(this)}
            style={styles.formButtonStyle}
          >
            <Text
              style={{
                color: 'white',
                fontSize:15,
                fontWeight: 'bold',
              }}>
              로그인 
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={this.onFacebook.bind(this)}
            style={styles.formFacebookStyle}
          >
            <Text
              style={{
                color: 'white',
                fontSize:15,
                fontWeight: 'bold',
              }}>
              페이스북으로 로그인 
            </Text>
          </TouchableOpacity>

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
  formBorderStyle: {
    borderColor:'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 5,
    margin: 5,
  },
  formFieldStyle: {
    height: 50, 
    paddingLeft:15,
    paddingRight:15,
    fontSize:15,
    backgroundColor: 'transparent'
  },
  formButtonStyle: {
    backgroundColor: 'black',
    height: 50, 
    alignItems: 'center',
    margin: 5,
    marginTop: 15,
    borderRadius: 5,
    padding: 20,
    justifyContent: 'center',
  },
  formFacebookStyle: {
    backgroundColor: '#4267B2',
    height: 50, 
    alignItems: 'center',
    margin: 5,
    marginTop: 15,
    borderRadius: 5,
    padding: 20,
    justifyContent: 'center',
  },
});