import {
	StyleSheet,
	Text,
	View,
	Image,
	Pressable,
	Modal,
	TextInput,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
	userData: {
		name: string;
		email: string;
		mobile: string;
	};
};

const Profile = ({ userData }: Props) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [name, setName] = useState(userData.name);
	const [email, setEmail] = useState(userData.email);
	const [mobile, setMobile] = useState(userData.mobile);
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.heading}>Profile</Text>
			<Image
				source={require('@/assets/images/user.jpg')}
				style={styles.profileImage}
			/>
			<View style={styles.infoCard}>
				<Text style={styles.label}>Name</Text>
				<Text style={styles.value}>{name}</Text>
				<Text style={styles.label}>Email</Text>
				<Text style={styles.value}>{email}</Text>
				<Text style={styles.label}>Mobile</Text>
				<Text style={styles.value}>{mobile}</Text>
			</View>
			<Pressable
				style={({ pressed }) => [
					styles.editButton,
					pressed && styles.pressedButton,
				]}
				onPress={() => setModalVisible(true)}>
				<Text style={styles.editButtonText}>Edit</Text>
			</Pressable>
			<Modal
				transparent
				visible={modalVisible}
				animationType='fade'>
				<KeyboardAvoidingView
					style={styles.overlay}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
					<View style={styles.modalBox}>
						<Text style={styles.modalTitle}>Edit Profile</Text>
						<TextInput
							style={styles.input}
							placeholder='Name'
							placeholderTextColor='#8B6F63'
							value={name}
							onChangeText={setName}
						/>
						<TextInput
							style={styles.input}
							placeholder='Email'
							placeholderTextColor='#8B6F63'
							value={email}
							onChangeText={setEmail}
						/>
						<TextInput
							style={styles.input}
							placeholder='Mobile'
							placeholderTextColor='#8B6F63'
							value={mobile}
							onChangeText={setMobile}
						/>
						<Pressable
							style={({ pressed }) => [
								styles.saveButton,
								pressed && styles.pressedButton,
							]}
							onPress={() => setModalVisible(false)}>
							<Text style={styles.saveButtonText}>Save</Text>
						</Pressable>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</SafeAreaView>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ECE7BE',
		paddingHorizontal: 18,
		alignItems: 'center',
	},

	heading: {
		color: '#0B0B0B',
		fontSize: 26,
		fontWeight: '700',
		marginTop: 14,
		marginBottom: 20,
	},

	profileImage: {
		width: 140,
		height: 140,
		borderRadius: 70,
		marginBottom: 22,
		borderWidth: 3,
		borderColor: '#0B0B0B',
	},

	infoCard: {
		width: '100%',
		backgroundColor: '#F5F1D8',
		borderRadius: 22,
		padding: 18,
		borderWidth: 1,
		borderColor: '#E4DEC3',
		marginBottom: 22,
	},

	label: {
		color: '#6E6A5E',
		fontSize: 13,
		marginBottom: 4,
	},

	value: {
		color: '#0B0B0B',
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 14,
	},

	editButton: {
		backgroundColor: '#0B0B0B',
		width: '100%',
		paddingVertical: 14,
		borderRadius: 16,
		alignItems: 'center',
	},

	editButtonText: {
		color: '#F5F1D8',
		fontSize: 15,
		fontWeight: '700',
	},

	pressedButton: {
		opacity: 0.82,
		transform: [{ scale: 0.97 }],
	},

	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.12)',
		justifyContent: 'center',
		paddingHorizontal: 20,
	},

	modalBox: {
		backgroundColor: '#F5F1D8',
		borderRadius: 24,
		padding: 20,
		borderWidth: 1,
		borderColor: '#E4DEC3',
	},

	modalTitle: {
		color: '#0B0B0B',
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 18,
		textAlign: 'center',
	},

	input: {
		backgroundColor: '#EFE9CC',
		height: 50,
		borderRadius: 14,
		paddingHorizontal: 16,
		color: '#0B0B0B',
		fontSize: 14,
		marginBottom: 14,
		borderWidth: 1,
		borderColor: '#E4DEC3',
	},

	saveButton: {
		backgroundColor: '#0B0B0B',
		paddingVertical: 14,
		borderRadius: 14,
		alignItems: 'center',
		marginTop: 4,
	},

	saveButtonText: {
		color: '#F5F1D8',
		fontSize: 15,
		fontWeight: '700',
	},
});
