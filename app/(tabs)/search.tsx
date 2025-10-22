import { Link } from "expo-router";
import { Text, View } from "react-native";
import styles from "@/assets/styles"

export default function Page() {
    return (
        <View style={styles.searchPage}>
            <Text>Search</Text>
            <Link href="/profile/1">
                <Text>Profile 1</Text>
            </Link>
            <Link href="/profile/2">
                <Text>Profile 2</Text>
            </Link>
            <Link href="/profile/3">
                <Text>Profile 3</Text>
            </Link>
        </View>
    );
}