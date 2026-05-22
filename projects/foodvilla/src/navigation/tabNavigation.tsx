import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '@/screens/tabs/Home';
import Search from '@/screens/tabs/Search';
import Order from '@/screens/tabs/Order';
import Profile from '@/screens/tabs/Profile';
import { useState } from 'react';
import { dummyData, Menu } from '../../data/dummydata';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './rootNavigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Tab = createBottomTabNavigator();
export type OrderItems = {
	id: number;
	quantity: number;
	name: string;
	price: number;
};
function MyTabs() {
	const [cartItems, setCartItems] = useState<OrderItems[]>([]);
	type HomeRouteProp = RouteProp<RootStackParamList, 'Home'>;
	const route = useRoute<HomeRouteProp>();
	const { userData } = route.params;
	const insets = useSafeAreaInsets();
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				headerStyle: {
					backgroundColor: '#F5F1D8',
				},

				headerTintColor: '#0B0B0B',

				headerTitleStyle: {
					fontWeight: '700',
					fontSize: 22,
				},

				tabBarStyle: {
					backgroundColor: '#F5F1D8',
					borderTopWidth: 0,
					height: 70 + insets.bottom,
					paddingBottom: insets.bottom,
					paddingTop: 10,
					borderTopLeftRadius: 24,
					borderTopRightRadius: 24,
					position: 'absolute',
					elevation: 0,
				},

				tabBarActiveTintColor: '#0B0B0B',

				tabBarInactiveTintColor: '#8C8774',

				tabBarLabelStyle: {
					fontSize: 13,
					fontWeight: '700',
					marginTop: 4,
				},

				tabBarItemStyle: {
					borderRadius: 18,
					marginHorizontal: 4,
					marginVertical: 4,
				},

				tabBarBadgeStyle: {
					backgroundColor: '#0B0B0B',
					color: '#F5F1D8',
					fontWeight: '700',
				},
			}}>
			<Tab.Screen
				name='Delivery'
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='fast-food'
							size={size}
							color={color}
						/>
					),
				}}>
				{(props) => (
					<Home
						{...props}
						cartItems={cartItems}
						setCartItems={setCartItems}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen
				name='Search'
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='search'
							size={size}
							color={color}
						/>
					),
				}}>
				{(props) => (
					<Search
						{...props}
						cartItems={cartItems}
						setCartItems={setCartItems}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen
				name='Order'
				options={{
					tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,

					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='bag'
							size={size}
							color={color}
						/>
					),
				}}>
				{(props) => (
					<Order
						{...props}
						cartItems={cartItems}
						setCartItems={setCartItems}
					/>
				)}
			</Tab.Screen>
			<Tab.Screen
				name='Profile'
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='person'
							size={size}
							color={color}
						/>
					),
				}}>
				{(props) => (
					<Profile
						{...props}
						userData={userData}
					/>
				)}
			</Tab.Screen>
		</Tab.Navigator>
	);
}
export default function TabNavigation() {
	return <MyTabs />;
}
