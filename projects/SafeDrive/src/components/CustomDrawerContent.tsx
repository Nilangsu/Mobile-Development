import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useFocusEffect } from 'expo-router';
import {
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { getUserId, logoutUser } from '@/storage/storage';
import { getUserById } from '@/database/userRepository';
import { useDrawerStatus } from '@react-navigation/drawer';
export default function CustomDrawerContent(props: any) {
	const [user, setUser] = useState<any>(null);
	const drawerStatus = useDrawerStatus();
	useEffect(() => {
		if (drawerStatus === 'open') {
			loadUser();
		}
	}, [drawerStatus]);

	async function loadUser() {
		const userId = await getUserId();
		if (!userId) return;
		const userData = getUserById(Number(userId));
		if (!userData) return;
		setUser(userData);
	}

	async function handleLogout() {
		await logoutUser();
		router.replace('/');
	}

	return (
		<SafeAreaView
			style={styles.container}
			edges={['top', 'bottom']}>
			<DrawerContentScrollView
				{...props}
				contentContainerStyle={styles.scrollContent}>
				<View style={styles.profileSection}>
					{user?.profileImage ? (
						<Image
							source={{
								uri: user.profileImage,
							}}
							style={styles.avatar}
						/>
					) : (
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>
								{user?.name?.charAt(0)?.toUpperCase() || 'U'}
							</Text>
						</View>
					)}
					<Text style={styles.name}>{user?.name || 'User'}</Text>
					<Text style={styles.email}>{user?.email || ''}</Text>
				</View>
				<View style={styles.divider} />
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
			<View style={styles.footer}>
				<Pressable
					style={({ pressed }) => [
						styles.logoutButton,
						pressed && styles.logoutPressed,
					]}
					onPress={handleLogout}>
					<Ionicons
						name='log-out-outline'
						size={20}
						color='#FFFFE3'
					/>
					<Text style={styles.logoutText}>Logout</Text>
				</Pressable>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
	},

	scrollContent: {
		paddingTop: 8,
	},

	profileSection: {
		alignItems: 'center',
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 24,
	},

	avatar: {
		width: 96,
		height: 96,
		borderRadius: 48,
		backgroundColor: '#DBDBC3',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 16,
		borderWidth: 2,
		borderColor: 'rgba(255,255,227,0.15)',
	},

	avatarText: {
		fontSize: 38,
		fontWeight: '800',
		color: '#4A4A32',
	},

	name: {
		fontSize: 22,
		fontWeight: '700',
		color: '#FFFFE3',
		textAlign: 'center',
	},

	email: {
		fontSize: 13,
		color: 'rgba(219,219,195,0.75)',
		marginTop: 6,
		textAlign: 'center',
	},

	divider: {
		height: 1,
		backgroundColor: 'rgba(219,219,195,0.12)',
		marginHorizontal: 20,
		marginBottom: 12,
	},

	footer: {
		paddingHorizontal: 20,
		paddingBottom: 24,
		paddingTop: 12,
		borderTopWidth: 1,
		borderTopColor: 'rgba(219,219,195,0.12)',
	},

	logoutButton: {
		height: 58,
		borderRadius: 20,
		backgroundColor: '#8A8A7B',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 10,
		borderWidth: 1,
		borderColor: 'rgba(255,255,227,0.15)',
	},

	logoutPressed: {
		transform: [{ scale: 0.98 }],
		opacity: 0.9,
	},

	logoutText: {
		color: '#FFFFE3',
		fontSize: 15,
		fontWeight: '700',
		letterSpacing: 0.3,
	},
});
