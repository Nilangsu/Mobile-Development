import {
	StyleSheet,
	Text,
	View,
	Image,
	useWindowDimensions,
	FlatList,
	Pressable,
	TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { dummyData, Menu } from '../../../data/dummydata';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OrderItems } from '@/navigation/tabNavigation';
type Props = {
	cartItems: OrderItems[];
	setCartItems: React.Dispatch<React.SetStateAction<OrderItems[]>>;
};
const Search = ({ cartItems, setCartItems }: Props) => {
	const [searchText, setSearchText] = useState<string>('');
	const [display, setDisplay] = useState<Menu[]>([]);
	const { width } = useWindowDimensions();
	const isTablet = width > 768;
	const isSmallPhone = width < 380;
	const responsive = responsiveStyles(isTablet, isSmallPhone);
	function searchMenu() {
		if (searchText.trim() === '') {
			setDisplay([]);
			return;
		}
		const filteredList = dummyData.filter((item) => {
			const nameMatch = item.name
				.toLowerCase()
				.includes(searchText.toLowerCase());
			const categoryMatch = item.category.some((cat) =>
				cat.toLowerCase().includes(searchText.toLowerCase()),
			);
			return nameMatch || categoryMatch;
		});
		setDisplay(filteredList);
	}
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
	useEffect(() => {
		searchMenu();
	}, [searchText]);
	return (
		<SafeAreaView style={styles.container}>
			<View style={responsive.searchContainer}>
				<Text style={responsive.heading}>Search Meals</Text>
				<TextInput
					style={responsive.searchInput}
					placeholder='Search your dish'
					placeholderTextColor='#8B6F63'
					value={searchText}
					onChangeText={setSearchText}
				/>
			</View>
			{display.length !== 0 ? (
				<FlatList
					data={display}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={responsive.listContainer}
					keyExtractor={(item) => item.id.toString()}
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
			) : (
				<View style={{ flex: 1 }}>
					<View style={responsive.emptyContainer}>
						<Text style={responsive.emptyTitle}>No dishes found</Text>
						<Text style={responsive.emptySubTitle}>
							Try searching for burgers, pizza, chicken...
						</Text>
					</View>
				</View>
			)}
		</SafeAreaView>
	);
};

export default Search;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ECE7BE',
	},
});

const responsiveStyles = (isTablet: boolean, isSmallPhone: boolean) =>
	StyleSheet.create({
		searchContainer: {
			paddingHorizontal: 16,
			paddingTop: 8,
			paddingBottom: 14,
		},

		heading: {
			color: '#0B0B0B',
			fontSize: isTablet ? 28 : isSmallPhone ? 20 : 24,
			fontWeight: '700',
			marginBottom: 14,
		},

		searchInput: {
			backgroundColor: '#F5F1D8',
			height: isTablet ? 60 : 48,
			borderRadius: isTablet ? 18 : 14,
			paddingHorizontal: 18,
			color: '#0B0B0B',
			fontSize: isTablet ? 16 : 14,
			borderWidth: 1,
			borderColor: '#E4DEC3',
		},

		listContainer: {
			paddingHorizontal: 16,
			paddingBottom: 110,
		},

		largeCard: {
			backgroundColor: '#F5F1D8',
			borderRadius: 22,
			marginBottom: 16,
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

		cuisineText: {
			color: '#6E6A5E',
			fontSize: isTablet ? 14 : 11,
		},

		ratingText: {
			color: '#0B0B0B',
			fontSize: isTablet ? 14 : 11,
			fontWeight: '700',
			backgroundColor: '#EFE9CC',
			paddingHorizontal: 10,
			paddingVertical: 5,
			borderRadius: 10,
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

		bottomRow: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		timeText: {
			color: '#6E6A5E',
			fontSize: isTablet ? 13 : 11,
			marginBottom: 4,
		},

		priceTextLarge: {
			color: '#0B0B0B',
			fontSize: isTablet ? 22 : 18,
			fontWeight: '700',
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

		addButtonText: {
			color: '#F5F1D8',
			fontSize: isTablet ? 15 : 12,
			fontWeight: '700',
		},

		pressedButton: {
			opacity: 0.82,
			transform: [{ scale: 0.97 }],
		},

		emptyContainer: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			paddingHorizontal: 24,
			paddingBottom: 150,
		},

		emptyTitle: {
			color: '#0B0B0B',
			fontSize: isTablet ? 24 : 18,
			fontWeight: '700',
			marginBottom: 8,
		},

		emptySubTitle: {
			color: '#6E6A5E',
			fontSize: isTablet ? 14 : 12,
			textAlign: 'center',
			lineHeight: 20,
		},
	});
