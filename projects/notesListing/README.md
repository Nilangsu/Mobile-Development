# **Notes App**

This app has features:

- Add new notes
- Delete notes
- Add to favourite
- Edit notes
- Note writing UI
- Toggle light-dark mode
- Toggle background image

## Components used:

- FlatList
- Pressable
- Text
- TextInput
- View
- Keyboard
- TouchableWithoutFeedback
- Switch
- Image
- Modal
- KeyboardAvoidingView
- ImageBackground
- SafeAreaView
- StatusBar

## Hooks used:

- useState
- useEffect
- useColorScheme
- useWindowDimensions

## Improvements

- Can mark note as favourite and also unfavourite them
- Can delete the notes
- Can search any note's content or title keywords
- Used modal component to give a custom message before delete, as accidental press might delete the note, also the normal alert didn't suit my design so used custom
- Added background toggle in add/edit notes UI
- Can edit already added notes
- Each notes have a different color
- Didn't use navigation, handled all with useState and useEffect
