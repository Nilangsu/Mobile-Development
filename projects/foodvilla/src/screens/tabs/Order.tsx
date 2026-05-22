import {
	StyleSheet,
	Text,
	View,
	Image,
	useWindowDimensions,
	FlatList,
	Pressable,
	Modal,
	TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { dummyData, Menu } from '../../../data/dummydata';
import {
	SafeAreaView,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { OrderItems } from '@/navigation/tabNavigation';

type Props = {
	cartItems: OrderItems[];
	setCartItems: React.Dispatch<React.SetStateAction<OrderItems[]>>;
};
const order = ({ cartItems, setCartItems }: Props) => {
	const originalTotalPrice = cartItems.reduce(
		(accum, item) => accum + item.price * item.quantity,
		0,
	);
	const [couponPercent, setCouponPercent] = useState<number>(0);
	const discount = (originalTotalPrice * couponPercent) / 100;
	const discountedTotalPrice = originalTotalPrice - discount;
	const [couponModal, setCouponModal] = useState(false);
	const [addressModal, setAddressModal] = useState(false);
	const [houseNo, setHouseNo] = useState('');
	const [streetName, setStreetName] = useState('');
	const [locality, setLocality] = useState('');
	const [addressType, setAddressType] = useState<'Home' | 'Work'>('Home');
	const [savedAddress, setSavedAddress] = useState<null | {
		houseNo: string;
		streetName: string;
		locality: string;
		addressType: string;
	}>(null);
	const [orderModal, setOrderModal] = useState(false);
	const [billModal, setBillModal] = useState(false);
	const [selectedCoupon, setSelectedCoupon] = useState('');
	const { width } = useWindowDimensions();
	const isTablet = width > 768;
	const isSmallPhone = width < 380;
	const responsive = responsiveStyles(isTablet, isSmallPhone);
	const insets = useSafeAreaInsets();
	const [addressWarningModal, setAddressWarningModal] = useState(false);
	function applyCoupon(percent: number) {
		setCouponPercent(percent);
		setCouponModal(false);
		setSelectedCoupon(`${percent}% OFF`);
	}

	function findImage(item: OrderItems) {
		const food = dummyData.find((food) => food.id === item.id);
		return food?.image;
	}
	function modifyQuantity(operation: string, item: OrderItems) {
		if (operation === '-') {
			if (item.quantity === 1) {
				setCartItems(cartItems.filter((food) => food.id !== item.id));
			} else {
				const updatedCart = cartItems.map((food) => {
					if (food.id === item.id) {
						return {
							...food,
							quantity: food.quantity - 1,
						};
					}
					return food;
				});
				setCartItems(updatedCart);
			}
		} else if (operation === '+') {
			const updatedCart = cartItems.map((food) => {
				if (food.id === item.id) {
					return {
						...food,
						quantity: food.quantity + 1,
					};
				}
				return food;
			});
			setCartItems(updatedCart);
		}
	}
	function saveAddress() {
		const newAddress = {
			houseNo,
			streetName,
			locality,
			addressType,
		};
		setSavedAddress(newAddress);
		setAddressModal(false);
	}
	function calculateDeliveryTime() {
		let maxTime = 0;
		cartItems.forEach((item) => {
			const food = dummyData.find((food) => food.id === item.id);
			if (food) {
				const totalTime = food.cookTimeMinutes + 30;
				if (totalTime > maxTime) {
					maxTime = totalTime;
				}
			}
		});
		return maxTime;
	}
	useEffect(() => {
		if (couponPercent === 5 && originalTotalPrice < 200) {
			setCouponPercent(0);
			setSelectedCoupon('');
		}
		if (couponPercent === 10 && originalTotalPrice < 500) {
			setCouponPercent(0);
			setSelectedCoupon('');
		}
		if (couponPercent === 15 && originalTotalPrice < 1000) {
			setCouponPercent(0);
			setSelectedCoupon('');
		}
	}, [originalTotalPrice, couponPercent]);
	return (
		<SafeAreaView style={responsive.container}>
			<FlatList
				data={cartItems}
				ListHeaderComponent={
					<Text style={responsive.cartHeading}>Your Cart</Text>
				}
				ListFooterComponent={
					cartItems.length > 0 ? (
						<>
							<Pressable
								style={({ pressed }) => [
									responsive.selectCouponButton,
									pressed && responsive.pressedButton,
								]}
								onPress={() => setCouponModal(true)}>
								<Text style={responsive.selectCouponText}>Select Coupon</Text>
							</Pressable>
							<Modal
								transparent
								visible={couponModal}
								animationType='fade'>
								<View style={responsive.overlay}>
									<View style={responsive.modalBox}>
										<Text style={responsive.modalTitle}>Available Coupons</Text>
										<Pressable
											disabled={originalTotalPrice < 200}
											style={[
												responsive.couponButton,
												originalTotalPrice < 200 && responsive.disabledCoupon,
											]}
											onPress={() => applyCoupon(5)}>
											<Text style={responsive.couponText}>
												5% OFF above ₹200
											</Text>
										</Pressable>
										<Pressable
											disabled={originalTotalPrice < 500}
											style={[
												responsive.couponButton,
												originalTotalPrice < 500 && responsive.disabledCoupon,
											]}
											onPress={() => applyCoupon(10)}>
											<Text style={responsive.couponText}>
												10% OFF above ₹500
											</Text>
										</Pressable>
										<Pressable
											disabled={originalTotalPrice < 1000}
											style={[
												responsive.couponButton,
												originalTotalPrice < 1000 && responsive.disabledCoupon,
											]}
											onPress={() => applyCoupon(15)}>
											<Text style={responsive.couponText}>
												15% OFF above ₹1000
											</Text>
										</Pressable>
										<Pressable
											style={responsive.closeButton}
											onPress={() => setCouponModal(false)}>
											<Text style={responsive.closeText}>Close</Text>
										</Pressable>
									</View>
								</View>
							</Modal>
							<View style={responsive.addressSection}>
								{savedAddress ? (
									<View style={responsive.savedAddressContainer}>
										<View>
											<Text style={responsive.deliverText}>Deliver To</Text>
											<Text style={responsive.addressText}>
												{savedAddress.houseNo}, {savedAddress.streetName},{' '}
												{savedAddress.locality}
											</Text>
											<Text style={responsive.addressTypeText}>
												{savedAddress.addressType}
											</Text>
										</View>
										<Pressable
											style={({ pressed }) => [
												responsive.editButtonContainer,
												pressed && responsive.pressedButton,
											]}
											onPress={() => setAddressModal(true)}>
											<Text style={responsive.editButtonLabel}>Edit</Text>

											<Text style={responsive.editButtonIcon}>✏️</Text>
										</Pressable>
									</View>
								) : (
									<Pressable
										style={({ pressed }) => [
											responsive.addAddressButton,
											pressed && responsive.pressedButton,
										]}
										onPress={() => setAddressModal(true)}>
										<Text style={responsive.addAddressText}>Add Address</Text>
									</Pressable>
								)}
							</View>
							<Modal
								transparent
								visible={addressModal}
								animationType='fade'>
								<View style={responsive.overlay}>
									<View style={responsive.modalBox}>
										<Text style={responsive.modalTitle}>Delivery Address</Text>

										<TextInput
											placeholder='House / Flat No.'
											placeholderTextColor='#8B6F63'
											style={responsive.input}
											value={houseNo}
											onChangeText={setHouseNo}
										/>

										<TextInput
											placeholder='Street Name'
											placeholderTextColor='#8B6F63'
											style={responsive.input}
											value={streetName}
											onChangeText={setStreetName}
										/>

										<TextInput
											placeholder='Locality'
											placeholderTextColor='#8B6F63'
											style={responsive.input}
											value={locality}
											onChangeText={setLocality}
										/>

										<View style={responsive.addressTypeContainer}>
											<Pressable
												style={[
													responsive.addressTypeButton,
													addressType === 'Home' &&
														responsive.selectedAddressType,
												]}
												onPress={() => setAddressType('Home')}>
												<Text
													style={[
														responsive.addressTypeButtonText,
														addressType === 'Home'
															? responsive.selectedAddressTypeText
															: responsive.unselectedAddressTypeText,
													]}>
													Home
												</Text>
											</Pressable>

											<Pressable
												style={[
													responsive.addressTypeButton,
													addressType === 'Work' &&
														responsive.selectedAddressType,
												]}
												onPress={() => setAddressType('Work')}>
												<Text
													style={[
														responsive.addressTypeButtonText,
														addressType === 'Work'
															? responsive.selectedAddressTypeText
															: responsive.unselectedAddressTypeText,
													]}>
													Work
												</Text>
											</Pressable>
										</View>

										<Pressable
											style={responsive.saveButton}
											onPress={saveAddress}>
											<Text style={responsive.saveButtonText}>
												Save Address
											</Text>
										</Pressable>

										<Pressable
											style={responsive.closeButton}
											onPress={() => setAddressModal(false)}>
											<Text style={responsive.closeText}>Cancel</Text>
										</Pressable>
									</View>
								</View>
							</Modal>
							<Text style={responsive.deliveryText}>
								Delivers in: {calculateDeliveryTime()} mins
							</Text>
							<Pressable
								style={({ pressed }) => [
									responsive.totalBillButton,
									pressed && responsive.pressedButton,
								]}
								onPress={() => setBillModal(true)}>
								<Text style={responsive.totalBillText}>Total Bill</Text>
								<View style={responsive.totalBillPriceContainer}>
									{discount > 0 && (
										<Text style={responsive.totalBillOriginalPrice}>
											₹{originalTotalPrice}
										</Text>
									)}
									<Text style={responsive.totalBillFinalPrice}>
										₹{discount > 0 ? discountedTotalPrice : originalTotalPrice}
									</Text>
								</View>
							</Pressable>
							<Modal
								transparent
								visible={billModal}
								animationType='fade'>
								<View style={responsive.overlay}>
									<View style={responsive.billModalBox}>
										<Text style={responsive.billHeading}>Order Summary</Text>
										<FlatList
											data={cartItems}
											scrollEnabled={false}
											keyExtractor={(item) => item.id.toString()}
											renderItem={({ item }) => (
												<View style={responsive.billItemRow}>
													<Text style={responsive.billItemName}>
														{item.name} x{item.quantity}
													</Text>
													<Text style={responsive.billItemPrice}>
														₹{item.price * item.quantity}
													</Text>
												</View>
											)}
										/>
										<View style={responsive.billDivider} />
										<View style={responsive.billRow}>
											<Text style={responsive.billLabel}>Original Total</Text>
											<Text style={responsive.billValue}>
												₹{originalTotalPrice}
											</Text>
										</View>
										<View style={responsive.billRow}>
											<Text style={responsive.billLabel}>Coupon</Text>
											<Text style={responsive.billValue}>
												{selectedCoupon || 'No Coupon'}
											</Text>
										</View>
										<View style={responsive.billRow}>
											<Text style={responsive.billLabel}>Discount</Text>
											<Text style={responsive.discountText}>-₹{discount}</Text>
										</View>
										<View style={responsive.billDivider} />
										<View style={responsive.billRow}>
											<Text style={responsive.finalTotalLabel}>
												Final Total
											</Text>
											<Text style={responsive.finalTotalValue}>
												₹{discountedTotalPrice}
											</Text>
										</View>
										<Pressable
											style={responsive.closeBillButton}
											onPress={() => setBillModal(false)}>
											<Text style={responsive.closeBillText}>Close</Text>
										</Pressable>
									</View>
								</View>
							</Modal>
							<Pressable
								style={({ pressed }) => [
									responsive.placeOrderButton,
									pressed && responsive.pressedButton,
								]}
								onPress={() => {
									if (!savedAddress) {
										setAddressWarningModal(true);
										return;
									}
									setOrderModal(true);
								}}>
								<Text style={responsive.placeOrderText}>Place Order</Text>
								<Text style={responsive.placeOrderPrice}>
									₹{discountedTotalPrice}
								</Text>
							</Pressable>
							<Modal
								transparent
								visible={addressWarningModal}
								animationType='fade'>
								<View style={responsive.overlay}>
									<View style={responsive.addressWarningBox}>
										<Text style={responsive.addressWarningIcon}>📍</Text>
										<Text style={responsive.addressWarningTitle}>
											Address Required
										</Text>
										<Text style={responsive.addressWarningMessage}>
											Please add your delivery address before placing your order
										</Text>
										<Pressable
											style={({ pressed }) => [
												responsive.addressWarningButton,
												pressed && responsive.pressedButton,
											]}
											onPress={() => {
												setAddressWarningModal(false);
												setAddressModal(true);
											}}>
											<Text style={responsive.addressWarningButtonText}>
												Add Address
											</Text>
										</Pressable>
										<Pressable
											style={({ pressed }) => [
												responsive.addressWarningCancel,
												pressed && responsive.pressedButton,
											]}
											onPress={() => setAddressWarningModal(false)}>
											<Text style={responsive.addressWarningCancelText}>
												Cancel
											</Text>
										</Pressable>
									</View>
								</View>
							</Modal>
							<Modal
								transparent
								visible={orderModal}
								animationType='fade'>
								<View style={responsive.overlay}>
									<View style={responsive.orderModalBox}>
										<Text style={responsive.orderSuccessText}>Yay! 🎉</Text>
										<Text style={responsive.orderPlacedText}>
											Order Placed Successfully
										</Text>
										<Text style={responsive.deliveryTimeText}>
											Estimated Delivery
										</Text>
										<Text style={responsive.deliveryMinuteText}>
											{calculateDeliveryTime()} mins
										</Text>
										<Pressable
											style={({ pressed }) => [
												responsive.doneButton,
												pressed && responsive.pressedButton,
											]}
											onPress={() => {
												setOrderModal(false);
												setCartItems([]);
											}}>
											<Text style={responsive.doneButtonText}>Done</Text>
										</Pressable>
									</View>
								</View>
							</Modal>
						</>
					) : null
				}
				ListEmptyComponent={
					<View style={responsive.emptyContainer}>
						<Text style={responsive.emptyTitle}>Your cart is empty</Text>

						<Text style={responsive.emptySubTitle}>
							Add delicious meals from the menu and they’ll appear here
						</Text>
					</View>
				}
				contentContainerStyle={[
					responsive.listContainer,
					{
						flexGrow: 1,
						paddingBottom:
							cartItems.length > 0 ? insets.bottom + 120 : insets.bottom,
					},
				]}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View style={responsive.cartCard}>
						<Image
							source={findImage(item)}
							style={responsive.cartImage}
						/>
						<View style={responsive.cartContent}>
							<View style={responsive.cartTopRow}>
								<Text style={responsive.cartFoodName}>{item.name}</Text>
								<Text style={responsive.priceText}>
									₹{item.price * item.quantity}
								</Text>
							</View>
							<View style={responsive.quantityContainer}>
								<Pressable
									style={({ pressed }) => [
										responsive.quantityButton,
										pressed && responsive.pressedButton,
									]}
									onPress={() => modifyQuantity('-', item)}>
									<Text style={responsive.quantityButtonText}>-</Text>
								</Pressable>
								<Text style={responsive.quantityText}>{item.quantity}</Text>
								<Pressable
									style={({ pressed }) => [
										responsive.quantityButton,
										pressed && responsive.pressedButton,
									]}
									onPress={() => modifyQuantity('+', item)}>
									<Text style={responsive.quantityButtonText}>+</Text>
								</Pressable>
							</View>
						</View>
					</View>
				)}
			/>
		</SafeAreaView>
	);
};

