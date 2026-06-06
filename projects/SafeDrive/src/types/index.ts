export type Drive = {
	id?: number;
	userId: number;
	startTime: string;
	endTime: string;
	duration: number;
	score: number;
	rating: string;
	createdAt: string;
};

export type DriveEvent = {
	id?: number;
	driveId: number;
	eventType: string;
	timestamp: string;
	severity?: string;
};
export type DrivingEvent =
	| 'Harsh Braking'
	| 'Harsh Acceleration'
	| 'Sharp Turn'
	| 'Aggressive Steering'
	| 'Phone Handling';

export type DetectedEvent = {
	type: DrivingEvent;
	timestamp: string;
	severity: 'low' | 'medium' | 'high';
};
