import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import styles from "@/assets/styles"

export default function Page() {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>User Profile for: {id}</Text>
        </View>
    );
}