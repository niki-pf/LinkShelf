import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

export default function LinkItem({ title, description, image, onPress }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Läs mer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
  },
});
