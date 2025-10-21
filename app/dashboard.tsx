import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase, LinkItem, getLinks, deleteLink } from "@/lib/supabase";
// import { User } from "@supabase/supabase-js";
import LinkCard from "@/components/LinkCard";
import SaveLinkInput from "@/components/SaveLinkInput";
import { Feather } from "@expo/vector-icons";

export default function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); //pull to refres

  //lägga till ny länk i listan
  const handleLinkSaved = (newLink: LinkItem) => {
    setLinks((prev) => [newLink, ...prev]);
  };

  // 1 funciton för att hämta länkar
  const fetchLinks = useCallback(async () => {
    setRefreshing(true);

    const fetchedLinks = await getLinks();
    setLinks(fetchedLinks);

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  //2 radera länk

  const handleDelete = (linkId: string) => {
    Alert.alert(
      "Bekräfta radering",
      "Är du säkr på att du vill ta bort denna länk?",
      [
        {
          text: "Avbryt",
          style: "cancel",
        },
        {
          text: "ta bort",
          onPress: async () => {
            const success = await deleteLink(linkId);

            if (success) {
              setLinks((prev) => prev.filter((link) => link.id !== linkId));
            } else {
              Alert.alert("Fel", "Kunde ej ta bort, försök igne");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  //sign out
  const handleSignout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Fel vid utloggning", error.message);
    }
    setLoading(false);
  };

  // rendera content

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}> Laddar länkar...</Text>
        </View>
      );
    }
    if (links.length === 0 && !refreshing) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>
            {" "}
            Inga sparade länkar ännu. Lägg till en!
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LinkCard link={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchLinks} />
        }
      />
    );
  };

  return (
    <LinearGradient
      colors={["#1A2980", "#26D0CE"]}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.contentArea}>
        {/* header med logga ut knapp */}
        <View style={styles.header}>
          <Text style={styles.headerText}>LinkShelf</Text>
          <TouchableOpacity
            onPress={handleSignout}
            style={styles.signOutButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Feather name="log-out" size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          {/* <Text style={styles.subHeaderText}>
        Välkommen tillbaka, {user ? user.email : "Användare"}!
      </Text> */}
        </View>
        <SaveLinkInput onLinkSaved={handleLinkSaved} />
        {renderContent()}
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  contentArea: {
    flex: 1,
    width: "100%",
    paddingTop: 0,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 28,
    color: "white",
    fontWeight: "800",
    marginBottom: 5,
  },
  subHeaderText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 30,
    fontWeight: "400",
    alignSelf: "flex-start",
  },
  listContent: {
    paddingBottom: 200,
    width: "100%",
  },
  centered: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#FFD1D1",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  emptyText: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    padding: 20,
    fontSize: 16,
    marginTop: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
  },
  signOutButton: {
    padding: 5,
  },
});
