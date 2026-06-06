import { db } from './database';
import { Drive, DriveEvent } from '@/types';
export function createDrive(drive: Drive) {
	const result = db.runSync(
		`
		INSERT INTO drives (
			userId,
			startTime,
			endTime,
			duration,
			score,
			rating,
			createdAt
		)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`,
		[
			drive.userId,
			drive.startTime,
			drive.endTime,
			drive.duration,
			drive.score,
			drive.rating,
			drive.createdAt,
		],
	);

	return result.lastInsertRowId;
}
export function getDriveById(id: number) {
	return db.getFirstSync<Drive>(
		`
		SELECT *
		FROM drives
		WHERE id = ?
	`,
		[id],
	);
}
export function getDrivesByUser(userId: number) {
	return db.getAllSync<Drive>(
		`
		SELECT *
		FROM drives
		WHERE userId = ?
		ORDER BY createdAt DESC
	`,
		[userId],
	);
}
export function createDriveEvent(event: DriveEvent) {
	const result = db.runSync(
		`
		INSERT INTO drive_events (
			driveId,
			eventType,
			timestamp,
			severity
		)
		VALUES (?, ?, ?, ?)
	`,
		[event.driveId, event.eventType, event.timestamp, event.severity ?? null],
	);

	return result.lastInsertRowId;
}
export function getDriveEvents(driveId: number) {
	return db.getAllSync<DriveEvent>(
		`
		SELECT *
		FROM drive_events
		WHERE driveId = ?
	`,
		[driveId],
	);
}
export function deleteDriveEvents(driveId: number) {
	db.runSync(
		`
		DELETE FROM drive_events
		WHERE driveId = ?
	`,
		[driveId],
	);
}
export function deleteDrive(id: number) {
	deleteDriveEvents(id);
	db.runSync(
		`
		DELETE FROM drives
		WHERE id = ?
	`,
		[id],
	);
}
export function getRecentDrives(limit: number = 5) {
	return db.getAllSync<Drive>(
		`
		SELECT *
		FROM drives
		ORDER BY createdAt DESC
		LIMIT ?
	`,
		[limit],
	);
}
export function deleteAllDrivesByUser(userId: number) {
	db.runSync(
		`
		DELETE FROM drive_events
		WHERE driveId IN (
			SELECT id
			FROM drives
			WHERE userId = ?
		)
	`,
		[userId],
	);

	db.runSync(
		`
		DELETE FROM drives
		WHERE userId = ?
	`,
		[userId],
	);
}
