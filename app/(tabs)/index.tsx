import { StyleSheet, Platform, View, Alert, Text } from "react-native";
import { Image } from "expo-image";

// import { HelloWave } from "@/components/HelloWave";
// import ParallaxScrollView from "@/components/ParallaxScrollView";
// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";

import { homeFeed } from "@/placeholder"
import { FlashList } from "@shopify/flash-list";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-worklets";
import { useAuth } from "@/components/authProvider";
import firestore, {PostWithId} from "@/lib/firestore";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

export default function Page() {
	const isFocused = useIsFocused();
	const auth = useAuth();
	const [posts, setPosts] = useState<PostWithId[]>([]);
	const [lastDoc, setLastDoc] = useState<any>(null);
	const pageSize = 2;

	async function fetchAllPosts() {
		if (lastDoc === "end") return;
		
		let result = await firestore.allPosts(pageSize, lastDoc);
		if (!result) return;
		
		if (result.allPosts.length === 0) {
			setLastDoc("end");
			return;
		}

		setPosts(prev => [...prev, ...result.allPosts]);
		setLastDoc(result.lastDoc);
	}

	useEffect(() => {
		fetchAllPosts();
	}, [isFocused]);

	return (
		<View style={styles.container}>
			<Text style={{fontWeight: "bold", textAlign: "center", padding: 8}}>Welcome {auth.user?.email}!</Text>
			<FlashList
				data={posts}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					const handleFavorite = async () => {
						const result = await firestore.toggleFavorite(auth.user?.uid!, item.id);

						if (result.favorited) {
							Alert.alert("Added to favorites")
						} else {
							Alert.alert("Removed from favorites")
						}
					}

					const showCaption = async () => {
						const result = await firestore.getPostCaption(item.id);
						Alert.alert(result);
					}
					
					const doubleTap = Gesture.Tap()
						.maxDuration(250)
						.numberOfTaps(2)
						.onStart(() => {
							runOnJS(handleFavorite)();
						});
					
					const longPressGesture = Gesture.LongPress()
						.onEnd((e, success) => {
							if (success) {
								runOnJS(showCaption)();
							}
						});
					return (
						<GestureDetector gesture={Gesture.Exclusive(doubleTap, longPressGesture)}>
							<Image
								style={{ width: "100%", aspectRatio: 1, borderRadius: 16, marginBottom: 8 }}
								source={{ uri: item.image }}
								contentFit="cover"
								accessibilityLabel={item.caption}
							/>
						</GestureDetector>
					);
				}}
				onRefresh={fetchAllPosts}
				onEndReached={() => {
					fetchAllPosts();
				}}
				onEndReachedThreshold={0.5}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
    flex: 1,
  }, 
});
