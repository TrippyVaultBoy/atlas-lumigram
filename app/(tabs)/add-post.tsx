import { useImagePicker } from "@/hooks/useImagePicker";
import { SymbolView } from "expo-symbols";
import { Image } from "expo-image";
import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import storage from "@/lib/storage";
import firestore from "@/lib/firestore";
import { useAuth } from "@/components/authProvider";
import { router } from "expo-router";

export default function Page() {
    const auth = useAuth();
    const {image, openImagePicker, reset} = useImagePicker();
    const [caption, setCaption] = useState("");
    
    async function save() {
        if (!image) return;
        const name = image?.split("/").pop() as string;
        const {downloadUrl, metadata} = await storage.upload(image, name);
        console.log(downloadUrl);

        firestore.addPost({
            caption,
            image: downloadUrl,
            createdAt: new Date(),
            createdBy: auth.user?.uid!,
        });

        alert("Post added!");
        router.replace("/(tabs)");
    }

    return (
        <View style={styles.container}>
            <Image
                style={styles.imagePreview}
                source={image ? { uri: image} : require("@/assets/images/placeholder.png")}
                contentFit="cover"
            />
            <View style={styles.container}>
                {!image && (
                    <Pressable style={styles.choosePhotoButton} onPress={openImagePicker}>
                        <View style={styles.buttonContent}>
                            <SymbolView name="photo" tintColor={"#FFFFFF"}/>
                            <Text style={styles.buttonText}>Choose a photo</Text>
                        </View>
                    </Pressable>
                )}
                {image && (
                    <View style={styles.container}>
                        <TextInput
                            style={styles.captionInput}
                            value={caption}
                            onChangeText={setCaption}
                            placeholder="Add a caption"
                            placeholderTextColor="#00d6ad"
                        />
                        <Pressable style={styles.savePhotoButton} onPress={save}>
                            <View style={styles.buttonContent}>
                                <Text style={styles.buttonText}>Save</Text>
                            </View>
                        </Pressable>
                        <Pressable style={styles.resetButton} onPress={reset}>
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </Pressable>
                        <View style={styles.spacer}></View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        alignItems: "center"
    },
    imagePreview: {
        width: "80%",
        aspectRatio: 1,
        borderRadius: 24,
        marginTop: 40,
    },
    choosePhotoButton: {
        width: "80%",
        height: 50,
        backgroundColor: "#00d6ad",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    buttonText: {
        color: "white"
    },
    captionInput: {
        width: "80%",
        height: 50,
        borderWidth: 1,
        borderColor: "#00d6ad",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 24,
        paddingHorizontal: 8,
    },
    savePhotoButton: {
        width: "70%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        backgroundColor: "#00d6ad",
        marginTop: 24,
    },
    resetButton: {
        width: "70%",
        flex: 1,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    resetButtonText: {
        color: "black",
        textAlign: "center",
    },
    spacer: {
        width: "100%",
        height: 85,
    },
});