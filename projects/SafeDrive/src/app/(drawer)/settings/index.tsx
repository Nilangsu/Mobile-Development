import React, { useState } from 'react';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ScrollView,
	useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import CustomAlert from '@/components/CustomAlert';
import { deleteAllDrivesByUser } from '@/database/driveRepository';
import { deleteUser } from '@/database/userRepository';
import { getUserId, logoutUser } from '@/storage/storage';

const SettingsScreen = () => {
	const [visible, setVisible] = useState(false);
	const [message, setMessage] = useState('');
	const { width } = useWindowDimensions();
	const isSmallPhone = width < 360;
	const isLargePhone = width >= 430;
	const isTablet = width >= 768;
	const [deleteVisible, setDeleteVisible] = useState(false);
	const [clearVisible, setClearVisible] = useState(false);
	function showAlert(message: string) {
		setMessage(message);
		setVisible(true);
	}

	async function clearHistory() {
		const userId = await getUserId();
		if (!userId) {
			showAlert('User not found');
			return;
		}
		deleteAllDrivesByUser(Number(userId));
		showAlert('Drive history cleared successfully');
	}

	async function deleteAccount() {
		const userId = await getUserId();
		if (!userId) {
			showAlert('User not found');
			return;
		}
		deleteAllDrivesByUser(Number(userId));
		deleteUser(Number(userId));
		await logoutUser();
		router.replace('/onboarding/page1');
	}
	async function confirmClearHistory() {
		const userId = await getUserId();
		if (!userId) {
			showAlert('User not found');
			return;
		}
		setClearVisible(false);
		deleteAllDrivesByUser(Number(userId));
		showAlert('Drive history cleared successfully');
	}
	return (
		<>
			<CustomAlert
				visible={visible}
				message={message}
				onClose={() => setVisible(false)}
			/>
			<CustomAlert
				visible={deleteVisible}
				title='Delete Account'
				message='This will permanently delete your account and all driving history. This action cannot be undone.'
				showCancel
				confirmText='Delete'
				cancelText='Cancel'
				onClose={() => setDeleteVisible(false)}
				onConfirm={deleteAccount}
			/>
			<CustomAlert
				visible={clearVisible}
				title='Clear Drive History'
				message='This will permanently remove all recorded drives and driving events. This action cannot be undone.'
				showCancel
				confirmText='Clear'
				cancelText='Cancel'
				onClose={() => setClearVisible(false)}
				onConfirm={confirmClearHistory}
			/>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}>
				<Text
					style={[
						styles.title,
						{
							fontSize: isTablet
								? 40
								: isLargePhone
									? 36
									: isSmallPhone
										? 28
										: 32,
						},
					]}>
					Settings
				</Text>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Application</Text>
					<View style={styles.card}>
						<Text style={styles.label}>App Name</Text>
						<Text style={styles.value}>SafeDrive</Text>
					</View>
					<View style={styles.card}>
						<Text style={styles.label}>Version</Text>
						<Text style={styles.value}>1.0.0</Text>
					</View>
				</View>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Safety Information</Text>
					<View style={styles.card}>
						<Text style={styles.infoText}>
							SafeDrive monitors driving behavior using device sensors and
							provides safety insights based on braking, acceleration, steering
							and phone handling events detected during trips.
						</Text>
					</View>
				</View>
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Data Management</Text>
					<Pressable
						style={({ pressed }) => [
							styles.actionButton,
							styles.clearButton,
							pressed && styles.buttonPressed,
						]}
						onPress={() => setClearVisible(true)}>
						<Text style={styles.actionText}>Clear Drive History</Text>
					</Pressable>
					<Pressable
						style={({ pressed }) => [
							styles.actionButton,
							styles.deleteButton,
							pressed && styles.buttonPressed,
						]}
						onPress={() => setDeleteVisible(true)}>
						<Text style={styles.actionText}>Delete Account</Text>
					</Pressable>
				</View>
			</ScrollView>
		</>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
	},

	content: {
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 120,
	},

	title: {
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 24,
		letterSpacing: 0.3,
	},

	section: {
		marginBottom: 24,
	},

	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 14,
	},

	card: {
		backgroundColor: '#5A5A42',
		borderRadius: 24,
		padding: 20,
		marginBottom: 12,
		borderWidth: 1.5,
		borderColor: 'rgba(219,219,195,0.18)',
	},

	label: {
		fontSize: 13,
		color: 'rgba(219,219,195,0.65)',
		marginBottom: 6,
	},

	value: {
		fontSize: 17,
		fontWeight: '600',
		color: '#FFFFE3',
	},

	infoText: {
		fontSize: 15,
		lineHeight: 24,
		color: 'rgba(219,219,195,0.8)',
	},

	actionButton: {
		height: 60,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 12,
		borderWidth: 1.5,

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 8,
	},

	clearButton: {
		backgroundColor: '#8A8A7B',
		borderColor: 'rgba(255,255,227,0.15)',
	},

	deleteButton: {
		backgroundColor: '#62624c',
		borderColor: 'rgba(255,255,227,0.15)',
	},

	buttonPressed: {
		transform: [{ scale: 0.98 }],
		opacity: 0.9,
	},

	actionText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#FFFFE3',
		letterSpacing: 0.3,
	},
});
