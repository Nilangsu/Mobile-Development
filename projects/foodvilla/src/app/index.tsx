import RootNavigator from '@/navigation/rootNavigation';
import * as Linking from 'expo-linking';
import { useEffect } from 'react';
export default function Index() {
	useEffect(() => {
		Linking.getInitialURL().then((url) => {
			console.log(url);
		});
	}, []);
	return <RootNavigator />;
}
