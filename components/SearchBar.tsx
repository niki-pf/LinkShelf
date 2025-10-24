import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
  onClear: () => void;
};

export default function SearchBar({
  value,
  onChange,
  onClear,
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Feather name="search" size={20} color="#999" />
      <TextInput
        style={styles.input}
        placeholder="Sök bland länkar..."
        placeholderTextColor="#fafafa"
        value={value}
        onChangeText={onChange}
        autoFocus
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Feather name="x" size={20} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    color: "white",
  },
});
