import {
	Pressable,
	StyleSheet,
	Text,
	View,
	Image,
	useWindowDimensions,
} from 'react-native';

import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/rootNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboard'>;

const Onboard = () => {
	const navigation = useNavigation<NavigationProp>();
	const { width } = useWindowDimensions();
	const isTablet = width > 768;
	const isSmallPhone = width < 380;
	const responsive = responsiveStyles(isTablet, isSmallPhone);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.contentContainer}>
				<View style={styles.logoContainer}>
					<Image
						source={require('@/assets/images/logo.png')}
						style={responsive.logo}
					/>
				</View>

				<View style={styles.textContainer}>
					<Text style={responsive.heading}>Welcome to Food Villa</Text>

					<Text style={responsive.subHeading}>
						Discover premium meals, fast delivery, and unforgettable flavors
						right at your fingertips.
					</Text>
				</View>
				<Pressable
					style={({ pressed }) => [
						responsive.button,
						pressed && responsive.pressedButton,
					]}
					onPress={() => navigation.navigate('Auth')}>
					<Text style={responsive.buttonText}>Get Started</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
};

export default Onboard;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ECE7BE',
	},

	contentContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		paddingVertical: 40,
	},

	logoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},

	textContainer: {
		alignItems: 'center',
		marginBottom: 40,
		marginTop: -110,
	},
});

const responsiveStyles = (isTablet: boolean, isSmallPhone: boolean) =>
	StyleSheet.create({
		logo: {
			width: isTablet ? 260 : isSmallPhone ? 150 : 200,
			height: isTablet ? 260 : isSmallPhone ? 150 : 200,
			resizeMode: 'contain',
		},

		heading: {
			color: '#0B0B0B',
			fontWeight: '700',
			textAlign: 'center',
			marginBottom: 16,
			fontSize: isTablet ? 42 : isSmallPhone ? 28 : 34,
		},

		subHeading: {
			color: '#6E6A5E',
			textAlign: 'center',
			lineHeight: 24,
			fontSize: isTablet ? 18 : 15,
			paddingHorizontal: isTablet ? 80 : 20,
		},

		button: {
			backgroundColor: '#0B0B0B',
			borderRadius: 20,
			alignItems: 'center',
			justifyContent: 'center',
			marginBottom: 100,
			shadowColor: '#0B0B0B',
			shadowOffset: {
				width: 0,
				height: 8,
			},
			shadowOpacity: 0.35,
			shadowRadius: 12,
			elevation: 10,
			height: isTablet ? 70 : 58,
			width: isTablet ? '60%' : '100%',
		},

		pressedButton: {
			backgroundColor: '#2A2A2A',
			opacity: 0.9,
			transform: [{ scale: 0.95 }],
		},

		buttonText: {
			color: '#F5F1D8',
			fontWeight: '700',
			fontSize: isTablet ? 20 : 17,
		},
	});
