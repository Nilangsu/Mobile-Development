import {
	StyleSheet,
	Text,
	View,
	Image,
	ScrollView,
	useWindowDimensions,
} from 'react-native';
import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from '@/navigation/rootNavigation';
import { dummyData } from '../../../data/dummydata';
type RestaurantRouteProp = RouteProp<RootStackParamList, 'RestaurantDetail'>;

const RestaurantDetails = () => {
	const route = useRoute<RestaurantRouteProp>();
	const { id } = route.params;
	const { width } = useWindowDimensions();
	const isTablet = width > 768;
	return (
		<SafeAreaView
			style={styles.safeArea}
			edges={['top']}>
			<ScrollView
				style={styles.container}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}>
				<Image
					source={require('@/assets/images/restaurant.jpg')}
					style={[
						styles.image,
						{
							height: isTablet ? 340 : 240,
						},
					]}
				/>
				<View style={styles.content}>
					<View style={styles.topRow}>
						<View>
							<Text style={styles.title}>Food Villa Special</Text>
							<Text style={styles.cuisine}>Italian • Indian • Chinese</Text>
						</View>
						<View style={styles.ratingContainer}>
							<Text style={styles.ratingText}>⭐ 4.9</Text>
						</View>
					</View>
					<View style={styles.infoRow}>
						<View style={styles.infoBadge}>
							<Text style={styles.infoText}>🕒 35 mins</Text>
						</View>
						<View style={styles.infoBadge}>
							<Text style={styles.infoText}>🚚 Free Delivery</Text>
						</View>
					</View>
					<Text style={styles.sectionTitle}>Restaurant ID</Text>
					<View style={styles.idCard}>
						<Text style={styles.idText}>{id}</Text>
					</View>
					<Text style={styles.sectionTitle}>About</Text>
					<Text style={styles.description}>
						Experience premium dining with a perfect blend of flavors, fresh
						ingredients and exceptional quality. Food Villa brings handcrafted
						meals prepared by expert chefs with authentic recipes and modern
						taste.
					</Text>
					<Text style={styles.sectionTitle}>Popular Dishes</Text>
					{dummyData.slice(0, 3).map((dish) => (
						<View
							key={dish.id}
							style={styles.dishCard}>
							<View style={styles.dishLeft}>
								<Image
									source={dish.image}
									style={styles.dishImage}
								/>

								<View style={styles.dishInfo}>
									<Text style={styles.dishName}>{dish.name}</Text>
									<Text style={styles.dishCuisine}>{dish.cuisine}</Text>
								</View>
							</View>
							<Text style={styles.dishPrice}>₹{dish.price}</Text>
						</View>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default RestaurantDetails;

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#ECE7BE',
	},

	container: {
		flex: 1,
		backgroundColor: '#ECE7BE',
	},

	scrollContent: {
		paddingBottom: 40,
	},

	image: {
		width: '100%',
		resizeMode: 'cover',
	},

	content: {
		padding: 20,
	},

	topRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginBottom: 18,
	},

	title: {
		color: '#0B0B0B',
		fontSize: 28,
		fontWeight: '700',
		marginBottom: 4,
	},

	cuisine: {
		color: '#6E6A5E',
		fontSize: 14,
	},

	ratingContainer: {
		backgroundColor: '#F5F1D8',
		paddingHorizontal: 12,
		paddingVertical: 7,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#E4DEC3',
	},

	ratingText: {
		color: '#0B0B0B',
		fontWeight: '700',
		fontSize: 14,
	},

	infoRow: {
		flexDirection: 'row',
		marginBottom: 24,
	},

	infoBadge: {
		backgroundColor: '#F5F1D8',
		paddingHorizontal: 14,
		paddingVertical: 10,
		borderRadius: 14,
		marginRight: 10,
		borderWidth: 1,
		borderColor: '#E4DEC3',
	},

	infoText: {
		color: '#0B0B0B',
		fontSize: 13,
		fontWeight: '600',
	},

	sectionTitle: {
		color: '#0B0B0B',
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 12,
		marginTop: 8,
	},

	idCard: {
		backgroundColor: '#F5F1D8',
		padding: 16,
		borderRadius: 18,
		marginBottom: 22,
		borderWidth: 1,
		borderColor: '#E4DEC3',
	},

	idText: {
		color: '#0B0B0B',
		fontSize: 18,
		fontWeight: '700',
	},

	description: {
		color: '#6E6A5E',
		fontSize: 15,
		lineHeight: 24,
		marginBottom: 26,
	},

	dishCard: {
		backgroundColor: '#F5F1D8',
		padding: 16,
		borderRadius: 18,
		marginBottom: 14,
		borderWidth: 1,
		borderColor: '#E4DEC3',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	dishName: {
		color: '#0B0B0B',
		fontSize: 15,
		fontWeight: '600',
		flex: 1,
		marginRight: 12,
	},

	dishPrice: {
		color: '#0B0B0B',
		fontSize: 17,
		fontWeight: '700',
	},
	dishLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},
	dishImage: {
		width: 58,
		height: 58,
		borderRadius: 14,
		marginRight: 12,
	},
	dishInfo: {
		flex: 1,
	},
	dishCuisine: {
		color: '#6E6A5E',
		fontSize: 12,
		marginTop: 3,
	},
});
