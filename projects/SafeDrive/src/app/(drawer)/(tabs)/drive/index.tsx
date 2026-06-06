import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ScrollView,
	useWindowDimensions,
} from 'react-native';

import { useAccelerometer } from '@/hooks/use-accelerometer';
import { useGyroscope } from '@/hooks/use-gyroscope';
import { usePhoneHandling } from '@/hooks/use-phone-handling';
import { getUserId } from '@/storage/storage';
import { createDrive, createDriveEvent } from '@/database/driveRepository';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';

type EventType = {
	type: string;
	timestamp: string;
};

const DriveScreen = () => {
	const accelerometer = useAccelerometer();
	const gyroscope = useGyroscope();
	const phoneHandling = usePhoneHandling();
	const [isDriving, setIsDriving] = useState(false);
	const [score, setScore] = useState(100);
	const [events, setEvents] = useState<EventType[]>([]);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const { width } = useWindowDimensions();
	const isSmallPhone = width < 360;
	const isLargePhone = width >= 430;
	const isTablet = width >= 768;
	const lastBrakeRef = useRef(0);
	const lastAccelerationRef = useRef(0);
	const lastTurnRef = useRef(0);
	const lastPhoneRef = useRef(0);

	useFocusEffect(
		useCallback(() => {
			setIsDriving(false);
			setScore(100);
			setEvents([]);
			setStartTime(null);
			lastBrakeRef.current = 0;
			lastAccelerationRef.current = 0;
			lastTurnRef.current = 0;
			lastPhoneRef.current = 0;
		}, []),
	);

	function addEvent(type: string, penalty: number) {
		setEvents((prev) => [
			...prev,
			{
				type,
				timestamp: new Date().toISOString(),
			},
		]);
		setScore((prev) => Math.max(0, prev - penalty));
	}

	function startDrive() {
		setIsDriving(true);
		setScore(100);
		setEvents([]);
		setStartTime(new Date());
		phoneHandlingCounter.current = 0;
		lastPhoneRef.current = 0;
	}
	async function endDrive() {
		setIsDriving(false);
		if (!startTime) return;
		const userId = await getUserId();
		if (!userId) return;
		const endTime = new Date();
		const duration = Math.floor(
			(endTime.getTime() - startTime.getTime()) / 1000,
		);
		const driveId = createDrive({
			userId: Number(userId),
			startTime: startTime.toISOString(),
			endTime: endTime.toISOString(),
			duration,
			score,
			rating: getRating(score),
			createdAt: endTime.toISOString(),
		});

		events.forEach((event) => {
			createDriveEvent({
				driveId: Number(driveId),
				eventType: event.type,
				timestamp: event.timestamp,
			});
		});

		router.push({
			pathname: '/(drawer)/(tabs)/drive/summary',
			params: {
				driveId: String(driveId),
			},
		});
	}

	function getRating(score: number) {
		if (score >= 90) return 'Excellent';
		if (score >= 75) return 'Good';
		if (score >= 60) return 'Fair';
		return 'Poor';
	}

	useEffect(() => {
		if (!isDriving) return;
		const now = Date.now();
		if (accelerometer.y < -2.5 && now - lastBrakeRef.current > 3000) {
			lastBrakeRef.current = now;
			addEvent('Harsh Braking', 5);
		}
		if (accelerometer.y > 2.5 && now - lastAccelerationRef.current > 3000) {
			lastAccelerationRef.current = now;
			addEvent('Harsh Acceleration', 5);
		}
	}, [accelerometer.y, isDriving]);

	useEffect(() => {
		if (!isDriving) return;
		const now = Date.now();
		if (Math.abs(gyroscope.z) > 3 && now - lastTurnRef.current > 3000) {
			lastTurnRef.current = now;
			addEvent('Aggressive Steering', 5);
		} else if (Math.abs(gyroscope.z) > 2 && now - lastTurnRef.current > 3000) {
			lastTurnRef.current = now;
			addEvent('Sharp Turn', 3);
		}
	}, [gyroscope.z, isDriving]);

	const phoneHandlingCounter = useRef(0);

	useEffect(() => {
		if (!isDriving) return;
		let detectionScore = 0;
		if (phoneHandling.rotationMagnitude > 3) {
			detectionScore++;
		}
		if (phoneHandling.rotationRateMagnitude > 6) {
			detectionScore++;
		}
		if (detectionScore >= 2) {
			phoneHandlingCounter.current++;
		} else {
			phoneHandlingCounter.current = 0;
		}
		const now = Date.now();
		if (
			phoneHandlingCounter.current >= 8 &&
			now - lastPhoneRef.current > 30000
		) {
			lastPhoneRef.current = now;
			phoneHandlingCounter.current = 0;
			addEvent('Phone Handling', 10);
		}
	}, [
		phoneHandling.rotationMagnitude,
		phoneHandling.rotationRateMagnitude,
		isDriving,
	]);
	const getScoreStatus = () => {
		if (score >= 90) return 'Excellent';
		if (score >= 75) return 'Good';
		if (score >= 60) return 'Fair';
		return 'Poor';
	};

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
				Live Drive
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
							styles.scoreNumber,
							{
								fontSize: isTablet ? 70 : 56,
							},
						]}>
						{score}
					</Text>

					<Text style={styles.scoreLabel}>Safety Score</Text>
				</View>

				<View style={styles.scoreBadge}>
					<Text style={styles.scoreBadgeText}>{getScoreStatus()}</Text>
				</View>
			</View>

			<View style={styles.statusCard}>
				<Text style={styles.statusTitle}>Drive Status</Text>

				<View
					style={[
						styles.statusBadge,
						{
							backgroundColor: isDriving
								? 'rgba(219,219,195,0.15)'
								: 'rgba(138,138,123,0.15)',
						},
					]}>
					<Text
						style={[
							styles.status,
							{
								color: '#FFFFE3',
							},
						]}>
						{isDriving ? 'Currently Driving' : 'Ready To Drive'}
					</Text>
				</View>
			</View>

			<Pressable
				style={({ pressed }) => [
					styles.button,
					isDriving ? styles.endButton : styles.startButton,
					pressed && styles.buttonPressed,
				]}
				onPress={isDriving ? endDrive : startDrive}>
				<Text style={styles.buttonText}>
					{isDriving ? 'End Drive' : 'Start Drive'}
				</Text>
			</Pressable>

			<View style={styles.eventsCard}>
				<Text style={styles.eventsTitle}>Detected Events</Text>

				<Text style={styles.eventCount}>{events.length} Events</Text>

				{events.length === 0 ? (
					<Text style={styles.emptyText}>No driving events detected</Text>
				) : (
					<>
						{events
							.slice()
							.reverse()
							.map((event, index) => (
								<View
									key={index}
									style={styles.eventItem}>
									<Text style={styles.eventText}>{event.type}</Text>
								</View>
							))}
					</>
				)}
			</View>
		</ScrollView>
	);
};

