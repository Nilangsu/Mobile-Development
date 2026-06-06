import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					position: 'absolute',
					left: 16,
					right: 16,
					bottom: 0,
					height: 78,
					borderRadius: 28,
					backgroundColor: '#5A5A42',
					borderTopWidth: 0,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 10,
					},
					shadowOpacity: 0.25,
					shadowRadius: 20,
					elevation: 12,
				},

				tabBarActiveTintColor: '#FFFFE3',

				tabBarInactiveTintColor: 'rgba(219,219,195,0.55)',

				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '700',
					marginBottom: 8,
				},

				tabBarItemStyle: {
					marginVertical: 6,
					borderRadius: 20,
				},
			}}>
			<Tabs.Screen
				name='dashboard/index'
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='home-outline'
							size={size}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='drive/index'
				options={{
					title: 'Drive',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='car-sport-outline'
							size={size}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='history/index'
				options={{
					title: 'History',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='time-outline'
							size={size}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='profile/index'
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<Ionicons
							name='person-outline'
							size={size}
							color={color}
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='drive/summary'
				options={{
					href: null,
				}}
			/>
		</Tabs>
	);
}
