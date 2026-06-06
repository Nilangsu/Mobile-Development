import CustomAlert from '@/components/CustomAlert';
import { createUser, getUserByEmail } from '@/database/userRepository';
import { saveUserId } from '@/storage/storage';
import bcrypt from 'bcryptjs';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	useWindowDimensions,
	View,
} from 'react-native';
import 'react-native-get-random-values';
import { SafeAreaView } from 'react-native-safe-area-context';
const AuthScreen = () => {
	const [selectedTab, setSelectedTab] = useState<'register' | 'login'>(
		'register',
	);

	const [registerName, setRegisterName] = useState('');
	const [registerEmail, setRegisterEmail] = useState('');
	const [registerMobile, setRegisterMobile] = useState('');
	const [registerPassword, setRegisterPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [message, setMessage] = useState('');
	const [visible, setVisible] = useState(false);
	const [focusedInput, setFocusedInput] = useState('');
	const { width } = useWindowDimensions();
	const isTablet = width >= 768;
	const isSmallPhone = width <= 375;
	const responsive = responsiveStyles(isTablet, isSmallPhone);

	const showAlert = (message: string) => {
		setMessage(message);
		setVisible(true);
	};

	const validateEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	async function loginVerify() {
		if (!loginEmail || !loginPassword) {
			showAlert('All fields are required');
			return;
		}
		if (!validateEmail(loginEmail)) {
			showAlert('Enter valid email');
			return;
		}
		try {
			const user = getUserByEmail(loginEmail);
			if (!user) {
				showAlert('User not found');
				return;
			}
			const validPassword = await bcrypt.compareSync(
				loginPassword,
				user.password,
			);
			if (!validPassword) {
				showAlert('Incorrect password');
				return;
			}
			await saveUserId(Number(user.id));
			setLoginEmail('');
			setLoginPassword('');
			router.replace('/(drawer)/(tabs)/dashboard');
		} catch (error) {
			console.log('REGISTER ERROR:', error);
			showAlert('Something went wrong');
		}
	}

	async function registerVerify() {
		if (
			!registerName ||
			!registerEmail ||
			!registerMobile ||
			!registerPassword ||
			!confirmPassword
		) {
			showAlert('All fields are required');
			return;
		}
		if (!validateEmail(registerEmail)) {
			showAlert('Enter valid email');
			return;
		}
		if (registerMobile.length !== 10) {
			showAlert('Enter valid mobile number');
			return;
		}
		if (registerPassword.length < 6) {
			showAlert('Password must be at least 6 characters');
			return;
		}
		if (registerPassword !== confirmPassword) {
			showAlert('Passwords do not match');
			return;
		}
		try {
			const existingUser = getUserByEmail(registerEmail);
			if (existingUser) {
				showAlert('Email already exists');
				return;
			}
			const salt = bcrypt.genSaltSync(10);
			const hashedPassword = bcrypt.hashSync(registerPassword, salt);
			const userId = createUser({
				name: registerName,
				email: registerEmail,
				mobile: registerMobile,
				password: hashedPassword,
				createdAt: new Date().toISOString(),
			});
			await saveUserId(Number(userId));
			setRegisterName('');
			setRegisterEmail('');
			setRegisterMobile('');
			setRegisterPassword('');
			setConfirmPassword('');
			router.replace('/(drawer)/(tabs)/dashboard');
		} catch (error) {
			console.log('REGISTER ERROR:', error);
			showAlert('Something went wrong');
		}
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

						<View
							style={{
								alignItems: 'center',
								marginTop: isTablet ? 40 : 24,
								marginBottom: 20,
							}}>
							<Text
								style={{
									fontSize: 34,
									fontWeight: '700',
									color: '#F8FAFC',
								}}>
								SafeDrive
							</Text>

							<Text
								style={{
									color: 'rgba(255,255,255,0.75)',
									marginTop: 6,
									fontSize: 14,
								}}>
								Drive Smarter. Drive Safer.
							</Text>
						</View>

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
								onPress={() => {
									setSelectedTab('login');
								}}>
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
							<View
								key='register'
								style={responsive.formContainer}>
								<Text style={responsive.heading}>Create Account</Text>
								<Text style={responsive.subHeading}>
									Create your account and start tracking your driving
									performance
								</Text>

								<TextInput
									style={[
										responsive.input,
										focusedInput === 'name' && responsive.inputFocused,
									]}
									placeholder='Name'
									placeholderTextColor='rgba(255,255,255,0.5)'
									onFocus={() => setFocusedInput('name')}
									onBlur={() => setFocusedInput('')}
									value={registerName}
									onChangeText={setRegisterName}
								/>

								<TextInput
									style={[
										responsive.input,
										focusedInput === 'email' && responsive.inputFocused,
									]}
									placeholder='Email'
									placeholderTextColor='rgba(255,255,255,0.5)'
									keyboardType='email-address'
									autoCapitalize='none'
									onFocus={() => setFocusedInput('email')}
									onBlur={() => setFocusedInput('')}
									value={registerEmail}
									onChangeText={setRegisterEmail}
								/>

								<TextInput
									style={[
										responsive.input,
										focusedInput === 'mobile' && responsive.inputFocused,
									]}
									placeholder='Mobile Number'
									placeholderTextColor='rgba(255,255,255,0.5)'
									keyboardType='phone-pad'
									maxLength={10}
									onFocus={() => setFocusedInput('mobile')}
									onBlur={() => setFocusedInput('')}
									value={registerMobile}
									onChangeText={setRegisterMobile}
								/>

								<TextInput
									style={[
										responsive.input,
										focusedInput === 'password' && responsive.inputFocused,
									]}
									placeholder='Password'
									placeholderTextColor='rgba(255,255,255,0.5)'
									autoCapitalize='none'
									onFocus={() => setFocusedInput('password')}
									onBlur={() => setFocusedInput('')}
									value={registerPassword}
									onChangeText={setRegisterPassword}
									secureTextEntry
								/>

								<TextInput
									style={[
										responsive.input,
										focusedInput === 'confirmPassword' &&
											responsive.inputFocused,
									]}
									placeholder='Confirm Password'
									placeholderTextColor='rgba(255,255,255,0.5)'
									secureTextEntry
									autoCapitalize='none'
									onFocus={() => setFocusedInput('confirmPassword')}
									onBlur={() => setFocusedInput('')}
									value={confirmPassword}
									onChangeText={setConfirmPassword}
								/>

								<Pressable
									style={({ pressed }) => [
										responsive.primaryButton,
										pressed && responsive.pressedPrimaryButton,
									]}
									onPress={registerVerify}>
									<Text style={responsive.primaryButtonText}>
										Create Account
									</Text>
								</Pressable>
							</View>
						) : (
							<View
								key='login'
								style={responsive.formContainer}>
								<Text style={responsive.heading}>Welcome Back</Text>
								<Text style={responsive.subHeading}>
									Sign in to access your driving history and safety score
								</Text>

								<TextInput
									style={[
										responsive.input,
										focusedInput === 'loginEmail' && responsive.inputFocused,
									]}
									placeholder='Email'
									placeholderTextColor='rgba(255,255,255,0.5)'
									keyboardType='email-address'
									autoCapitalize='none'
									onFocus={() => setFocusedInput('loginEmail')}
									onBlur={() => setFocusedInput('')}
									value={loginEmail}
									onChangeText={setLoginEmail}
								/>

								<TextInput
									style={[
										responsive.input,
										focusedInput === 'loginPassword' && responsive.inputFocused,
									]}
									placeholder='Password'
									placeholderTextColor='rgba(255,255,255,0.5)'
									secureTextEntry
									autoCapitalize='none'
									onFocus={() => setFocusedInput('loginPassword')}
									onBlur={() => setFocusedInput('')}
									value={loginPassword}
									onChangeText={setLoginPassword}
								/>

								<Pressable
									style={({ pressed }) => [
										responsive.primaryButton,
										pressed && responsive.pressedPrimaryButton,
									]}
									onPress={loginVerify}>
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

export default AuthScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
		paddingHorizontal: 20,
	},
});

