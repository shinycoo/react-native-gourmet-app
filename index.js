import { AppRegistry } from 'react-native';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';

import ListScreen from './ListScreen';

import DetailScreen from './DetailScreen';
import ReviewScreen from './ReviewScreen';

import { StackNavigator, TabNavigator } from 'react-navigation';

console.disableYellowBox = true;

const TabSceneNavigator = TabNavigator({
	tab1: { screen: DetailScreen },
	tab2: { screen: ReviewScreen },
});

export const GourmetApp = StackNavigator({
	Index: { screen: SplashScreen },
	Login: { screen: LoginScreen },
	List: { screen: ListScreen },
	Restaurant: {
		screen: TabSceneNavigator, 
		navigationOptions: {
			title: '상세보기',
		},
	},
});

AppRegistry.registerComponent('GourmetApp', () => GourmetApp);