export default DriveScreen;

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
		textAlign: 'center',
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

	scoreNumber: {
		fontWeight: '800',
		color: '#FFFFE3',
	},

	scoreLabel: {
		fontSize: 15,
		fontWeight: '600',
		color: 'rgba(219,219,195,0.75)',
		marginTop: 4,
	},

	scoreBadge: {
		marginTop: 18,
		backgroundColor: 'rgba(219,219,195,0.12)',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	scoreBadgeText: {
		color: '#DBDBC3',
		fontWeight: '700',
		fontSize: 13,
	},

	statusCard: {
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 24,
		padding: 20,
		alignItems: 'center',
		marginBottom: 20,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	statusTitle: {
		fontSize: 14,
		color: 'rgba(219,219,195,0.7)',
		marginBottom: 10,
		fontWeight: '500',
	},

	statusBadge: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 999,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	status: {
		fontSize: 16,
		fontWeight: '700',
	},

	button: {
		height: 60,
		borderRadius: 24,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.3,
		shadowRadius: 18,
		elevation: 10,
	},

	startButton: {
		backgroundColor: '#DBDBC3',
		borderColor: 'rgba(255,255,227,0.15)',
	},

	endButton: {
		backgroundColor: '#8A8A7B',
		borderColor: 'rgba(255,255,227,0.15)',
	},

	buttonPressed: {
		transform: [{ scale: 0.97 }],
		opacity: 0.9,
	},

	buttonText: {
		color: '#4A4A32',
		fontSize: 17,
		fontWeight: '700',
		letterSpacing: 0.3,
	},

	eventsCard: {
		flex: 1,
		backgroundColor: 'rgba(138,138,123,0.12)',
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.15)',
	},

	eventsTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#FFFFE3',
	},

	eventCount: {
		color: 'rgba(219,219,195,0.65)',
		marginTop: 4,
		marginBottom: 18,
	},

	emptyText: {
		color: 'rgba(219,219,195,0.55)',
		textAlign: 'center',
		marginTop: 24,
		fontSize: 14,
	},

	eventItem: {
		backgroundColor: 'rgba(255,255,227,0.05)',
		padding: 14,
		borderRadius: 16,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: 'rgba(219,219,195,0.08)',
	},

	eventText: {
		color: '#FFFFE3',
		fontWeight: '600',
		fontSize: 14,
	},
});
