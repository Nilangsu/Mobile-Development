import {
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
	Modal,
	TouchableOpacity,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	useWindowDimensions,
	Keyboard,
	ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/rootNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;
const Auth = () => {
	const navigation = useNavigation<NavigationProp>();
	const [selectedTab, setSelectedTab] = useState<string>('register');
	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [mobile, setMobile] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const [visible, setVisible] = useState(false);
	const { width } = useWindowDimensions();
	const isTablet = width > 768;
	const isSmallPhone = width < 380;
	const responsive = responsiveStyles(isTablet, isSmallPhone);

	type Props = {
		visible: boolean;
		title?: string;
		message: string;
		onClose: () => void;
	};

	const CustomAlert = ({
		visible,
		title = 'Alert',
		message,
		onClose,
	}: Props) => {
		return (
			<Modal
				transparent
				visible={visible}
				animationType='fade'>
				<View style={responsive.overlay}>
					<View style={responsive.alertBox}>
						<Text style={responsive.title}>{title}</Text>

						<Text style={responsive.message}>{message}</Text>

						<TouchableOpacity
							style={responsive.button}
							onPress={onClose}>
							<Text style={responsive.buttonText}>OK</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		);
	};

	function loginVerify() {
		if (!email || !password) {
			setMessage('All fields are required');
			setVisible(true);
			return;
		}
		const validateEmail = (email: string) => {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		};
		if (!validateEmail(email)) {
			setMessage('Enter valid email');
			setVisible(true);
			return;
		}
		navigation.replace('Home', {
			userData: {
				name: 'FoodVilla User',
				email: email,
				mobile: '+91 9876543210',
			},
		});
	}

	function registerVerify() {
		const validateEmail = (email: string) => {
			return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
		};
		if (!userName || !email || !mobile || !password || !confirmPassword) {
			setMessage('All fields are required');
			setVisible(true);
			return;
		}
		if (!validateEmail(email)) {
			setMessage('Enter valid email');
			setVisible(true);
			return;
		}
		if (mobile.length !== 10) {
			setMessage('Enter valid mobile number');
			setVisible(true);
			return;
		}
		if (password.length < 6) {
			setMessage('Password must be at least 6 characters');
			setVisible(true);
			return;
		}
		if (password !== confirmPassword) {
			setMessage('Passwords do not match');
			setVisible(true);
			return;
		}
		navigation.replace('Home', {
			userData: {
				name: userName,
				email: email,
				mobile: mobile,
			},
		});
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={styles.container}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior='height'>
					<ScrollView
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps='handled'
						contentContainerStyle={{
							flexGrow: 1,
							justifyContent: 'center',
							paddingBottom: 40,
						}}>
						<CustomAlert
							visible={visible}
							message={message}
							onClose={() => setVisible(false)}
						/>
						<View style={responsive.tabContainer}>
							<Pressable
								style={[
									responsive.tabButton,
									selectedTab === 'register' && responsive.activeTab,
								]}
								onPress={() => setSelectedTab('register')}>
								<Text
									style={[
										responsive.tabText,
										selectedTab === 'register' && responsive.activeTabText,
									]}>
									Register
								</Text>
							</Pressable>
							<Pressable
								style={[
									responsive.tabButton,
									selectedTab === 'login' && responsive.activeTab,
								]}
								onPress={() => setSelectedTab('login')}>
								<Text
									style={[
										responsive.tabText,
										selectedTab === 'login' && responsive.activeTabText,
									]}>
									Login
								</Text>
							</Pressable>
						</View>
						{selectedTab === 'register' ? (
							<View style={responsive.formContainer}>
								<Text style={responsive.heading}>Create Account</Text>
								<Text style={responsive.subHeading}>
									Join us and discover delicious food nearby
								</Text>
								<TextInput
									style={responsive.input}
									placeholderTextColor='#8B6F63'
									placeholder='Name'
									onChangeText={setUserName}
								/>
								<TextInput
									style={responsive.input}
									placeholderTextColor='#8B6F63'
									placeholder='Email'
									onChangeText={setEmail}
								/>
								<TextInput
									style={responsive.input}
									placeholderTextColor='#8B6F63'
									placeholder='Mobile Number'
									onChangeText={setMobile}
								/>
								<TextInput
									style={responsive.input}
									placeholderTextColor='#8B6F63'
									placeholder='Password'
									secureTextEntry
									onChangeText={setPassword}
								/>

								<TextInput
									style={responsive.input}
									placeholderTextColor='#8B6F63'
									placeholder='Confirm Password'
									secureTextEntry
									onChangeText={setConfirmPassword}
								/>
								<Pressable
									style={({ pressed }) => [
										responsive.primaryButton,
										pressed && responsive.pressedPrimaryButton,
									]}
									onPress={registerVerify}>
									<Text style={responsive.primaryButtonText}>Register</Text>
								</Pressable>
							</View>
						) : (
							<View style={responsive.formContainer}>
								<Text style={responsive.heading}>Welcome Back</Text>

								<Text style={responsive.subHeading}>
									Login to continue ordering your favorite meals
								</Text>
								<TextInput
									style={responsive.input}
									placeholderTextColor='#8B6F63'
									placeholder='Email'
									onChangeText={setEmail}
								/>
								<TextInput
									style={responsive.input}
									placeholderTextColor='#8B6F63'
									placeholder='Password'
									secureTextEntry
									onChangeText={setPassword}
								/>
								<Pressable
									style={({ pressed }) => [
										responsive.primaryButton,
										pressed && responsive.pressedPrimaryButton,
									]}
									onPress={() => loginVerify()}>
									<Text style={responsive.primaryButtonText}>Login</Text>
								</Pressable>
							</View>
						)}
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};

export default Auth;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ECE7BE',
		paddingHorizontal: 20,
	},
});

