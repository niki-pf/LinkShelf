import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinkItem } from "@/lib/supabase";
import { AntDesign, Feather } from "@expo/vector-icons";

interface LinkCardProps {
  link: LinkItem;
}

//placeholder bild
const placeholderImage =
  "https://placehold.co/400x150/D1D5DB/4B5563?text=BILD+SAKNAS";

export default function LinkCard({ link }: LinkCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const displayImage = link.image || placeholderImage;
  const displayTitle = link.title || link.url;
  const displayDescription =
    link.description || "ingen beskrivning itllgänlgig";

  return (
    //ÖVERSTA HALVAN AV KORTET : BILD
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {isImageLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#4b5563" />
          </View>
        )}
        <Image
          source={{ uri: displayImage }}
          style={[styles.image, isImageLoading && { opacity: 0.1 }]}
          resizeMode="cover"
          onLoad={() => setIsImageLoading(false)}
          onError={({ nativeEvent: { error } }) => {
            setIsImageLoading(false);
          }}
        />
      </View>
      // UNDRE HALVAN : TEXT INNHEHÅLL
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.description}>{displayDescription}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    elevation: 5,
    width: "90%",
    alignContent: "center",
  },

  imageContainer: {
    width: "100%",
    height: 140,
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  contentContainer: {},
  textContainer: {},

  title: {},

  description: {},
});
