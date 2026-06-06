import * as SecureStore from 'expo-secure-store';

export async function saveUserId(id: number) {
	await SecureStore.setItemAsync('userId', id.toString());
}

export async function getUserId() {
	return await SecureStore.getItemAsync('userId');
}

export async function logoutUser() {
	await SecureStore.deleteItemAsync('userId');
}
