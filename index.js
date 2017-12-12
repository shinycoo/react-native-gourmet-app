import { AppRegistry, ToastAndroid } from 'react-native';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';

import ListScreen from './ListScreen';

import DetailScreen from './DetailScreen';
import ReviewScreen from './ReviewScreen';

import { StackNavigator, TabNavigator } from 'react-navigation';

import { NotificationsAndroid } from 'react-native-notifications';

NotificationsAndroid.setRegistrationTokenUpdateListener((deviceToken) => {
	console.log('Push-notifications registered!', deviceToken);
	global.pushToken = deviceToken;
});
NotificationsAndroid.setNotificationReceivedListener((notification) => {
	console.log("Notification received on device", notification.getData());
	ToastAndroid.show(notification.getData().body, ToastAndroid.SHORT);
});
NotificationsAndroid.setNotificationOpenedListener((notification) => {
	console.log("Notification opened by device user", notification.getData());
});

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
