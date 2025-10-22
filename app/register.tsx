import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View, StyleSheet, TextInput } from "react-native";

export default function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Image
                style={{ width: 300, height: 150}}
                source={require("@/assets/images/logo.png")}
                placeholder="Atlas logo"
                contentFit="contain"
            />

            <Text style={styles.headerText}>Register</Text>

            <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="white"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="white"
                value={password}
                secureTextEntry={true}
                onChangeText={setPassword}
            />

            <Pressable
                style={styles.button}
                onPress={() => {router.replace("/(tabs)")}}
            >
                <Text style={styles.buttonText}>Create Account</Text>
            </Pressable>

            <Link
                style={styles.text}
                href="/login"
                replace
            >
                <Text>Login to an existing account</Text>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00003c"
  },
  headerText: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "white"
  },
  textInput: {
    width: "90%",
    borderColor: "#1dd2af",
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 16,
    color: "white"
  },
  button: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 48,
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: "#1dd2af",
  },
  buttonText: {
    color: "white",
  },
  text: {
    color: "white",
    marginTop: 24,
  },
});