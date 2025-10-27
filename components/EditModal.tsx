import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from "react-native";
import { LinkItem, updateLink } from "@/lib/supabase";
import { dismiss } from "expo-router/build/global-state/routing";

interface EditModalProps {
  isVisible: boolean;
  link: LinkItem;
  onClose: () => void;
  onUpdate: (updatedLink: LinkItem) => void;
}

export default function EditModal({
  isVisible,
  link,
  onClose,
  onUpdate,
}: EditModalProps) {
  const [title, setTitle] = useState(link.title || "");
  const [description, setDescription] = useState(link.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setLoading(true);

    try {
      const success = await updateLink(
        link.id,
        title.trim(),
        description.trim()
      );
      if (success) {
        const updatedLink: LinkItem = {
          ...link,
          title: title.trim(),
        };
        onUpdate(updatedLink);
      } else {
        setError("Kunde ej uppdatera länken. Försök igen!");
      }
    } catch (err) {
      setError("Någontin gick fel vid uppdateringen.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //    <View style={styles.}>

  //         </View>
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.modalWrapper}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}> Redigera länk</Text>
                <Text style={styles.label}>Titel</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Titel"
                  placeholderTextColor={"#fafafa"}
                />
                <Text style={styles.label}>Beskrivning</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Beskrivning"
                  placeholderTextColor={"#fafafa"}
                  multiline
                />
                {error && <Text style={styles.errorText}>{error}</Text>}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                    disabled={loading}
                  >
                    <Text style={styles.buttonText}>Avbryt</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Spara</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  modalContainer: {
    minWidth: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    // maxHeight: "50%",
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "blue",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  saveButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalWrapper: {
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
