import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinkItem } from "@/lib/supabase"; // Se till att sökvägen till din supabase.ts är rätt

// URL för en fallback placeholder-bild om LinkCard inte hittar någon bild
// OBS: För riktig app, lägg till din egen lokala placeholder-bild och använd require('...')
const PLACEHOLDER_IMAGE_URL =
  "https://placehold.co/600x400/CCCCCC/333333?text=LinkShelf";

interface LinkCardProps {
  link: LinkItem;
}

const LinkCard: React.FC<LinkCardProps> = ({ link }) => {
  // Kontrollerar om bilden är giltig (inte null, inte tom sträng)
  const isImageValid = link.image && link.image.length > 5;

  // Funktion för att öppna länken när kortet trycks
  const handlePress = () => {
    // Försök öppna URL, och hantera eventuella fel
    Linking.openURL(link.url).catch((err) =>
      console.error("Kunde inte öppna länk: ", err)
    );
  };

  // Funktion för att hämta domänen för snyggare visning
  const getDomain = (url: string) => {
    try {
      // Använd URL API för att extrahera domän och ta bort 'www.'
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "Okänd källa";
    }
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      {/* Bild eller Placeholder-ikon */}
      <View style={styles.imageContainer}>
        {isImageValid ? (
          <Image
            source={{ uri: link.image }}
            style={styles.cardImage}
            resizeMode="cover"
            onError={() => console.log(`Kunde inte ladda bild: ${link.image}`)}
          />
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="link" size={50} color="#1A2980" />
            <Text style={styles.placeholderText}>Ingen förhandsvisning</Text>
          </View>
        )}
      </View>

      {/* Textinnehåll */}
      <View style={styles.textContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {link.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={3}>
          {link.description || "Ingen beskrivning tillgänglig."}
        </Text>
        <Text style={styles.cardDomain}>{getDomain(link.url)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // Android Elevation
    elevation: 5,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#f5f5f5",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  placeholderText: {
    color: "#1A2980",
    marginTop: 5,
    fontSize: 12,
  },
  textContainer: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A2980",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  cardDomain: {
    fontSize: 12,
    color: "#26D0CE",
    fontWeight: "600",
  },
});

export default LinkCard;
