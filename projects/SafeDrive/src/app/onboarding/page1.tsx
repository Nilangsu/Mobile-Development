import React from 'react';
import {
	View,
	Text,
	Image,
	StyleSheet,
	Pressable,
	useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
const Page1 = () => {
	const { width } = useWindowDimensions();
	const isSmallPhone = width < 360;
	const isLargePhone = width >= 430;
	const isTablet = width >= 768;
	const imageSize = isTablet ? 500 : isLargePhone ? width * 0.75 : width * 0.82;
	const headingSize = isTablet
		? 52
		: isLargePhone
			? 42
			: isSmallPhone
				? 30
				: 36;

	const subHeadingSize = isTablet ? 20 : 16;
	const subHeadingLineHeight = isTablet ? 34 : 28;
	const horizontalPadding = isTablet ? 48 : isLargePhone ? 32 : 24;
	const buttonHeight = isTablet ? 70 : 58;
	return (
		<SafeAreaView style={styles.container}>
			<View
				style={[
					styles.content,
					{
						paddingHorizontal: horizontalPadding,
					},
				]}>
				<Image
					source={require('../../assets/images/onboarding1.png')}
					style={[
						styles.image,
						{
							width: imageSize,
							height: imageSize,
						},
					]}
					resizeMode='contain'
				/>
				<View style={styles.textSection}>
					<Text
						style={[
							styles.heading,
							{
								fontSize: headingSize,
							},
						]}>
						Track Every Drive
					</Text>
					<Text
						style={[
							styles.subHeading,
							{
								fontSize: subHeadingSize,
								lineHeight: subHeadingLineHeight,
							},
						]}>
						Monitor your driving behavior in real time using advanced motion
						sensors and gain valuable insights from every trip.
					</Text>
				</View>
				<View style={styles.bottomSection}>
					<View style={styles.dots}>
						<View style={[styles.dot, styles.activeDot]} />
						<View style={styles.dot} />
						<View style={styles.dot} />
					</View>
					<Pressable
						style={({ pressed }) => [
							styles.button,
							{
								minHeight: buttonHeight,
							},
							pressed && styles.buttonPressed,
						]}
						onPress={() => router.push('/onboarding/page2')}>
						<Text style={styles.buttonText}>Next</Text>
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default Page1;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
	},

	content: {
		flex: 1,
		paddingTop: 12,
		paddingBottom: 28,
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	image: {
		marginTop: 10,
		maxWidth: 500,
		maxHeight: 500,
	},

	textSection: {
		width: '100%',
		alignItems: 'center',
		paddingHorizontal: 8,
	},

	heading: {
		fontWeight: '700',
		color: '#FFFFE3',
		textAlign: 'center',
		marginBottom: 16,
		letterSpacing: 0.4,
	},

	subHeading: {
		color: 'rgba(219,219,195,0.82)',
		textAlign: 'center',
		maxWidth: 520,
		fontWeight: '500',
	},

	bottomSection: {
		width: '100%',
		alignItems: 'center',
		gap: 32,
	},

	dots: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},

	dot: {
		width: 10,
		height: 10,
		borderRadius: 999,
		backgroundColor: 'rgba(219,219,195,0.25)',
	},

	activeDot: {
		width: 34,
		backgroundColor: '#FFFFE3',
	},

	button: {
		width: '100%',
		maxWidth: 550,
		backgroundColor: '#DBDBC3',
		borderRadius: 24,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,255,227,0.15)',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.3,
		shadowRadius: 18,
		elevation: 10,
	},

	buttonPressed: {
		transform: [{ scale: 0.97 }],
		opacity: 0.9,
	},

	buttonText: {
		color: '#4A4A32',
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.4,
	},
});
