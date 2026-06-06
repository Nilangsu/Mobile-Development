import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('safedrive.db');

export function initializeDatabase() {
	db.execSync(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			email TEXT UNIQUE NOT NULL,
			mobile TEXT NOT NULL,
			password TEXT NOT NULL,
			profileImage TEXT,
			createdAt TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS drives (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			userId INTEGER NOT NULL,
			startTime TEXT NOT NULL,
			endTime TEXT NOT NULL,
			duration INTEGER NOT NULL,
			score INTEGER NOT NULL,
			rating TEXT NOT NULL,
			createdAt TEXT NOT NULL
		);

		CREATE TABLE IF NOT EXISTS drive_events (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			driveId INTEGER NOT NULL,
			eventType TEXT NOT NULL,
			timestamp TEXT NOT NULL,
			severity TEXT
		);
	`);
	try {
		db.execSync(`
			ALTER TABLE users
			ADD COLUMN profileImage TEXT;
		`);
	} catch {}
}
