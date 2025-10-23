import { Image } from "expo-image";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { profileFeed } from "@/placeholder";

export default function Page() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable>
                    <Image
                        style={styles.profileImage}
                        source={require("@/assets/images/placeholder.png")}
                        contentFit="cover"
                    />
                </Pressable>
                <Text>lumigram-user123</Text>
            </View>
            <View style={styles.listContent}>
                <FlashList
                    numColumns={3}
                    data={profileFeed}
                    renderItem={({ item }) => (
                        <Image
                            style={{ width: "100%", aspectRatio: 1 }}
                            source={{ uri: item.image }}
                            contentFit="cover"
                            accessibilityLabel={item.caption}
                        />
                    )} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        flex: 1,
        height: "100%",
    },
    header: {
        width: "100%",
        alignItems: "center",
        marginVertical: 32,
        gap: 32,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    listContent: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
});