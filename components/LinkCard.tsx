import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { LinkItem } from "@/lib/supabase";
import { AntDesign, Feather } from "@expo/vector-icons"; // Kräver 'expo install @expo/vector-icons'
// Obs: Du kan behöva köra 'npx expo install @expo/vector-icons' i din terminal

interface LinkCardProps {
  link: LinkItem;
}

const placeholderImage = "https://placehold.co/120x80/1F2937/FFFFFF?text=URL";

export default function LinkCard({ link }: LinkCardProps) {
  const handleOpenLink = () => {
    Linking.openURL(link.url).catch((err) =>
      console.error("Kunde inte öppna länk: ", err)
    );
  };

  const displayImage = link.image_url || placeholderImage;
  const displayTitle = link.title || link.url;
  const displayDescription =
    link.description || "Ingen beskrivning tillgänglig.";

  return (
    <TouchableOpacity
      onPress={handleOpenLink}
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {displayTitle}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {displayDescription}
        </Text>
        <View style={styles.urlContainer}>
          <Feather name="link" size={12} color="#AAAAAA" />
          <Text style={styles.url} numberOfLines={1}>
            {link.url}
          </Text>
        </View>
      </View>

      {/* Länkbild */}
      <Image
        source={{ uri: displayImage }}
        style={styles.image}
        onError={({ nativeEvent: { error } }) =>
          console.log("Bildladdningsfel:", error)
        }
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 100,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 8,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  url: {
    fontSize: 11,
    color: "#4B5563",
    marginLeft: 4,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    resizeMode: "cover",
    marginLeft: 10,
  },
});
