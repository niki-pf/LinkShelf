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
import { getDomain } from "../lib/util";

interface LinkCardProps {
  link: LinkItem;
}

//placeholder bild
const placeholderImage =
  "https://placehold.co/400x150/D1D5DB/4B5563?text=BILD+SAKNAS";

export default function LinkCard({ link }: LinkCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleOpenLink = () => {
    Linking.openURL(link.url).catch((err) =>
      console.error("Kunde ej öppna länk: ", err)
    );
  };

  const displayImage = link.image || placeholderImage;
  const displayTitle = link.title || link.url;
  const displayDescription = link.description || "Ingen beskrivning tillgänlig";

  return (
    <TouchableOpacity style={styles.card} onPress={handleOpenLink}>
      {/* ÖVERSTA HALVAN - BILD */}
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
      {/* UNDRE HALVAN - TEXT CONTENT / action knappar  */}
      <View style={styles.contentContainer}>
        {/* TITEL OCH BESKRIVNING */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.description}>{displayDescription}</Text>
        </View>

        {/* ACTIONS container/ KNAPPAR */}
        <View style={styles.actionsContainer}>
          {/* url */}
          <View style={styles.urlContainer}>
            <Feather name="link" size={12} color={"black"} />
            <Text style={styles.urlContainer} numberOfLines={1}>
              {getDomain(link.url)}
            </Text>
          </View>
          {/* KNAPP SEKTION */}
          <View style={styles.buttonsContainer}>
            {/* öppna länk */}
            <TouchableOpacity
              style={styles.actionButton}
              // onPress={handleEditLink} behöver implementeras
              activeOpacity={0.7}
            />
            <Feather name="edit-3" size={20} color="#1A2980" />
            {/* ta bort  länk */}
            <TouchableOpacity
              style={styles.actionButton}
              // onPress={handleDeleteLink} behöver implementeras
              activeOpacity={0.7}
            />
            <AntDesign name="delete" size={20} color={"#EF4444"} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    elevation: 5,
    width: "100%",
    alignContent: "center",
    overflow: "hidden",
  },

  imageContainer: {
    width: "100%",
    height: 100,
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

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  textContainer: {},

  title: {
    fontWeight: "bold",
    paddingTop: 5,
    fontSize: 16,
  },

  description: {
    fontWeight: "medium",
    lineHeight: 20,
    paddingBottom: 20,
  },

  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  urlContainer: {
    flexDirection: "row",
  },

  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
  },

  actionButton: {},
});
