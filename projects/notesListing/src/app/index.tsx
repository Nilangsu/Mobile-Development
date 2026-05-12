import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	useColorScheme,
	useWindowDimensions,
	View,
	Keyboard,
	TouchableWithoutFeedback,
	Switch,
	Image,
	Modal,
	KeyboardAvoidingView,
	ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const themes = {
	dark: {
		background: '#1E1A17',
		card: '#23201D',
		input: '#2B2622',
		text: '#cdcac6',
		subText: '#C4B8AA',
		border: '#3A342F',
		button: '#3A312B',
		actionButton: '#312923',
		actionBorder: '#4A3D35',
		addButton: '#4e4b46',
		addButtonText: '#cdcac6',
		addButtonPressed: '#383129',
		tabBackground: '#2B2622',
		tabActive: '#4A3D35',
		tabPressed: '#3A342F',
		tabText: '#C4B8AA',
		tabActiveText: '#F5EFE6',
		switchTrackFalse: '#645b54',
		switchTrackTrue: '#4e4944',
		switchThumb: '#F5EFE6',
	},

	light: {
		background: '#F4EBDD',
		card: '#FFFAF2',
		input: '#EFE4D3',
		text: '#7d694f',
		subText: '#6B6258',
		border: '#DDD2C2',
		button: '#E6D5BD',
		actionButton: '#F3E5D8',
		actionBorder: '#DDD2C2',
		addButton: '#A67C52',
		addButtonText: '#FFFAF2',
		addButtonPressed: '#533d29',
		tabBackground: '#EFE4D3',
		tabActive: '#D9C2A0',
		tabPressed: '#E6D5BD',
		tabText: '#6B6258',
		tabActiveText: '#2F2A24',
		switchTrackFalse: '#ae9470',
		switchTrackTrue: '#A67C52',
		switchThumb: '#FFF8E7',
	},
};
const cardColors = {
	light: [
		'#FFF8E7',
		'#FDEBD3',
		'#FAF3DD',
		'#F8EDE3',
		'#F9F1F0',
		'#EFD9CE',
		'#F7E7CE',
		'#F3E5D8',
		'#EFE6DD',
		'#F6E6CB',
	],

	dark: [
		'#23201D',
		'#2A241F',
		'#312923',
		'#28231F',
		'#342C26',
		'#2D2722',
		'#3A312B',
		'#26211D',
		'#332B25',
		'#2F2924',
	],
};
type Fav = {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
};
const Homescreen = () => {
	const [search, setSearch] = useState('');
	const [display, setDisplay] = useState<Fav[]>([]);
	const [allNotes, setAllNotes] = useState<Fav[]>([]);
	const [favourite, setFavourite] = useState<Fav[]>([]);
	const [selectedTab, setSelectedTab] = useState('all');
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	const [selectedDeleteNote, setSelectedDeleteNote] = useState<Fav | null>(
		null,
	);
	const [showAddScreen, setShowAddScreen] = useState(false);
	const [holdTitle, setHoldTitle] = useState('');
	const [holdContent, setHoldContent] = useState('');
	const systemScheme = useColorScheme();
	const { width } = useWindowDimensions();
	const isTablet = width > 768;
	const isSmallPhone = width < 380;
	const [manualDark, setManualDark] = useState<boolean | null>(null);
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const isDark = manualDark !== null ? manualDark : systemScheme === 'dark';
	const [isCat, setIsCat] = useState(true);
	const theme = isDark ? themes.dark : themes.light;
	const responsiveStyles = StyleSheet.create({
		heroPadding: {
			paddingHorizontal: isSmallPhone ? 16 : isTablet ? 40 : 20,
		},

		titleSize: {
			fontSize: isSmallPhone ? 24 : isTablet ? 38 : 30,
		},

		searchSpacing: {
			marginHorizontal: isSmallPhone ? 16 : isTablet ? 40 : 20,
			paddingHorizontal: isSmallPhone ? 14 : 18,
			paddingVertical: isSmallPhone ? 10 : 14,
			fontSize: isSmallPhone ? 14 : 16,
		},

		cardPadding: {
			padding: isSmallPhone ? 14 : 18,
		},

		cardWidth: {
			maxWidth: isTablet ? 700 : '100%',
		},

		contentText: {
			fontSize: isSmallPhone ? 14 : 15,
			lineHeight: isSmallPhone ? 22 : 24,
		},

		titleText: {
			fontSize: isSmallPhone ? 18 : 20,
		},

		dateText: {
			fontSize: isSmallPhone ? 11 : 12,
		},
		themeIcon: {
			width: isTablet ? 28 : isSmallPhone ? 18 : 22,
			height: isTablet ? 28 : isSmallPhone ? 18 : 22,
		},
		actionGap: {
			gap: isSmallPhone ? 6 : 10,
		},

		iconButtonPadding: {
			padding: isSmallPhone ? 6 : 8,
		},

		iconSize: {
			width: isSmallPhone ? 16 : isTablet ? 24 : 20,
			height: isSmallPhone ? 16 : isTablet ? 24 : 20,
		},

		addButton: {
			paddingHorizontal: isSmallPhone ? 16 : 22,
			paddingVertical: isSmallPhone ? 10 : 14,
			borderRadius: isSmallPhone ? 14 : 18,
			bottom: isSmallPhone ? 90 : 80,
		},

		addButtonText: {
			fontSize: isSmallPhone ? 13 : 15,
		},
		tabPadding: {
			paddingHorizontal: isSmallPhone ? 14 : 20,
			paddingVertical: isSmallPhone ? 8 : 12,
			borderRadius: isSmallPhone ? 12 : 16,
		},

		tabText: {
			fontSize: isSmallPhone ? 13 : 15,
		},
		inputSpacing: {
			paddingHorizontal: isSmallPhone ? 16 : 20,
			paddingVertical: isSmallPhone ? 12 : 16,
			fontSize: isSmallPhone ? 15 : 17,
		},

		contentSpacing: {
			paddingHorizontal: isSmallPhone ? 16 : 20,
			paddingTop: isSmallPhone ? 16 : 20,
			fontSize: isSmallPhone ? 14 : 16,
		},

		buttonSpacing: {
			paddingVertical: isSmallPhone ? 13 : 15,
		},

		heroHeight: {
			height: isSmallPhone ? 120 : isTablet ? 170 : 140,
		},
	});
	function searchText() {
		const source = selectedTab === 'favourites' ? favourite : allNotes;
		const filteredData = source.filter((item) => {
			return (
				item.title.toLowerCase().includes(search.toLowerCase()) ||
				item.content.toLowerCase().includes(search.toLowerCase())
			);
		});
		setDisplay(filteredData);
	}
	function deleteNotes(item: Fav) {
		setAllNotes((previous) => previous.filter((note) => note.id !== item.id));
		setFavourite((previous) => previous.filter((note) => note.id !== item.id));
		setDeleteModalVisible(false);
	}
	function addingNotes() {
		const finalTitle = holdTitle.trim() || 'No Title';
		const finalContent = holdContent.trim() || 'No Content';
		if (editingNoteId) {
			const updatedNotes = allNotes.map((note) =>
				note.id === editingNoteId
					? {
							...note,
							title: finalTitle,
							content: finalContent,
							createdAt: new Date(),
						}
					: note,
			);
			setAllNotes(updatedNotes);
			setFavourite((previous) =>
				previous.map((note) =>
					note.id === editingNoteId
						? {
								...note,
								title: finalTitle,
								content: finalContent,
								createdAt: new Date(),
							}
						: note,
				),
			);
		} else {
			const newNote = {
				id: Date.now().toString(),
				title: finalTitle,
				content: finalContent,
				createdAt: new Date(),
			};
			setAllNotes((previous) => [newNote, ...previous]);
		}

		const wasEditing = editingNoteId !== null;
		Keyboard.dismiss();
		setHoldTitle('');
		setHoldContent('');
		setEditingNoteId(null);
		setShowAddScreen(false);
		if (!wasEditing) {
			setSelectedTab('all');
		}
	}
	useEffect(() => {
		searchText();
	}, [search, selectedTab, favourite, allNotes]);
	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
				<StatusBar style={manualDark ? 'light' : 'dark'}></StatusBar>
				<View
					style={StyleSheet.compose(styles.hero, responsiveStyles.heroPadding)}>
					<Text
						style={[
							StyleSheet.compose(styles.heroTitle, responsiveStyles.titleSize),
							{
								color: theme.text,
							},
						]}>
						Notes
					</Text>
					<View
						style={[
							styles.heroModeBtn,
							{
								backgroundColor: theme.button,
								borderColor: theme.border,
							},
						]}>
						<View style={styles.switchWrapper}>
							<Image
								source={
									isDark
										? require('@/assets/images/darkSwitch.png')
										: require('@/assets/images/lightSwitch.png')
								}
								style={[styles.themeIcon, responsiveStyles.themeIcon]}
							/>
							<Switch
								value={isDark}
								style={styles.modeBtn}
								onValueChange={() => setManualDark(!isDark)}
								trackColor={{
									false: '#c4ad8e',
									true: '#7d736d',
								}}
								thumbColor={isDark ? '#F5EFE6' : '#FFF8E7'}
							/>
						</View>
					</View>
				</View>
				{!showAddScreen && (
					<TextInput
						style={[
							StyleSheet.compose(
								styles.searchBar,
								responsiveStyles.searchSpacing,
							),
							{
								backgroundColor: theme.input,
								color: theme.text,
								borderColor: theme.border,
							},
						]}
						placeholder='Search Notes'
						placeholderTextColor={theme.subText}
						value={search}
						onChangeText={setSearch}></TextInput>
				)}
				{!showAddScreen ? (
					<View style={{ flex: 1 }}>
						<View style={styles.tabsContainer}>
							<Pressable
								onPress={() => setSelectedTab('all')}
								style={({ pressed }) => [
									styles.tabButton,
									responsiveStyles.tabPadding,
									{
										backgroundColor:
											selectedTab === 'all'
												? theme.tabActive
												: pressed
													? theme.tabPressed
													: theme.tabBackground,

										borderColor:
											selectedTab === 'all' ? theme.tabActive : theme.border,

										transform: [
											{
												scale: pressed ? 0.96 : 1,
											},
										],

										opacity: pressed ? 0.9 : 1,
									},
								]}>
								<Text
									style={[
										styles.tabText,
										responsiveStyles.tabText,
										{
											color:
												selectedTab === 'all'
													? theme.tabActiveText
													: theme.tabText,
										},
									]}>
									All
								</Text>
							</Pressable>

							<Pressable
								onPress={() => setSelectedTab('favourites')}
								style={({ pressed }) => [
									styles.tabButton,
									responsiveStyles.tabPadding,
									{
										backgroundColor:
											selectedTab === 'favourites'
												? theme.tabActive
												: pressed
													? theme.tabPressed
													: theme.tabBackground,

										borderColor:
											selectedTab === 'favourites'
												? theme.tabActive
												: theme.border,

										transform: [
											{
												scale: pressed ? 0.96 : 1,
											},
										],

										opacity: pressed ? 0.9 : 1,
									},
								]}>
								<Text
									style={[
										styles.tabText,
										responsiveStyles.tabText,
										{
											color:
												selectedTab === 'favourites'
													? theme.tabActiveText
													: theme.tabText,
										},
									]}>
									Favourites
								</Text>
							</Pressable>
						</View>

						<FlatList
							style={styles.cardsContainer}
							contentContainerStyle={{ paddingBottom: 140 }}
							data={display}
							keyExtractor={(item) => item.id}
							renderItem={({ item, index }) => {
								const cardBackground =
									cardColors[isDark ? 'dark' : 'light'][index % 10];

								return (
									<Pressable
										onPress={() => {
											setHoldTitle(item.title);
											setHoldContent(item.content);
											setEditingNoteId(item.id);
											setShowAddScreen(true);
										}}
										style={({ pressed }) => [
											StyleSheet.compose(
												styles.eachCard,
												responsiveStyles.cardPadding,
											),

											responsiveStyles.cardWidth,

											{
												backgroundColor: cardBackground,
												borderColor: theme.border,
												opacity: pressed ? 0.85 : 1,
												transform: [{ scale: pressed ? 0.98 : 1 }],
											},
										]}>
										<View style={styles.cardHeader}>
											<Text
												style={[
													StyleSheet.compose(
														styles.eachCardTitle,
														responsiveStyles.titleText,
													),
													{
														color: theme.text,
													},
												]}>
												{item.title}
											</Text>
											<View
												style={[
													styles.cardActions,
													responsiveStyles.actionGap,
												]}>
												<Pressable
													onPress={(e) => {
														e.stopPropagation();
														const exists = favourite.some(
															(favouriteItem) => favouriteItem.id === item.id,
														);
														if (exists) {
															setFavourite((previous) =>
																previous.filter(
																	(favouriteItem) =>
																		favouriteItem.id !== item.id,
																),
															);
														} else {
															setFavourite((previous) => [...previous, item]);
														}
													}}
													style={[
														styles.iconButton,
														responsiveStyles.iconButtonPadding,
														{
															backgroundColor: theme.actionButton,
															borderWidth: 1,
															borderColor: theme.actionBorder,
														},
													]}>
													<Image
														source={
															favourite.some(
																(favouriteItem) => favouriteItem.id === item.id,
															)
																? isDark
																	? require('@/assets/images/darkFavourite.png')
																	: require('@/assets/images/lightFavourite.png')
																: isDark
																	? require('@/assets/images/darkUnfavourite.png')
																	: require('@/assets/images/lightUnfavourite.png')
														}
														style={responsiveStyles.iconSize}
													/>
												</Pressable>
												<Pressable
													onPress={(e) => {
														e.stopPropagation();
														setSelectedDeleteNote(item);
														setDeleteModalVisible(true);
													}}
													style={[
														styles.iconButton,
														responsiveStyles.iconButtonPadding,
														{
															backgroundColor: theme.actionButton,
															borderWidth: 1,
															borderColor: theme.actionBorder,
														},
													]}>
													<Image
														source={
															isDark
																? require('@/assets/images/darkDelete.png')
																: require('@/assets/images/lightDelete.png')
														}
														style={responsiveStyles.iconSize}
													/>
												</Pressable>
											</View>
										</View>
										<Text
											style={[
												StyleSheet.compose(
													styles.eachCardContent,
													responsiveStyles.contentText,
												),
												{
													color: theme.subText,
												},
											]}
											numberOfLines={2}>
											{item.content}
										</Text>
										<Text
											style={[
												StyleSheet.compose(
													styles.eachCardCreatedAt,
													responsiveStyles.dateText,
												),
												{
													color: theme.subText,
												},
											]}>
											{item.createdAt.getDate()}-{item.createdAt.getMonth() + 1}
											-{item.createdAt.getFullYear()}{' '}
											{item.createdAt.getHours()}:
											{String(item.createdAt.getMinutes()).padStart(2, '0')}
										</Text>
									</Pressable>
								);
							}}></FlatList>
						<Pressable
							onPress={() => {
								setSearch('');
								setEditingNoteId(null);
								setHoldTitle('');
								setHoldContent('');
								setShowAddScreen(true);
							}}
							style={({ pressed }) => [
								styles.addNew,
								responsiveStyles.addButton,
								{
									backgroundColor: pressed
										? theme.addButtonPressed
										: theme.addButton,
									transform: [
										{
											scale: pressed ? 0.96 : 1,
										},
									],
									opacity: pressed ? 0.9 : 1,
								},
							]}>
							<Text
								style={[
									styles.addNewText,
									responsiveStyles.addButtonText,
									{
										color: theme.addButtonText,
									},
								]}>
								Add New Note
							</Text>
						</Pressable>
					</View>
				) : (
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior='padding'>
						<View style={responsiveStyles.heroPadding}>
							<ImageBackground
								source={
									isDark
										? isCat
											? require('@/assets/images/darkBackgroundCat.png')
											: require('@/assets/images/darkBackgroundDog.png')
										: isCat
											? require('@/assets/images/lightBackgroundCat.png')
											: require('@/assets/images/lightBackgroundDog.png')
								}
								style={[
									responsiveStyles.heroHeight,
									{
										borderRadius: 24,
										paddingHorizontal: 24,
										justifyContent: 'center',
									},
								]}
								imageStyle={{
									borderRadius: 24,
								}}
								resizeMode='cover'>
								<Text
									style={[
										styles.heroTitle,
										responsiveStyles.titleSize,
										{
											color: theme.subText,
										},
									]}>
									{editingNoteId ? 'Edit Note' : 'Add Notes'}
								</Text>
								<View style={styles.switchWrapper}>
									<Image
										source={
											isCat
												? isDark
													? require('@/assets/images/darkCatPaw.png')
													: require('@/assets/images/lightCatPaw.png')
												: isDark
													? require('@/assets/images/darkDogPaw.png')
													: require('@/assets/images/lightDogPaw.png')
										}
										style={[styles.themeIcon, responsiveStyles.themeIcon]}
									/>
									<Switch
										value={isCat}
										style={styles.modeBtn}
										onValueChange={() => setIsCat(!isCat)}
										trackColor={{
											false: theme.switchTrackFalse,
											true: theme.switchTrackTrue,
										}}
										thumbColor={theme.switchThumb}
									/>
								</View>
							</ImageBackground>
						</View>

						<View style={styles.formWrapper}>
							<TextInput
								style={[
									styles.notesTitle,
									responsiveStyles.inputSpacing,
									{
										backgroundColor: theme.card,
										color: theme.text,
										borderColor: theme.border,
									},
								]}
								onChangeText={setHoldTitle}
								placeholder='Title'
								placeholderTextColor={theme.subText}
								value={holdTitle}></TextInput>
							<TextInput
								multiline
								scrollEnabled
								textAlignVertical='top'
								style={[
									StyleSheet.compose(
										styles.notesContent,
										responsiveStyles.contentSpacing,
									),
									{
										backgroundColor: theme.card,
										color: theme.text,
										borderColor: theme.border,
										minHeight: isTablet ? 260 : 220,
										maxHeight: isTablet ? 260 : 220,
									},
								]}
								onChangeText={setHoldContent}
								placeholder='Enter your notes here'
								placeholderTextColor={theme.subText}
								value={holdContent}></TextInput>
							<Pressable
								style={({ pressed }) => [
									StyleSheet.compose(
										styles.addBtn,
										responsiveStyles.buttonSpacing,
									),
									{
										backgroundColor: theme.addButton,
										opacity: pressed ? 0.8 : 1,
										transform: [{ scale: pressed ? 0.97 : 1 }],
									},
								]}
								onPress={addingNotes}>
								<Text
									style={{
										color: '#FFF8E7',
										fontSize: 16,
										fontWeight: '600',
									}}>
									{editingNoteId ? 'Save Changes' : 'Add'}
								</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									setEditingNoteId(null);
									setHoldTitle('');
									setHoldContent('');
									setShowAddScreen(false);
								}}
								style={({ pressed }) => [
									StyleSheet.compose(
										styles.backBtn,
										responsiveStyles.buttonSpacing,
									),
									{
										backgroundColor: theme.button,
										borderColor: theme.border,
										opacity: pressed ? 0.8 : 1,
										transform: [{ scale: pressed ? 0.97 : 1 }],
									},
								]}>
								<Text
									style={{
										color: theme.text,
										fontSize: 16,
										fontWeight: '600',
									}}>
									Back
								</Text>
							</Pressable>
						</View>
					</KeyboardAvoidingView>
				)}

				<Modal
					transparent
					visible={deleteModalVisible}
					animationType='fade'>
					<View style={styles.modalOverlay}>
						<View
							style={[
								styles.modalContainer,
								{
									backgroundColor: theme.card,
									borderColor: theme.border,
								},
							]}>
							<Text
								style={[
									styles.modalTitle,
									{
										color: theme.text,
									},
								]}>
								Delete Note?
							</Text>
							<Text
								style={[
									styles.modalText,
									{
										color: theme.subText,
									},
								]}>
								Are you sure you want to delete this note?
							</Text>
							<View style={styles.modalActions}>
								<Pressable
									onPress={() => setDeleteModalVisible(false)}
									style={[
										styles.modalButton,
										{
											backgroundColor: theme.actionButton,
										},
									]}>
									<Text
										style={{
											color: theme.text,
										}}>
										Cancel
									</Text>
								</Pressable>
								<Pressable
									onPress={() => {
										if (selectedDeleteNote) {
											deleteNotes(selectedDeleteNote);
										}
									}}
									style={[
										styles.modalButton,
										{
											backgroundColor: theme.addButtonPressed,
										},
									]}>
									<Text
										style={{
											color: theme.addButtonText,
										}}>
										Delete
									</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
};
export default Homescreen;

