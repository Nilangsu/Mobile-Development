import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import { Image } from 'react-native';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ScrollView,
	useWindowDimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { getUserId, logoutUser } from '@/storage/storage';
import { getUserById, updateUserProfileImage } from '@/database/userRepository';
import { getDrivesByUser } from '@/database/driveRepository';

const ProfileScreen = () => {
	const [user, setUser] = useState<any>(null);
	const [totalDrives, setTotalDrives] = useState(0);
	const [averageScore, setAverageScore] = useState(0);
	const { width } = useWindowDimensions();
	const isSmallPhone = width < 360;
	const isLargePhone = width >= 430;
	const isTablet = width >= 768;

	useFocusEffect(
		useCallback(() => {
			loadProfile();
		}, []),
	);

	async function pickProfileImage() {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.8,
		});
		if (result.canceled) return;
		const image = result.assets[0];
		const userId = await getUserId();
		if (!userId) return;
		const destination = new File(Paths.document, `profile_${Date.now()}.jpg`);
		const source = new File(image.uri);
		source.copy(destination);
		updateUserProfileImage(Number(userId), destination.uri);
		loadProfile();
		const updatedUser = getUserById(Number(userId));
		setUser(updatedUser);
	}
	async function loadProfile() {
		const userId = await getUserId();
		if (!userId) return;
		const userData = getUserById(Number(userId));
		if (!userData) return;
		const drives = getDrivesByUser(Number(userId));
		setUser(userData);
		setTotalDrives(drives.length);
		const average =
			drives.length === 0
				? 0
				: Math.round(
						drives.reduce((sum, drive) => sum + drive.score, 0) / drives.length,
					);
		setAverageScore(average);
	}

	async function handleLogout() {
		await logoutUser();
		router.replace('/');
	}
	if (!user) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.title}>Profile</Text>
			</View>
		);
	}
	return (
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
				Profile
			</Text>
			<View style={styles.profileCard}>
				<Pressable
					style={({ pressed }) => [
						styles.avatarContainer,
						pressed && styles.avatarPressed,
					]}
					onPress={pickProfileImage}>
					{user.profileImage ? (
						<Image
							source={{ uri: user.profileImage }}
							style={styles.avatar}
						/>
					) : (
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>
								{user.name.charAt(0).toUpperCase()}
							</Text>
						</View>
					)}

					<View style={styles.cameraBadge}>
						<Ionicons
							name='camera'
							size={16}
							color='#4A4A32'
						/>
					</View>
				</Pressable>
				<Text style={styles.name}>{user.name}</Text>
				<Text style={styles.email}>{user.email}</Text>
			</View>
			<View style={styles.card}>
				<Text style={styles.label}>Mobile Number</Text>
				<Text style={styles.value}>{user.mobile}</Text>
			</View>
			<View style={styles.statsRow}>
				<View style={styles.statCard}>
					<Text style={styles.statValue}>{totalDrives}</Text>
					<Text style={styles.statLabel}>Drives</Text>
				</View>
				<View style={styles.statCard}>
					<Text style={styles.statValue}>{averageScore}</Text>
					<Text style={styles.statLabel}>Avg Score</Text>
				</View>
			</View>
			<Pressable
				style={({ pressed }) => [
					styles.logoutButton,
					pressed && styles.logoutButtonPressed,
				]}
				onPress={handleLogout}>
				<Text style={styles.logoutText}>Logout</Text>
			</Pressable>
		</ScrollView>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
	},

	loadingContainer: {
		flex: 1,
		backgroundColor: '#4A4A32',
		paddingHorizontal: 20,
		paddingTop: 20,
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

	profileCard: {
		backgroundColor: '#5A5A42',
		borderRadius: 28,
		paddingVertical: 28,
		paddingHorizontal: 24,
		alignItems: 'center',
		marginBottom: 16,
		borderWidth: 1.5,
		borderColor: 'rgba(219,219,195,0.18)',
	},

	avatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: '#DBDBC3',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: 'rgba(255,255,227,0.15)',
	},

	avatarText: {
		fontSize: 38,
		fontWeight: '800',
		color: '#4A4A32',
	},

	name: {
		fontSize: 24,
		fontWeight: '700',
		color: '#FFFFE3',
		textAlign: 'center',
	},

	email: {
		fontSize: 14,
		color: 'rgba(219,219,195,0.75)',
		marginTop: 8,
		textAlign: 'center',
	},

	card: {
		backgroundColor: '#5A5A42',
		borderRadius: 24,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1.5,
		borderColor: 'rgba(219,219,195,0.18)',
	},

	label: {
		fontSize: 13,
		color: 'rgba(219,219,195,0.65)',
		marginBottom: 8,
	},

	value: {
		fontSize: 18,
		fontWeight: '600',
		color: '#FFFFE3',
	},

	statsRow: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 20,
	},

	statCard: {
		flex: 1,
		backgroundColor: '#5A5A42',
		borderRadius: 24,
		paddingVertical: 24,
		paddingHorizontal: 16,
		alignItems: 'center',
		borderWidth: 1.5,
		borderColor: 'rgba(219,219,195,0.18)',
	},

	statValue: {
		fontSize: 34,
		fontWeight: '800',
		color: '#FFFFE3',
	},

	statLabel: {
		fontSize: 13,
		color: 'rgba(219,219,195,0.7)',
		marginTop: 6,
	},

	logoutButton: {
		height: 60,
		borderRadius: 24,
		backgroundColor: '#8A8A7B',
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1.5,
		borderColor: 'rgba(255,255,227,0.15)',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 16,
		elevation: 8,
	},

	logoutButtonPressed: {
		backgroundColor: '#A0A08D',
		transform: [{ scale: 0.98 }],
	},

	logoutText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#FFFFE3',
		letterSpacing: 0.3,
	},
	avatarContainer: {
		marginBottom: 18,
		position: 'relative',
	},

	avatarPressed: {
		transform: [{ scale: 0.97 }],
	},

	cameraBadge: {
		position: 'absolute',
		right: -2,
		bottom: 12,

		width: 32,
		height: 32,
		borderRadius: 16,

		backgroundColor: '#DBDBC3',

		justifyContent: 'center',
		alignItems: 'center',

		borderWidth: 2,
		borderColor: '#5A5A42',
	},

	changePhotoText: {
		fontSize: 12,
		color: 'rgba(219,219,195,0.65)',
		marginTop: 8,
	},
});
