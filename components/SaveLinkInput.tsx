import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinkItem, saveLink } from "@/lib/supabase";

interface SaveLinkInputProps {
  onLinkSaved: (newLink: LinkItem) => void;
}

export default function SaveLinkInput({ onLinkSaved }: SaveLinkInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidUrl = (text: string) => {
    // simpel regex för att kolla att string liknar en url
    return /^https?:\/\/\S+.\S+$/.test(text);
  };

  const handleSave = async () => {
    if (!url || !isValidUrl(url)) {
      Alert.alert(
        "Fel",
        "Ange en giltig url (måste börja med https:// eller http://"
      );
      return;
    }

    setLoading(true);

    try {
      const newLink = await saveLink(url);
      if (newLink) {
        onLinkSaved(newLink);
        setUrl("");
        Alert.alert("Sparat!", "Din länk är nu sparad.");
      } else {
        Alert.alert("Fel", "Kunde inte spara länken.");
      }
    } catch (e) {
      console.error("Save link error:", e);
      Alert.alert("Fel", "ett oväntat fel uppstod vid sparandet.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          onChangeText={setUrl}
          style={styles.input}
          placeholder="Klistra in länk här.."
          placeholderTextColor={"#9CA3AF"}
          value={url}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
      <TouchableOpacity
        style={[styles.saveButton, { opacity: loading ? 0.6 : 3 }]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Feather name="plus" size={24} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    marginBottom: 20,
  },

  inputWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    marginRight: 10,
    height: 50,
    justifyContent: "center",
  },

  input: {
    paddingHorizontal: 15,
    fontSize: 15,
    color: "black",
  },

  saveButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#547E76",
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
