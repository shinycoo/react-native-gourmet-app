import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  AsyncStorage
} from 'react-native';

const GLOBAL = require('./Globals');

export default class ListScreen extends Component<{}> {
  static navigationOptions = {
    title: null,
    header: null 
  };

  constructor() {
    super();

    this.state = {
      region: this.getRegionInitialState(),
      spots: [
        {id:0,name:'데이터를 불러오는 중입니다.'}
      ],
      error: null,
      refreshing: false, 
      token: '',
    }
    this.onPressItem = this.onPressItem.bind(this);
  }

  getRegionInitialState() {
    return {
      latitude: 37.566535,
      longitude: 126.97796919999996,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  }

  componentDidMount() {
    this.getToken();
    this.loadLocation();
  }

  async getToken() {
    try {
      const token = await AsyncStorage.getItem('@Session:token');
      this.setState({token: token});
    } catch (error) {
    }
  }

  loadLocation() {
    // 여기서 위경도를 불러온다.
    var options = {
      enableHighAccuracy: true, 
      timeout: 2000,
      maximumAge: 1000,
      distanceFilter: 10,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(this.state);
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          error: null,
        });

        this.fetchData();
      },
      (error) => {
        this.setState({
          error: error.message
        });
        //alert('위치정보를 얻어오지 못했습니다.');
        this.fetchData();
      },
      options
    );
  }

  fetchData() {
    const data = {
      lat:this.state.region.latitude, 
      lng:this.state.region.longitude
    };
    const url = GLOBAL.HOST + 'mobile/list?lat='+data.lat
      +'&lng='+data.lng+'&token='+this.state.token;
    console.log(url);
    fetch (url)
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState(state => ({
            spots: [ ...responseJson]
          }));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderEntries({ item, index }) {
    if (item.images != null && item.images.length > 0) {
      const imageUri = GLOBAL.HOST + item.images[0].url;
      console.log(imageUri);
      return(
          <TouchableOpacity 
            style={styles.itemStyle}
            onPress={() => this.onPressItem(item)}>
            <View style={styles.itemContainerStyle}>
              <Image
                style={styles.itemImageStyle}
                source={{uri: imageUri}}
              />
              <Text
                style={styles.itemTextStyle}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
      );
    }
    return(
        <TouchableOpacity 
          style={styles.itemStyle}>
          <Text
            style={styles.itemTextStyle}>
            {item.name}</Text>
        </TouchableOpacity>
    );
  }
  onRefresh() {
    this.loadLocation();
  }
  onPressItem(item) {
    this.props.navigation.navigate('Restaurant', {info: item, token: this.state.token});
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          내 주변 맛집 리스트
        </Text>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
          style={styles.list}
          data={this.state.spots}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderEntries.bind(this)}
        />
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
  header: {
    fontSize: 18,
    fontWeight:'bold',
    padding:20,
  },
  list: {
    alignSelf: 'stretch',
  },
  itemStyle: {
    padding: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 80,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  itemContainerStyle: {
    flex:1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  itemTextStyle: {
    fontSize: 18,
    padding:25,
  },
  itemImageStyle: {
    width:80,
    height:80,
  }
});