const responsiveStyles = (isTablet: boolean, isSmallPhone: boolean) =>
	StyleSheet.create({
		tabContainer: {
			flexDirection: 'row',
			backgroundColor: 'rgba(138,138,123,0.15)',
			borderRadius: isTablet ? 22 : 16,
			padding: 5,
			marginTop: isTablet ? 50 : 28,
			marginBottom: isTablet ? 26 : 18,
			alignSelf: 'center',
			width: '92%',
			maxWidth: 650,
			borderWidth: 1,
			borderColor: 'rgba(219,219,195,0.15)',
		},
		inputFocused: {
			borderColor: '#FFFFE3',
			backgroundColor: 'rgba(255,255,227,0.08)',
		},
		tabButton: {
			flex: 1,
			paddingVertical: isTablet ? 16 : 12,
			borderRadius: isTablet ? 16 : 12,
			alignItems: 'center',
			justifyContent: 'center',
		},

		activeTab: {
			backgroundColor: '#DBDBC3',
		},

		tabText: {
			color: 'rgba(219,219,195,0.65)',
			fontSize: isTablet ? 18 : isSmallPhone ? 13 : 15,
			fontWeight: '600',
		},

		activeTabText: {
			color: '#4A4A32',
		},

		formContainer: {
			backgroundColor: 'rgba(138,138,123,0.12)',
			borderRadius: isTablet ? 30 : 22,
			padding: isTablet ? 32 : 20,
			width: '92%',
			maxWidth: 650,
			alignSelf: 'center',
			marginBottom: 30,
			borderWidth: 1,
			borderColor: 'rgba(219,219,195,0.15)',
		},

		heading: {
			fontSize: isTablet ? 34 : isSmallPhone ? 22 : 26,
			fontWeight: '700',
			color: '#FFFFE3',
			marginBottom: 8,
			textAlign: 'center',
			letterSpacing: 0.3,
		},

		subHeading: {
			fontSize: isTablet ? 16 : isSmallPhone ? 12 : 13,
			color: 'rgba(219,219,195,0.75)',
			lineHeight: isTablet ? 24 : 20,
			marginBottom: isTablet ? 28 : 22,
			textAlign: 'center',
		},

		input: {
			backgroundColor: 'rgba(255,255,227,0.05)',
			height: isTablet ? 60 : 52,
			borderRadius: isTablet ? 18 : 16,
			paddingHorizontal: isTablet ? 20 : 16,
			color: '#FFFFE3',
			fontSize: isTablet ? 16 : 14,
			marginBottom: isTablet ? 18 : 14,
			borderWidth: 1,
			borderColor: 'rgba(219,219,195,0.2)',
		},

		primaryButton: {
			backgroundColor: '#DBDBC3',
			height: isTablet ? 60 : 54,
			borderRadius: isTablet ? 18 : 16,
			justifyContent: 'center',
			alignItems: 'center',
			marginTop: 10,
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

		pressedPrimaryButton: {
			opacity: 0.9,
			transform: [{ scale: 0.97 }],
		},

		primaryButtonText: {
			color: '#4A4A32',
			fontSize: isTablet ? 17 : isSmallPhone ? 14 : 15,
			fontWeight: '700',
			letterSpacing: 0.3,
		},

		overlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.45)',
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: isTablet ? 70 : 24,
		},

		alertBox: {
			width: '100%',
			maxWidth: 500,
			backgroundColor: '#4A4A32',
			borderRadius: isTablet ? 28 : 22,
			padding: isTablet ? 30 : 22,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: 'rgba(219,219,195,0.15)',
		},

		title: {
			fontSize: isTablet ? 24 : 20,
			fontWeight: '700',
			color: '#FFFFE3',
			marginBottom: 10,
		},

		message: {
			fontSize: isTablet ? 16 : 14,
			color: 'rgba(219,219,195,0.75)',
			textAlign: 'center',
			lineHeight: isTablet ? 26 : 22,
			marginBottom: 22,
		},

		button: {
			backgroundColor: '#DBDBC3',
			paddingHorizontal: 30,
			paddingVertical: isTablet ? 15 : 12,
			borderRadius: isTablet ? 16 : 12,
			width: '100%',
			alignItems: 'center',
			borderWidth: 1,
			borderColor: 'rgba(255,255,227,0.15)',
		},

		buttonText: {
			color: '#4A4A32',
			fontSize: isTablet ? 16 : 14,
			fontWeight: '700',
		},
	});
