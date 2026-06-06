import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	useWindowDimensions,
} from 'react-native';
import { getUserId } from '@/storage/storage';
import { getDrivesByUser } from '@/database/driveRepository';
const DashboardScreen = () => {
	const [totalDrives, setTotalDrives] = useState(0);
	const [averageScore, setAverageScore] = useState(0);
	const [bestScore, setBestScore] = useState(0);
	const [recentDrive, setRecentDrive] = useState<any>(null);
	const { width } = useWindowDimensions();
	const isSmallPhone = width < 360;
	const isLargePhone = width >= 430;
	const isTablet = width >= 768;
	useFocusEffect(
		useCallback(() => {
			loadDashboard();
		}, []),
	);
	async function loadDashboard() {
		const userId = await getUserId();
		if (!userId) {
			setTotalDrives(0);
			setAverageScore(0);
			setBestScore(0);
			setRecentDrive(null);
			return;
		}
		const drives = getDrivesByUser(Number(userId));
		setTotalDrives(drives.length);
		if (drives.length === 0) {
			setAverageScore(0);
			setBestScore(0);
			setRecentDrive(null);
			return;
		}
		const totalScore = drives.reduce((sum, drive) => sum + drive.score, 0);
		setAverageScore(Math.round(totalScore / drives.length));
		setBestScore(Math.max(...drives.map((drive) => drive.score)));
		setRecentDrive(drives[0]);
	}

	const getScoreStatus = (score: number) => {
		if (score >= 90) return 'Excellent';
		if (score >= 75) return 'Good';
		if (score >= 60) return 'Average';
		return 'Needs Improvement';
	};

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={[
				styles.content,
				{
					paddingHorizontal: isTablet ? 40 : 20,
				},
			]}
			showsVerticalScrollIndicator={false}>
			<Text
				style={[
					styles.headerTitle,
					{
						fontSize: isTablet
							? 42
							: isLargePhone
								? 36
								: isSmallPhone
									? 28
									: 32,
					},
				]}>
				Driving Overview
			</Text>

			<View
				style={[
					styles.scoreCard,
					{
						height: isTablet ? 320 : 280,
					},
				]}>
				<View
					style={[
						styles.scoreCircle,
						{
							width: isTablet ? 190 : 160,
							height: isTablet ? 190 : 160,
							borderRadius: isTablet ? 95 : 80,
						},
					]}>
					<Text
						style={[
							styles.scoreNumber,
							{
								fontSize: isTablet ? 58 : 48,
							},
						]}>
						{averageScore}
					</Text>

					<Text style={styles.scoreLabel}>Safety Score</Text>
				</View>

				<View style={styles.statusBadge}>
					<Text style={styles.statusText}>{getScoreStatus(averageScore)}</Text>
				</View>
			</View>

			<View style={[styles.statsGrid, isTablet && styles.statsGridTablet]}>
				<View style={styles.statCard}>
					<Text style={styles.statTitle}>Total Drives</Text>
					<Text style={styles.statValue}>{totalDrives}</Text>
				</View>

				<View style={styles.statCard}>
					<Text style={styles.statTitle}>Best Score</Text>
					<Text style={styles.statValue}>{bestScore}</Text>
				</View>
			</View>

			<View style={styles.recentCard}>
				<Text style={styles.sectionTitle}>Recent Drive</Text>

				{recentDrive ? (
					<>
						<View style={styles.recentScoreRow}>
							<Text style={styles.recentScore}>{recentDrive.score}</Text>

							<View style={styles.ratingBadge}>
								<Text style={styles.ratingText}>{recentDrive.rating}</Text>
							</View>
						</View>

						<Text style={styles.recentDescription}>
							Your most recent trip performance and driving behavior analysis.
						</Text>
					</>
				) : (
					<Text style={styles.emptyText}>No drives recorded yet</Text>
				)}
			</View>

			<View style={styles.insightCard}>
				<Text style={styles.sectionTitle}>Quick Insight</Text>

				<Text style={styles.insightText}>
					Keep maintaining smooth acceleration, gentle braking, and reduced
					phone handling to improve your overall safety score.
				</Text>
			</View>
		</ScrollView>
	);
};

export default DashboardScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
	},

	content: {
		paddingTop: 20,
		paddingBottom: 140,
	},

	headerTitle: {
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 24,
		letterSpacing: 0.3,
	},

	scoreCard: {
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 32,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 18,
	},

	scoreCircle: {
		borderWidth: 8,
		borderColor: '#DBDBC3',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,227,0.04)',
	},

	scoreNumber: {
		fontWeight: '800',
		color: '#FFFFE3',
	},

	scoreLabel: {
		color: 'rgba(219,219,195,0.8)',
		fontSize: 15,
		fontWeight: '600',
		marginTop: 4,
	},

	statusBadge: {
		marginTop: 18,
		backgroundColor: 'rgba(219,219,195,0.12)',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	statusText: {
		color: '#DBDBC3',
		fontWeight: '700',
		fontSize: 13,
	},

	statsGrid: {
		flexDirection: 'row',
		gap: 14,
		marginBottom: 18,
	},

	statsGridTablet: {
		gap: 20,
	},

	statCard: {
		flex: 1,
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 24,
		padding: 22,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	statTitle: {
		color: 'rgba(219,219,195,0.7)',
		fontSize: 14,
		marginBottom: 12,
		fontWeight: '500',
	},

	statValue: {
		fontSize: 34,
		fontWeight: '700',
		color: '#FFFFE3',
	},

	recentCard: {
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 24,
		padding: 22,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
		marginBottom: 18,
	},

	sectionTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 18,
	},

	recentScoreRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 12,
	},

	recentScore: {
		fontSize: 40,
		fontWeight: '700',
		color: '#FFFFE3',
	},

	ratingBadge: {
		backgroundColor: 'rgba(219,219,195,0.12)',
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	ratingText: {
		color: '#DBDBC3',
		fontWeight: '700',
		fontSize: 13,
	},

	recentDescription: {
		color: 'rgba(219,219,195,0.75)',
		lineHeight: 22,
	},

	insightCard: {
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 24,
		padding: 22,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	insightText: {
		color: 'rgba(219,219,195,0.75)',
		lineHeight: 24,
		fontSize: 15,
	},

	emptyText: {
		color: 'rgba(219,219,195,0.6)',
		fontSize: 14,
	},
});