export default order;

const responsiveStyles = (isTablet: boolean, isSmallPhone: boolean) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#ECE7BE',
		},

		scrollContainer: {
			paddingBottom: 90,
		},

		listContainer: {
			paddingHorizontal: 16,
		},

		cartHeading: {
			color: '#0B0B0B',
			fontSize: isTablet ? 28 : 22,
			fontWeight: '800',
			marginHorizontal: 16,
			marginTop: 8,
			marginBottom: 10,
		},

		cartCard: {
			backgroundColor: '#F5F1D8',
			borderRadius: 16,
			marginBottom: 12,
			borderWidth: 1,
			borderColor: '#E4DEC3',
			padding: 10,
			flexDirection: 'row',
			alignItems: 'center',
			width: '100%',
		},

		cartImage: {
			width: isTablet ? 72 : 54,
			height: isTablet ? 72 : 54,
			borderRadius: 10,
			resizeMode: 'cover',
			marginRight: 10,
		},

		cartContent: {
			flex: 1,
			justifyContent: 'space-between',
		},

		cartTopRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 6,
		},

		cartFoodName: {
			color: '#0B0B0B',
			fontSize: isTablet ? 17 : 13,
			fontWeight: '700',
			maxWidth: '65%',
		},

		priceText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 16 : 13,
			fontWeight: '700',
		},

		quantityContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: '#EFE9CC',
			alignSelf: 'flex-start',
			borderRadius: 10,
			paddingHorizontal: 6,
			paddingVertical: 4,
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		quantityButton: {
			width: isTablet ? 30 : 24,
			height: isTablet ? 30 : 24,
			backgroundColor: '#0B0B0B',
			borderRadius: 6,
			justifyContent: 'center',
			alignItems: 'center',
		},

		quantityButtonText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 16 : 12,
			fontWeight: '700',
		},

		quantityText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 15 : 12,
			fontWeight: '700',
			marginHorizontal: 10,
		},

		selectCouponButton: {
			backgroundColor: '#F5F1D8',
			marginTop: 2,
			marginBottom: 10,
			paddingVertical: 12,
			borderRadius: 14,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		selectCouponText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 16 : 13,
			fontWeight: '700',
		},

		addressSection: {
			marginBottom: 10,
		},

		addAddressButton: {
			backgroundColor: '#0B0B0B',
			paddingVertical: 12,
			borderRadius: 14,
			alignItems: 'center',
		},

		addAddressText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 16 : 13,
			fontWeight: '700',
		},

		savedAddressContainer: {
			backgroundColor: '#F5F1D8',
			borderRadius: 14,
			padding: 12,
			borderWidth: 1,
			borderColor: '#E4DEC3',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		deliverText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 14 : 11,
			fontWeight: '700',
			marginBottom: 4,
		},

		addressText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 13 : 11,
			lineHeight: 18,
			maxWidth: '90%',
		},

		addressTypeText: {
			color: '#6E6A5E',
			fontSize: isTablet ? 12 : 10,
			marginTop: 4,
		},

		editButtonContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: '#ece4b8',
			paddingHorizontal: 12,
			paddingVertical: 8,
			borderRadius: 10,
		},

		editButtonLabel: {
			color: '#0B0B0B',
			fontSize: 13,
			fontWeight: '700',
			marginRight: 6,
		},

		editButtonIcon: {
			color: '#0B0B0B',
			fontSize: 16,
		},
		deliveryText: {
			color: '#6E6A5E',
			fontSize: isTablet ? 14 : 11,
			fontWeight: '600',
			marginHorizontal: 16,
			marginBottom: 10,
		},

		totalBillButton: {
			backgroundColor: '#F5F1D8',
			marginBottom: 10,
			paddingVertical: 12,
			paddingHorizontal: 14,
			borderRadius: 14,
			borderWidth: 1,
			borderColor: '#E4DEC3',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		totalBillText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 16 : 13,
			fontWeight: '700',
		},

		totalBillPriceContainer: {
			alignItems: 'flex-end',
		},

		totalBillOriginalPrice: {
			color: '#8C8774',
			fontSize: isTablet ? 11 : 9,
			textDecorationLine: 'line-through',
		},

		totalBillFinalPrice: {
			color: '#0B0B0B',
			fontSize: isTablet ? 18 : 15,
			fontWeight: '700',
		},

		placeOrderButton: {
			backgroundColor: '#0B0B0B',
			marginBottom: 14,
			paddingVertical: 13,
			borderRadius: 14,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: 16,
		},

		placeOrderText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 16 : 13,
			fontWeight: '700',
		},

		placeOrderPrice: {
			color: '#F5F1D8',
			fontSize: isTablet ? 18 : 15,
			fontWeight: '700',
		},

		pressedButton: {
			opacity: 0.85,
			transform: [{ scale: 0.97 }],
		},

		overlay: {
			flex: 1,
			backgroundColor: 'rgba(0,0,0,0.12)',
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: 16,
		},

		modalBox: {
			width: '100%',
			backgroundColor: '#F5F1D8',
			borderRadius: 18,
			padding: 16,
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		modalTitle: {
			color: '#0B0B0B',
			fontSize: isTablet ? 20 : 16,
			fontWeight: '700',
			marginBottom: 14,
			textAlign: 'center',
		},

		couponButton: {
			backgroundColor: '#0B0B0B',
			paddingVertical: 12,
			borderRadius: 12,
			marginBottom: 10,
			alignItems: 'center',
		},

		disabledCoupon: {
			backgroundColor: '#CFC8AA',
			opacity: 0.6,
		},

		couponText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 14 : 12,
			fontWeight: '700',
		},

		closeButton: {
			marginTop: 2,
			paddingVertical: 10,
			alignItems: 'center',
		},

		closeText: {
			color: '#6E6A5E',
			fontSize: 12,
			fontWeight: '600',
		},

		billModalBox: {
			width: '100%',
			backgroundColor: '#F5F1D8',
			borderRadius: 18,
			padding: 16,
			borderWidth: 1,
			borderColor: '#E4DEC3',
			maxHeight: '70%',
		},

		billHeading: {
			color: '#0B0B0B',
			fontSize: isTablet ? 22 : 18,
			fontWeight: '700',
			marginBottom: 14,
			textAlign: 'center',
		},

		billItemRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 10,
		},

		billItemName: {
			color: '#0B0B0B',
			fontSize: isTablet ? 14 : 12,
			fontWeight: '600',
		},

		billItemPrice: {
			color: '#0B0B0B',
			fontSize: isTablet ? 14 : 12,
			fontWeight: '700',
		},

		billDivider: {
			height: 1,
			backgroundColor: '#E4DEC3',
			marginVertical: 12,
		},

		billRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginBottom: 8,
		},

		billLabel: {
			color: '#6E6A5E',
			fontSize: isTablet ? 13 : 11,
		},

		billValue: {
			color: '#0B0B0B',
			fontSize: isTablet ? 13 : 11,
			fontWeight: '600',
		},

		discountText: {
			color: '#7BA05B',
			fontSize: isTablet ? 13 : 11,
			fontWeight: '700',
		},

		finalTotalLabel: {
			color: '#0B0B0B',
			fontSize: isTablet ? 16 : 13,
			fontWeight: '700',
		},

		finalTotalValue: {
			color: '#0B0B0B',
			fontSize: isTablet ? 20 : 16,
			fontWeight: '700',
		},

		closeBillButton: {
			backgroundColor: '#0B0B0B',
			paddingVertical: 12,
			borderRadius: 12,
			alignItems: 'center',
			marginTop: 14,
		},

		closeBillText: {
			color: '#F5F1D8',
			fontSize: 13,
			fontWeight: '700',
		},

		orderModalBox: {
			width: '100%',
			backgroundColor: '#F5F1D8',
			borderRadius: 18,
			padding: 20,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		orderSuccessText: {
			fontSize: isTablet ? 34 : 28,
			fontWeight: '700',
			color: '#0B0B0B',
			marginBottom: 8,
		},

		orderPlacedText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 20 : 16,
			fontWeight: '700',
			marginBottom: 16,
			textAlign: 'center',
		},

		deliveryTimeText: {
			color: '#6E6A5E',
			fontSize: isTablet ? 13 : 11,
			marginBottom: 4,
		},

		deliveryMinuteText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 30 : 24,
			fontWeight: '700',
			marginBottom: 18,
		},

		doneButton: {
			backgroundColor: '#0B0B0B',
			width: '100%',
			paddingVertical: 12,
			borderRadius: 12,
			alignItems: 'center',
		},

		doneButtonText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 14 : 12,
			fontWeight: '700',
		},

		emptyContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: 30,
		},

		emptyTitle: {
			color: '#0B0B0B',
			fontSize: isTablet ? 24 : 18,
			fontWeight: '700',
			marginBottom: 8,
		},

		emptySubTitle: {
			color: '#6E6A5E',
			fontSize: isTablet ? 15 : 12,
			textAlign: 'center',
			lineHeight: 20,
		},

		input: {
			backgroundColor: '#EFE9CC',
			borderWidth: 1,
			borderColor: '#E4DEC3',
			borderRadius: 12,
			paddingHorizontal: 14,
			paddingVertical: 12,
			color: '#0B0B0B',
			marginBottom: 12,
			fontSize: 13,
		},

		addressTypeContainer: {
			flexDirection: 'row',
			marginBottom: 14,
		},

		addressTypeButton: {
			flex: 1,
			backgroundColor: '#EFE9CC',
			paddingVertical: 12,
			borderRadius: 12,
			alignItems: 'center',
			marginHorizontal: 4,
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		selectedAddressType: {
			backgroundColor: '#0B0B0B',
		},

		addressTypeButtonText: {
			fontWeight: '700',
		},

		selectedAddressTypeText: {
			color: '#F5F1D8',
		},

		unselectedAddressTypeText: {
			color: '#0B0B0B',
		},

		saveButton: {
			backgroundColor: '#0B0B0B',
			paddingVertical: 14,
			borderRadius: 12,
			alignItems: 'center',
			marginBottom: 8,
		},

		saveButtonText: {
			color: '#F5F1D8',
			fontWeight: '700',
			fontSize: 14,
		},

		addressWarningBox: {
			width: '88%',
			backgroundColor: '#F5F1D8',
			borderRadius: 24,
			paddingVertical: 26,
			paddingHorizontal: 22,
			alignItems: 'center',
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		addressWarningIcon: {
			fontSize: 42,
			marginBottom: 12,
		},

		addressWarningTitle: {
			color: '#0B0B0B',
			fontSize: 22,
			fontWeight: '700',
			marginBottom: 10,
			textAlign: 'center',
		},

		addressWarningMessage: {
			color: '#6E6A5E',
			fontSize: 14,
			lineHeight: 22,
			textAlign: 'center',
			marginBottom: 24,
		},

		addressWarningButton: {
			backgroundColor: '#0B0B0B',
			width: '100%',
			paddingVertical: 14,
			borderRadius: 14,
			alignItems: 'center',
			marginBottom: 10,
		},

		addressWarningButtonText: {
			color: '#F5F1D8',
			fontSize: 15,
			fontWeight: '700',
		},

		addressWarningCancel: {
			paddingVertical: 10,
		},

		addressWarningCancelText: {
			color: '#6E6A5E',
			fontSize: 14,
			fontWeight: '600',
		},
	});
