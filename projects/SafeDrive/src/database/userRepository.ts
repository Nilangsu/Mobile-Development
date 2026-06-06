import { db } from './database';
export type User = {
	id?: number;
	name: string;
	email: string;
	mobile: string;
	password: string;
	profileImage?: string;
	createdAt: string;
};
export function createUser(user: User) {
	const result = db.runSync(
		`
		INSERT INTO users (
			name,
			email,
			mobile,
			password,
			createdAt
		)
		VALUES (?, ?, ?, ?, ?)
	`,
		[user.name, user.email, user.mobile, user.password, user.createdAt],
	);
	return result.lastInsertRowId;
}
export function getUserByEmail(email: string) {
	return db.getFirstSync<User>(`SELECT *	FROM users	WHERE email = ?	`, [email]);
}
export function getUserById(id: number) {
	return db.getFirstSync<User>(`SELECT * FROM users WHERE id = ?`, [id]);
}

export function getAllUsers() {
	return db.getAllSync<User>(`SELECT * FROM users	ORDER BY id DESC`);
}
export function deleteUser(id: number) {
	db.runSync(`DELETE FROM users WHERE id = ?	`, [id]);
}
export function updateUserProfileImage(userId: number, profileImage: string) {
	db.runSync('UPDATE users SET profileImage = ? WHERE id = ?', [
		profileImage,
		userId,
	]);
}
