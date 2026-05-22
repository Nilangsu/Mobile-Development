import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import TabNavigation from './tabNavigation';
import RestaurantDetail from '@/screens/stacks/restaurantDetails';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
const Drawer = createDrawerNavigator();
function CustomDrawerContent(props: any) {
	const userData = props.route.params?.userData;
	return (
		<View style={styles.container}>
			<DrawerContentScrollView {...props}>
				<View style={styles.profileSection}>
					<Image
						source={require('@/assets/images/user.jpg')}
						style={styles.profileImage}
					/>
					<Text style={styles.userName}>{userData?.name}</Text>
				</View>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
		</View>
	);
}
const DrawerNavigation = ({ route }: any) => {
	return (
		<Drawer.Navigator
			drawerContent={(props) => (
				<CustomDrawerContent
					{...props}
					route={route}
				/>
			)}
			screenOptions={{
				headerStyle: {
					backgroundColor: '#F5F1D8',
				},
				headerTintColor: '#0B0B0B',

				headerTitle: 'Home',

				drawerStyle: {
					backgroundColor: '#F5F1D8',
				},

				drawerActiveTintColor: '#0B0B0B',

				drawerInactiveTintColor: '#6E6A5E',
			}}>
			<Drawer.Screen
				name='Main'
				component={TabNavigation}
				initialParams={route.params}
				options={({ route }) => {
					const routeName = getFocusedRouteNameFromRoute(route) ?? 'Delivery';
					return {
						headerTitle: routeName === 'Delivery' ? 'Home' : routeName,
					};
				}}
			/>
			<Drawer.Screen
				name='Restaurant Details'
				component={RestaurantDetail}
				initialParams={{
					id: '123',
				}}
				options={{
					headerTitle: 'Restaurant',
				}}
			/>
		</Drawer.Navigator>
	);
};
export default DrawerNavigation;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F5F1D8',
	},
	profileSection: {
		paddingVertical: 40,
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#E4DEC3',
		marginBottom: 20,
	},

	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 14,
		borderWidth: 3,
		borderColor: '#0B0B0B',
	},

	userName: {
		color: '#0B0B0B',
		fontSize: 22,
		fontWeight: '700',
	},
});
