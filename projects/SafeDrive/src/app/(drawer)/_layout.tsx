import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomDrawerContent from '@/components/CustomDrawerContent';
export default function DrawerLayout() {
	return (
		<Drawer
			drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				headerShown: true,
				headerTitle: 'SafeDrive',
				headerStyle: {
					backgroundColor: '#58583d',
				},

				headerTintColor: '#FFFFE3',

				headerTitleStyle: {
					fontWeight: '700',
				},

				drawerStyle: {
					backgroundColor: '#4A4A32',
					width: 300,
				},

				drawerActiveBackgroundColor: '#DBDBC3',

				drawerActiveTintColor: '#4A4A32',

				drawerInactiveTintColor: '#DBDBC3',

				drawerLabelStyle: {
					fontSize: 15,
					fontWeight: '600',
					marginLeft: -10,
				},

				drawerItemStyle: {
					borderRadius: 18,
					marginHorizontal: 12,
					marginVertical: 4,
				},
			}}>
			<Drawer.Screen
				name='(tabs)'
				options={{
					title: 'Dashboard',
					drawerIcon: ({ color, size }) => (
						<Ionicons
							name='home-outline'
							size={size}
							color={color}
						/>
					),
				}}
			/>

			<Drawer.Screen
				name='settings/index'
				options={{
					title: 'Settings',
					drawerIcon: ({ color, size }) => (
						<Ionicons
							name='settings-outline'
							size={size}
							color={color}
						/>
					),
				}}
			/>
		</Drawer>
	);
}
