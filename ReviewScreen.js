import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const GLOBAL = require('./Globals');
export default class ReviewScreen extends Component<{}> {
  static navigationOptions = {
    title: '리뷰',
  };

  constructor(props) {
    super(props);

    this.state = {
      info: props.navigation.state.params.info,
      token: props.navigation.state.params.token,
      reviews: [
        {id:0,name:'데이터를 불러오는 중입니다.'}
      ],
    }
    console.log(this.state);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    const data = {
      id:this.state.info.id
    };
    const url = GLOBAL.HOST + 'mobile/reviews?id='+this.state.info.id
      +'&token='+this.state.token;

    console.log(url);
    fetch (url)
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
          this.setState(state => ({
            reviews: [ ...responseJson]
          }));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.reviews}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderEntries.bind(this)}
        />
      </View>
    );
  }

  renderEntries({ item, index }) {
    return(
        <TouchableOpacity 
          style={styles.itemStyle}>
          <View style={styles.itemContainerStyle}>
            <Text
              style={styles.itemTextStyle}>
              {item.title}
            </Text>
            <Text>
              {item.ratings} / 5
            </Text>
          </View>
        </TouchableOpacity>
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
  list: {
    alignSelf: 'stretch',
  },
  itemContainerStyle: {
    flex:1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  itemStyle: {
    padding: 0,
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 80,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
  },
  itemTextStyle: {
    fontSize: 18,
    padding:25,
  },
});