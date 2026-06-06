import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getUserId } from '@/storage/storage';

export default function Index() {
	useEffect(() => {
		const checkLogin = async () => {
			try {
				const userId = await getUserId();
				if (userId) {
					router.replace('/(drawer)/(tabs)/dashboard');
				} else {
					router.replace('/onboarding/page1');
				}
			} catch (error) {
				router.replace('/onboarding/page1');
			}
		};
		checkLogin();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#6F8F9F',
			}}>
			<ActivityIndicator
				size='large'
				color='#F8FAFC'
			/>
		</View>
	);
}