const styles = StyleSheet.create({
	hero: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 16,
	},

	heroTitle: {
		fontSize: 30,
		fontWeight: '700',
		letterSpacing: 0.5,
	},

	heroModeBtn: {
		borderRadius: 30,
		alignSelf: 'flex-start',
	},
	heroModeBtnPressedDark: {
		backgroundColor: '#4A3D35',
	},

	heroModeBtnPressedLight: {
		backgroundColor: '#D8C2A5',
	},
	switchWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
		paddingHorizontal: 8,
	},
	themeIcon: {
		resizeMode: 'contain',
	},
	modeBtn: {
		transform: [{ scale: 0.9 }],
		backgroundColor: 'transparent',
	},

	searchBar: {
		marginHorizontal: 20,
		marginBottom: 18,

		paddingHorizontal: 18,
		paddingVertical: 14,

		fontSize: 16,
		borderRadius: 18,

		borderWidth: 1.2,

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 5,
		elevation: 2,
	},

	cardsContainer: {
		paddingHorizontal: 20,
	},
	tabsContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
		paddingHorizontal: 20,
		marginBottom: 18,
	},

	tabButton: {
		borderWidth: 1,
	},

	tabText: {
		fontWeight: '600',
		letterSpacing: 0.3,
	},
	cardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},

	cardActions: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	iconButton: {
		borderRadius: 12,
	},

	addNew: {
		position: 'absolute',
		bottom: 80,
		right: 20,

		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',

		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.15,
		shadowRadius: 6,
		elevation: 4,
	},

	addNewText: {
		fontWeight: '700',
		letterSpacing: 0.3,
	},
	eachCard: {
		padding: 18,
		marginBottom: 16,
		borderRadius: 18,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 6,
		elevation: 3,
	},

	eachCardTitle: {
		fontSize: 20,
		fontWeight: '700',
		marginBottom: 10,
		textTransform: 'capitalize',
	},

	eachCardContent: {
		fontSize: 15,
		lineHeight: 24,
		opacity: 0.85,
		marginBottom: 14,
	},

	eachCardCreatedAt: {
		fontSize: 12,
		opacity: 0.55,
		fontStyle: 'italic',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.45)',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},

	modalContainer: {
		width: '100%',
		borderRadius: 24,
		padding: 24,
		borderWidth: 1,
	},

	modalTitle: {
		fontSize: 22,
		fontWeight: '700',
		marginBottom: 10,
	},

	modalText: {
		fontSize: 15,
		lineHeight: 24,
		marginBottom: 24,
	},

	modalActions: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: 12,
	},

	modalButton: {
		paddingHorizontal: 18,
		paddingVertical: 12,
		borderRadius: 14,
	},
	formWrapper: {
		width: '100%',
		alignSelf: 'center',
		maxWidth: 700,
		marginTop: 20,
		gap: 16,
		paddingHorizontal: 20,
	},

	notesTitle: {
		width: '100%',
		borderRadius: 20,
		borderWidth: 1,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 5,
		elevation: 2,
	},

	notesContent: {
		width: '100%',
		borderRadius: 22,
		borderWidth: 1,
		textAlignVertical: 'top',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 5,
		elevation: 2,
	},

	addBtn: {
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 3,
	},

	backBtn: {
		borderRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
	},
});
