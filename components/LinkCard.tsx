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
import * as WebBrowser from "expo-web-browser";

interface LinkCardProps {
  link: LinkItem;
  onDelete: (linkId: string) => void;
}

//placeholder bild
const ICON_SIZE = 40;

export default function LinkCard({ link, onDelete }: LinkCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  const handleOpenLink = async () => {
    // provar expo-web-brower , som stabilare lösning
    try {
      await WebBrowser.openBrowserAsync(link.url);
    } catch (err) {
      console.error("Kunde inte öppna länk i webbläsare");
    }
    // Linking.openURL(link.url).catch((err) =>
    //   console.error("Kunde ej öppna länk: ", err)
    // );
  };

  const handleDeleteLink = () => {
    onDelete(link.id);
  };

  const displayImageUrl =
    link.image || (link.image && !hasImageError) ? link.image : undefined;
  const displayTitle = link.title || link.url;
  const displayDescription = link.description || "Ingen beskrivning tillgänlig";

  const handleImageError = () => {
    setIsImageLoading(false);
    setHasImageError(true);
  };
  return (
    <TouchableOpacity style={styles.card} onPress={handleOpenLink}>
      {/* ÖVERSTA HALVAN - BILD */}
      <View style={styles.imageContainer}>
        {displayImageUrl ? (
          <>
            {isImageLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="small" color="#4b5563" />
              </View>
            )}
            <Image
              source={{ uri: displayImageUrl }}
              style={[styles.image, isImageLoading && { opacity: 0.1 }]}
              resizeMode="cover"
              onLoad={() => setIsImageLoading(false)}
              onError={handleImageError}
            />
          </>
        ) : (
          <View style={styles.fallbackContainer}>
            <Feather name="globe" size={ICON_SIZE} color="#888" />
            <Text style={styles.fallbackText}>Ingen bild</Text>
          </View>
        )}
      </View>
      ){/* UNDRE HALVAN - TEXT CONTENT / action knappar  */}
      <View style={styles.contentContainer}>
        {/* TITEL OCH BESKRIVNING */}
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {displayTitle}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {displayDescription}
          </Text>
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
              onPress={(e) => {
                e.stopPropagation();
                handleDeleteLink();
              }}
              activeOpacity={0.7}
            >
              <AntDesign name="delete" size={20} color={"#EF4444"} />
            </TouchableOpacity>
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
    marginBottom: 20,
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
    zIndex: 1,
  },

  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  textContainer: {
    minHeight: 80,
  },

  title: {
    fontWeight: "bold",
    paddingTop: 5,
    fontSize: 16,
  },

  description: {
    fontWeight: "medium",
    lineHeight: 14,
    paddingBottom: 5,
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
    zIndex: 10,
  },

  actionButton: {
    padding: 4,
  },

  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  fallbackText: {
    marginTop: 5,
    fontSize: 12,
    color: "#6B7280",
  },
});
