import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
} from 'react-native';

import { getDrivesByUser } from '@/database/driveRepository';
import { getUserId } from '@/storage/storage';

const HistoryScreen = () => {
	const [drives, setDrives] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const { width } = useWindowDimensions();
	const isSmallPhone = width < 360;
	const isLargePhone = width >= 430;
	const isTablet = width >= 768;
	useFocusEffect(
		useCallback(() => {
			loadDrives();
		}, []),
	);

	async function loadDrives() {
		try {
			const userId = await getUserId();
			if (!userId) {
				setDrives([]);
				return;
			}
			const data = getDrivesByUser(Number(userId));
			setDrives(data);
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={styles.container}>
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
				Drive History
			</Text>

			{!loading && drives.length === 0 ? (
				<View style={styles.emptyContainer}>
					<View style={styles.emptyCard}>
						<Text style={styles.emptyTitle}>No Driving Records Yet</Text>
						<Text style={styles.emptyText}>
							Complete your first drive to see your driving history, scores and
							performance insights.
						</Text>
					</View>
				</View>
			) : (
				<FlatList
					data={drives}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.listContent}
					renderItem={({ item }) => (
						<Pressable
							style={({ pressed }) => [
								styles.card,
								pressed && styles.cardPressed,
							]}
							onPress={() =>
								router.push({
									pathname: '/(drawer)/(tabs)/drive/summary',
									params: {
										driveId: String(item.id),
									},
								})
							}>
							<View style={styles.topRow}>
								<View>
									<Text style={styles.score}>{item.score}</Text>
									<Text style={styles.label}>Safety Score</Text>
								</View>
								<View style={styles.ratingContainer}>
									<Text style={styles.rating}>{item.rating}</Text>
								</View>
							</View>
							<View style={styles.divider} />
							<View style={styles.bottomRow}>
								<View>
									<Text style={styles.infoLabel}>Date</Text>
									<Text style={styles.infoValue}>
										{new Date(item.createdAt).toLocaleDateString()}
									</Text>
								</View>
								<View style={styles.rightInfo}>
									<Text style={styles.infoLabel}>Duration</Text>
									<Text style={styles.infoValue}>{item.duration}s</Text>
								</View>
							</View>
						</Pressable>
					)}
				/>
			)}
		</View>
	);
};

export default HistoryScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
		paddingHorizontal: 20,
		paddingTop: 20,
	},

	title: {
		fontSize: 32,
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 24,
		letterSpacing: 0.3,
	},

	listContent: {
		paddingBottom: 120,
	},

	card: {
		backgroundColor: '#5A5A42',
		borderRadius: 26,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1.5,
		borderColor: 'rgba(219,219,195,0.18)',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 8,
		},
		shadowOpacity: 0.22,
		shadowRadius: 16,
		elevation: 8,
	},

	cardPressed: {
		backgroundColor: '#70705A',
		borderColor: '#FFFFE3',
		transform: [{ scale: 0.985 }],
	},

	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	score: {
		fontSize: 42,
		fontWeight: '800',
		color: '#FFFFE3',
		lineHeight: 46,
	},

	label: {
		fontSize: 13,
		color: 'rgba(219,219,195,0.7)',
		marginTop: 2,
	},

	ratingContainer: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 999,
		backgroundColor: 'rgba(255,255,227,0.08)',
		borderWidth: 1,
		borderColor: 'rgba(255,255,227,0.12)',
	},

	rating: {
		fontSize: 14,
		fontWeight: '700',
		color: '#FFFFE3',
	},

	divider: {
		height: 1,
		backgroundColor: 'rgba(219,219,195,0.12)',
		marginVertical: 18,
	},

	bottomRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	rightInfo: {
		alignItems: 'flex-end',
	},

	infoLabel: {
		fontSize: 12,
		color: 'rgba(219,219,195,0.6)',
		marginBottom: 4,
	},

	infoValue: {
		fontSize: 14,
		fontWeight: '600',
		color: '#FFFFE3',
	},

	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		transform: [{ translateY: -80 }],
	},

	emptyCard: {
		width: '100%',
		backgroundColor: '#5A5A42',
		borderRadius: 28,
		paddingVertical: 36,
		paddingHorizontal: 24,
		borderWidth: 1.5,
		borderColor: 'rgba(219,219,195,0.18)',
		alignItems: 'center',
	},

	emptyTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 12,
		textAlign: 'center',
	},

	emptyText: {
		fontSize: 15,
		color: 'rgba(219,219,195,0.75)',
		textAlign: 'center',
		lineHeight: 24,
	},
});
