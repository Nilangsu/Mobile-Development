import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
type Props = {
	visible: boolean;
	title?: string;
	message: string;
	onClose: () => void;
	showCancel?: boolean;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
};
const CustomAlert = ({
	visible,
	title = 'SafeDrive',
	message,
	onClose,
	showCancel = false,
	onConfirm,
	confirmText = 'OK',
	cancelText = 'Cancel',
}: Props) => {
	return (
		<Modal
			transparent
			visible={visible}
			animationType='fade'>
			<View style={styles.overlay}>
				<View style={styles.alertBox}>
					<Text style={styles.title}>{title}</Text>
					<Text style={styles.message}>{message}</Text>
					<View
						style={[styles.buttonRow, !showCancel && styles.singleButtonRow]}>
						{showCancel && (
							<TouchableOpacity
								style={styles.cancelButton}
								onPress={onClose}>
								<Text style={styles.cancelButtonText}>{cancelText}</Text>
							</TouchableOpacity>
						)}
						<TouchableOpacity
							style={styles.button}
							onPress={onConfirm ?? onClose}>
							<Text style={styles.buttonText}>{confirmText}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

export default CustomAlert;

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.65)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 24,
	},

	alertBox: {
		width: '100%',
		maxWidth: 380,
		backgroundColor: '#5A5A42',
		borderRadius: 28,
		paddingHorizontal: 24,
		paddingVertical: 28,

		borderWidth: 1.5,
		borderColor: 'rgba(219,219,195,0.18)',

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 12,
		},
		shadowOpacity: 0.3,
		shadowRadius: 20,
		elevation: 12,
	},

	title: {
		fontSize: 24,
		fontWeight: '700',
		color: '#FFFFE3',
		marginBottom: 12,
		textAlign: 'center',
	},

	message: {
		fontSize: 15,
		lineHeight: 24,
		color: 'rgba(219,219,195,0.85)',
		textAlign: 'center',
		marginBottom: 24,
	},

	buttonRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 12,
	},
	singleButtonRow: {
		justifyContent: 'center',
	},
	button: {
		minWidth: 120,
		height: 52,
		paddingHorizontal: 24,
		backgroundColor: '#DBDBC3',
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,255,227,0.2)',
	},

	buttonText: {
		color: '#4A4A32',
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.3,
	},

	cancelButton: {
		minWidth: 120,
		height: 52,
		paddingHorizontal: 24,
		backgroundColor: '#8A8A7B',
		borderRadius: 18,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: 'rgba(255,255,227,0.15)',
	},

	cancelButtonText: {
		color: '#FFFFE3',
		fontSize: 16,
		fontWeight: '700',
		letterSpacing: 0.3,
	},
});
