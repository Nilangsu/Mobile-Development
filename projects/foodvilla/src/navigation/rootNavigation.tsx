import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboard from '@/screens/stacks/onboard';
import DrawerNavigation from './drawerNavigation';
import Auth from '@/screens/stacks/auth';
import RestaurantDetail from '@/screens/stacks/restaurantDetails';

export type RootStackParamList = {
	Onboard: undefined;
	Auth: undefined;
	Home: {
		userData: {
			name: string;
			email: string;
			mobile: string;
		};
	};
	RestaurantDetail: {
		id: string;
	};
};
const Stack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen
				name='Onboard'
				component={Onboard}
			/>
			<Stack.Screen
				name='Auth'
				component={Auth}
			/>
			<Stack.Screen
				name='Home'
				component={DrawerNavigation}
			/>
			<Stack.Screen
				name='RestaurantDetail'
				component={RestaurantDetail}
			/>
		</Stack.Navigator>
	);
}

export default RootNavigator;