const responsiveStyles = (isTablet: boolean, isSmallPhone: boolean) =>
	StyleSheet.create({
		tabContainer: {
			flexDirection: 'row',
			backgroundColor: '#F5F1D8',
			borderRadius: isTablet ? 22 : 16,
			padding: 5,
			marginTop: isTablet ? 50 : 28,
			marginBottom: isTablet ? 26 : 18,
			alignSelf: 'center',
			width: '92%',
		},

		tabButton: {
			flex: 1,
			paddingVertical: isTablet ? 16 : 12,
			borderRadius: isTablet ? 16 : 12,
			alignItems: 'center',
		},

		activeTab: {
			backgroundColor: '#0B0B0B',
		},

		tabText: {
			color: '#8C8774',
			fontSize: isTablet ? 18 : isSmallPhone ? 13 : 15,
			fontWeight: '600',
		},

		activeTabText: {
			color: '#F5F1D8',
		},

		formContainer: {
			backgroundColor: '#F5F1D8',
			borderRadius: isTablet ? 30 : 22,
			padding: isTablet ? 28 : 18,
			width: '92%',
			alignSelf: 'center',
			marginBottom: 30,
		},

		heading: {
			fontSize: isTablet ? 34 : isSmallPhone ? 22 : 26,
			fontWeight: '700',
			color: '#0B0B0B',
			marginBottom: 8,
			textAlign: 'center',
		},

		subHeading: {
			fontSize: isTablet ? 16 : isSmallPhone ? 12 : 13,
			color: '#6E6A5E',
			lineHeight: isTablet ? 24 : 20,
			marginBottom: isTablet ? 28 : 22,
			textAlign: 'center',
		},

		input: {
			backgroundColor: '#EFE9CC',
			height: isTablet ? 60 : 48,
			borderRadius: isTablet ? 18 : 14,
			paddingHorizontal: isTablet ? 20 : 16,
			color: '#0B0B0B',
			fontSize: isTablet ? 16 : 14,
			marginBottom: isTablet ? 18 : 14,
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		primaryButton: {
			backgroundColor: '#0B0B0B',
			height: isTablet ? 60 : 50,
			borderRadius: isTablet ? 18 : 14,
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 8,
			shadowColor: '#0B0B0B',
			shadowOffset: {
				width: 0,
				height: 6,
			},
			shadowOpacity: 0.25,
			shadowRadius: 10,
			elevation: 8,
		},

		pressedPrimaryButton: {
			backgroundColor: '#2A2A2A',
			opacity: 0.9,
			transform: [{ scale: 0.97 }],
		},

		primaryButtonText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 17 : isSmallPhone ? 14 : 15,
			fontWeight: '700',
		},

		overlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.12)',
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: isTablet ? 70 : 24,
		},

		alertBox: {
			width: '100%',
			backgroundColor: '#F5F1D8',
			borderRadius: isTablet ? 28 : 22,
			padding: isTablet ? 30 : 22,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		title: {
			fontSize: isTablet ? 24 : 20,
			fontWeight: '700',
			color: '#0B0B0B',
			marginBottom: 10,
		},

		message: {
			fontSize: isTablet ? 16 : 14,
			color: '#6E6A5E',
			textAlign: 'center',
			lineHeight: isTablet ? 26 : 22,
			marginBottom: 22,
		},

		button: {
			backgroundColor: '#0B0B0B',
			paddingHorizontal: 30,
			paddingVertical: isTablet ? 15 : 12,
			borderRadius: isTablet ? 16 : 12,
			width: '100%',
			alignItems: 'center',
		},

		buttonText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 16 : 14,
			fontWeight: '700',
		},
	});
