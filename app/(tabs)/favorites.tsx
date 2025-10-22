import { StyleSheet, Platform, View, Alert } from "react-native";
import { Image } from "expo-image";

// import { HelloWave } from "@/components/HelloWave";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";

import { favoritesFeed } from "@/placeholder"
import { FlashList } from "@shopify/flash-list";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";

export default function HomeScreen() {
	const showAlert = () => {
		Alert.alert("Post added to favorites!");
	};
	
	const doubleTap = Gesture.Tap()
		.maxDuration(250)
		.numberOfTaps(2)
		.onStart(() => {
			console.log("Double tap!");
			runOnJS(showAlert)();
		});
	
	const longPressGesture = Gesture.LongPress()
		.onEnd((e, success) => {
			if (success) {
				console.log(`Long pressed for ${e.duration} ms!`);
			}
		});

	return (
		<View style={styles.container}>

			<FlashList
				data={favoritesFeed}
				renderItem={({ item }) => (
					<GestureDetector gesture={Gesture.Exclusive(doubleTap, longPressGesture)}>
						<Image
							style={{ width: "100%", aspectRatio: 1, borderRadius: 16, marginBottom: 8 }}
							source={{ uri: item.image }}
							contentFit="cover"
							accessibilityLabel={item.caption}
						/>
					</GestureDetector>
				)}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
  }, 
});
