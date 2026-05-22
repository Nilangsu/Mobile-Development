import {
	StyleSheet,
	Text,
	View,
	Image,
	useWindowDimensions,
	FlatList,
	Pressable,
	ScrollView,
} from 'react-native';
import React from 'react';
import { dummyData, Menu } from '../../../data/dummydata';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { OrderItems } from '@/navigation/tabNavigation';

type Props = {
	cartItems: OrderItems[];
	setCartItems: React.Dispatch<React.SetStateAction<OrderItems[]>>;
};

const Home = ({ cartItems, setCartItems }: Props) => {
	const navigation = useNavigation();
	const { width } = useWindowDimensions();
	const isTablet = width > 768;
	const isSmallPhone = width < 380;
	const responsive = responsiveStyles(isTablet, isSmallPhone);
	function addToCart(addItem: Menu) {
		let present = false;
		const updatedCart = cartItems.map((item) => {
			if (item.id === addItem.id) {
				present = true;
				return {
					...item,
					quantity: item.quantity + 1,
				};
			}
			return item;
		});
		if (present) {
			setCartItems(updatedCart);
		} else {
			const newItem = {
				id: addItem.id,
				name: addItem.name,
				price: addItem.price,
				quantity: 1,
			};
			setCartItems([...cartItems, newItem]);
		}
	}

	function filterData(data: Menu[]) {
		return data.filter((item) => item.rating >= 4.8);
	}

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={dummyData}
				showsVerticalScrollIndicator={false}
				keyExtractor={(item) => item.id.toString()}
				contentContainerStyle={responsive.verticalList}
				ListHeaderComponent={
					<>
						<View style={responsive.headerContainer}>
							<View>
								<Text style={responsive.logoText}>Food Villa</Text>
								<Text style={responsive.subText}>Premium Food Experience</Text>
							</View>
							<Image
								source={require('@/assets/images/logo.png')}
								style={responsive.logo}
							/>
						</View>
						<View style={responsive.sectionContainer}>
							<Text style={responsive.sectionTitle}>Most Recommended</Text>
							<View style={responsive.horizontalWrapper}>
								<FlatList
									data={filterData(dummyData)}
									horizontal
									showsHorizontalScrollIndicator={false}
									keyExtractor={(item) => item.id.toString()}
									contentContainerStyle={responsive.horizontalList}
									renderItem={({ item }) => (
										<View style={responsive.smallCard}>
											<Image
												source={item.image}
												style={responsive.smallCardImage}
											/>

											<View style={responsive.smallCardContent}>
												<Text style={responsive.foodName}>{item.name}</Text>

												<View style={responsive.ratingContainer}>
													<Text style={responsive.ratingText}>
														⭐ {item.rating}
													</Text>
												</View>

												<Text style={responsive.cuisineText}>
													{item.cuisine}
												</Text>

												<Text style={responsive.timeText}>
													🕒 {item.cookTimeMinutes + 30} mins
												</Text>

												<View style={responsive.priceRow}>
													<Text style={responsive.priceText}>
														₹{item.price}
													</Text>

													<Pressable
														style={({ pressed }) => [
															responsive.addButton,
															pressed && responsive.pressedButton,
														]}
														onPress={() => addToCart(item)}>
														<Text style={responsive.addButtonText}>Add</Text>
													</Pressable>
												</View>
											</View>
										</View>
									)}
								/>
							</View>
						</View>
						<Text style={responsive.sectionTitle}>Featured</Text>
					</>
				}
				renderItem={({ item }) => (
					<View style={responsive.largeCard}>
						<Image
							source={item.image}
							style={responsive.largeCardImage}
						/>
						<View style={responsive.largeCardContent}>
							<View style={responsive.largeCardTop}>
								<View>
									<Text style={responsive.foodNameLarge}>{item.name}</Text>
									<Text style={responsive.cuisineText}>{item.cuisine}</Text>
								</View>
								<Text style={responsive.ratingText}>⭐ {item.rating}</Text>
							</View>
							<View style={responsive.categoryContainer}>
								{item.category.slice(0, 3).map((cat, index) => (
									<View
										key={index}
										style={responsive.categoryBadge}>
										<Text style={responsive.categoryText}>{cat}</Text>
									</View>
								))}
							</View>
							<View style={responsive.bottomRow}>
								<View>
									<Text style={responsive.timeText}>
										🕒 {item.cookTimeMinutes + 30} mins
									</Text>

									<Text style={responsive.priceTextLarge}>₹{item.price}</Text>
								</View>
								<Pressable
									style={({ pressed }) => [
										responsive.addButtonLarge,
										pressed && responsive.pressedButton,
									]}
									onPress={() => addToCart(item)}>
									<Text style={responsive.addButtonText}>Add</Text>
								</Pressable>
							</View>
						</View>
					</View>
				)}
			/>
		</SafeAreaView>
	);
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ECE7BE',
	},
});

