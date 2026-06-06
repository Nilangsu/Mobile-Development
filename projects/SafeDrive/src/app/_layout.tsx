import { Stack } from 'expo-router';
import { useEffect } from 'react';
import * as NavigationBar from 'expo-navigation-bar';
import { AppState } from 'react-native';
import { initializeDatabase } from '../database/database';

export default function RootLayout() {
	useEffect(() => {
		initializeDatabase();
		const hideNavigation = async () => {
			await NavigationBar.setBehaviorAsync('overlay-swipe');
			await NavigationBar.setVisibilityAsync('hidden');
		};
		hideNavigation();
		const subscription = AppState.addEventListener('change', (state) => {
			if (state === 'active') {
				hideNavigation();
			}
		});
		return () => subscription.remove();
	}, []);

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name='index' />
			<Stack.Screen name='onboarding' />
			<Stack.Screen name='auth/index' />
			<Stack.Screen name='(drawer)' />
		</Stack>
	);
}
