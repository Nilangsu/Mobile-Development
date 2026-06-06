import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getDriveById, getDriveEvents } from '@/database/driveRepository';

const SummaryScreen = () => {
	const { driveId } = useLocalSearchParams();
	const [drive, setDrive] = useState<any>(null);
	const [events, setEvents] = useState<any[]>([]);
	const { width } = useWindowDimensions();
	const isSmallPhone = width < 360;
	const isLargePhone = width >= 430;
	const isTablet = width >= 768;

	useEffect(() => {
		if (!driveId) return;
		const driveData = getDriveById(Number(driveId));
		const eventData = getDriveEvents(Number(driveId));
		setDrive(driveData);
		setEvents(eventData);
	}, [driveId]);

	if (!drive) {
		return (
			<View style={styles.loadingContainer}>
				<Text style={styles.title}>Drive Summary</Text>
			</View>
		);
	}

	const harshBrakingCount = events.filter(
		(event) => event.eventType === 'Harsh Braking',
	).length;
	const harshAccelerationCount = events.filter(
		(event) => event.eventType === 'Harsh Acceleration',
	).length;
	const sharpTurnCount = events.filter(
		(event) => event.eventType === 'Sharp Turn',
	).length;
	const aggressiveSteeringCount = events.filter(
		(event) => event.eventType === 'Aggressive Steering',
	).length;
	const phoneHandlingCount = events.filter(
		(event) => event.eventType === 'Phone Handling',
	).length;

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
				Drive Summary
			</Text>

			<View style={styles.scoreCard}>
				<View
					style={[
						styles.scoreCircle,
						{
							width: isTablet ? 220 : 170,
							height: isTablet ? 220 : 170,
							borderRadius: isTablet ? 110 : 85,
						},
					]}>
					<Text
						style={[
							styles.score,
							{
								fontSize: isTablet ? 72 : 60,
							},
						]}>
						{drive.score}
					</Text>

					<Text style={styles.scoreLabel}>Safety Score</Text>
				</View>

				<View style={styles.ratingBadge}>
					<Text style={styles.rating}>{drive.rating}</Text>
				</View>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Drive Information</Text>

				<Text style={styles.infoText}>Duration</Text>

				<Text style={styles.dateText}>{drive.duration} seconds</Text>

				<Text style={styles.infoText}>Start Time</Text>

				<Text style={styles.dateText}>
					{new Date(drive.startTime).toLocaleString()}
				</Text>

				<Text style={styles.infoText}>End Time</Text>

				<Text style={styles.dateText}>
					{new Date(drive.endTime).toLocaleString()}
				</Text>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Event Summary</Text>

				<View style={styles.eventRow}>
					<Text style={styles.eventLabel}>Harsh Braking</Text>
					<Text style={styles.eventCount}>{harshBrakingCount}</Text>
				</View>

				<View style={styles.eventRow}>
					<Text style={styles.eventLabel}>Harsh Acceleration</Text>
					<Text style={styles.eventCount}>{harshAccelerationCount}</Text>
				</View>

				<View style={styles.eventRow}>
					<Text style={styles.eventLabel}>Sharp Turn</Text>
					<Text style={styles.eventCount}>{sharpTurnCount}</Text>
				</View>

				<View style={styles.eventRow}>
					<Text style={styles.eventLabel}>Aggressive Steering</Text>
					<Text style={styles.eventCount}>{aggressiveSteeringCount}</Text>
				</View>

				<View style={styles.eventRow}>
					<Text style={styles.eventLabel}>Phone Handling</Text>
					<Text style={styles.eventCount}>{phoneHandlingCount}</Text>
				</View>
			</View>

			<View style={styles.card}>
				<Text style={styles.cardTitle}>Detected Events</Text>

				{events.length === 0 ? (
					<Text style={styles.emptyText}>No events detected</Text>
				) : (
					events.map((event, index) => (
						<View
							key={index}
							style={styles.eventItem}>
							<Text style={styles.eventName}>{event.eventType}</Text>

							<Text style={styles.eventTime}>
								{new Date(event.timestamp).toLocaleTimeString()}
							</Text>
						</View>
					))
				)}
			</View>
		</ScrollView>
	);
};

export default SummaryScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#4A4A32',
	},

	loadingContainer: {
		flex: 1,
		backgroundColor: '#4A4A32',
		padding: 20,
	},

	content: {
		paddingTop: 20,
		paddingBottom: 120,
	},

	title: {
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 24,
		letterSpacing: 0.3,
	},

	scoreCard: {
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 32,
		paddingVertical: 30,
		alignItems: 'center',
		marginBottom: 18,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	scoreCircle: {
		borderWidth: 8,
		borderColor: '#DBDBC3',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,227,0.04)',
	},

	score: {
		fontWeight: '800',
		color: '#FFFFE3',
	},

	scoreLabel: {
		fontSize: 15,
		fontWeight: '600',
		color: 'rgba(219,219,195,0.75)',
		marginTop: 4,
	},

	ratingBadge: {
		marginTop: 18,
		backgroundColor: 'rgba(219,219,195,0.12)',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	rating: {
		color: '#DBDBC3',
		fontWeight: '700',
		fontSize: 14,
	},

	card: {
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 24,
		padding: 20,
		marginBottom: 16,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	cardTitle: {
		fontSize: 18,
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 18,
	},

	infoText: {
		color: '#FFFFE3',
		fontSize: 15,
		fontWeight: '600',
		marginTop: 10,
	},

	dateText: {
		color: 'rgba(219,219,195,0.75)',
		marginTop: 4,
		lineHeight: 22,
	},

	eventRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: 'rgba(219,219,195,0.08)',
	},

	eventLabel: {
		color: '#FFFFE3',
		fontSize: 15,
		fontWeight: '500',
	},

	eventCount: {
		color: '#DBDBC3',
		fontWeight: '700',
		fontSize: 15,
	},

	eventItem: {
		backgroundColor: 'rgba(255,255,227,0.05)',
		borderRadius: 16,
		padding: 14,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.08)',
	},

	eventName: {
		color: '#FFFFE3',
		fontWeight: '600',
		fontSize: 14,
	},

	eventTime: {
		color: 'rgba(219,219,195,0.6)',
		fontSize: 12,
		marginTop: 4,
	},

	emptyText: {
		color: 'rgba(219,219,195,0.6)',
		textAlign: 'center',
	},
});