const responsiveStyles = (isTablet: boolean, isSmallPhone: boolean) => {
	const screenPadding = 20;

	return StyleSheet.create({
		headerContainer: {
			paddingHorizontal: screenPadding,
			paddingTop: 10,
			paddingBottom: 22,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		sectionContainer: {
			marginBottom: 22,
		},

		sectionTitle: {
			color: '#0B0B0B',
			fontSize: isTablet ? 28 : 22,
			fontWeight: '700',
			paddingHorizontal: screenPadding,
			marginBottom: 14,
		},

		verticalList: {
			paddingBottom: 120,
		},

		horizontalWrapper: {
			paddingHorizontal: screenPadding,
		},

		horizontalList: {
			paddingRight: 8,
		},

		logo: {
			width: isTablet ? 90 : 65,
			height: isTablet ? 90 : 65,
			resizeMode: 'contain',
		},

		logoText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 34 : isSmallPhone ? 24 : 28,
			fontWeight: '700',
		},

		subText: {
			color: '#6E6A5E',
			fontSize: isTablet ? 18 : 14,
			marginTop: 4,
		},

		smallCard: {
			width: isTablet ? 270 : isSmallPhone ? 190 : 215,
			backgroundColor: '#F5F1D8',
			borderRadius: 20,
			marginRight: 10,
			overflow: 'hidden',
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		smallCardImage: {
			width: '100%',
			height: isTablet ? 150 : 115,
			resizeMode: 'cover',
		},

		smallCardContent: {
			padding: 10,
		},

		foodName: {
			color: '#0B0B0B',
			fontSize: isTablet ? 20 : 17,
			fontWeight: '700',
			marginBottom: 4,
		},

		ratingContainer: {
			backgroundColor: '#EFE9CC',
			alignSelf: 'flex-start',
			paddingHorizontal: 8,
			paddingVertical: 4,
			borderRadius: 9,
			marginBottom: 6,
		},

		ratingText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 15 : 12,
			fontWeight: '600',
		},

		cuisineText: {
			color: '#6E6A5E',
			fontSize: isTablet ? 15 : 12,
			marginBottom: 3,
		},

		timeText: {
			color: '#8C8774',
			fontSize: isTablet ? 15 : 12,
			marginBottom: 7,
		},

		priceRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		priceText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 18 : 15,
			fontWeight: '700',
		},

		addButton: {
			backgroundColor: '#0B0B0B',
			paddingHorizontal: 14,
			paddingVertical: 7,
			borderRadius: 10,
		},

		addButtonText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 15 : 13,
			fontWeight: '700',
		},

		pressedButton: {
			opacity: 0.75,
			transform: [{ scale: 0.96 }],
		},

		largeCard: {
			backgroundColor: '#F5F1D8',
			borderRadius: 22,
			marginBottom: 16,
			marginHorizontal: screenPadding,
			overflow: 'hidden',
			borderWidth: 1,
			borderColor: '#E4DEC3',
			shadowColor: '#0B0B0B',
			shadowOffset: {
				width: 0,
				height: 4,
			},
			shadowOpacity: 0.12,
			shadowRadius: 8,
			elevation: 6,
		},

		largeCardImage: {
			width: '100%',
			height: isTablet ? 230 : 175,
			resizeMode: 'cover',
		},

		largeCardContent: {
			padding: isTablet ? 18 : 14,
		},

		largeCardTop: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			marginBottom: 10,
		},

		foodNameLarge: {
			color: '#0B0B0B',
			fontSize: isTablet ? 22 : 17,
			fontWeight: '700',
			marginBottom: 3,
		},

		priceTextLarge: {
			color: '#0B0B0B',
			fontSize: isTablet ? 22 : 18,
			fontWeight: '700',
		},

		bottomRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		addButtonLarge: {
			backgroundColor: '#0B0B0B',
			paddingHorizontal: isTablet ? 24 : 18,
			paddingVertical: isTablet ? 14 : 10,
			borderRadius: 12,
			shadowColor: '#0B0B0B',
			shadowOffset: {
				width: 0,
				height: 4,
			},
			shadowOpacity: 0.12,
			shadowRadius: 6,
			elevation: 5,
		},

		categoryContainer: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			marginBottom: 6,
		},

		categoryBadge: {
			backgroundColor: '#EFE9CC',
			paddingHorizontal: 10,
			paddingVertical: 5,
			borderRadius: 10,
			marginRight: 8,
			marginBottom: 6,
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		categoryText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 11 : 10,
			fontWeight: '600',
		},
	});
};
