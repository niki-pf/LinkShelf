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
  onEdit: (link: LinkItem) => void;
}

//placeholder bild
const ICON_SIZE = 40;

export default function LinkCard({ link, onDelete, onEdit }: LinkCardProps) {
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

  // const handleEditLink = (e: any) => {
  //   e.stopPropagation();
  //   onEdit(link);
  // };
  return (
    <TouchableOpacity style={styles.card} onPress={handleOpenLink}>
      <View style={styles.row}>
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
            </View>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {displayTitle}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {displayDescription}
          </Text>
          <View style={styles.buttonsContainer}>
            <View style={styles.urlContainer}>
              <Feather name="link" size={12} color={"black"} />
              <Text style={styles.urlText} numberOfLines={1}>
                {getDomain(link.url)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(link)}
            >
              <Feather name="edit-3" size={20} color="#1A2980" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeleteLink}
            >
              <AntDesign name="delete" size={20} color="#EF4444" />
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
    marginBottom: 15,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    padding: 10,
  },
  imageContainer: {
    width: 90,
    height: 90,
    marginRight: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  urlText: {
    marginLeft: 4,
    color: "#333",
    fontSize: 12,
  },
  actionButton: {
    padding: 4,
  },
});
