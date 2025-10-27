import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { getLinks, LinkItem, deleteLink } from "@/lib/supabase";
import LinkCard from "@/components/LinkCard";
import SearchBar from "@/components/SearchBar";
import { useRouter } from "expo-router";
import EditModal from "@/components/EditModal";

export default function SearchScreen() {
  const [allLinks, setAllLinks] = useState<LinkItem[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [selectedLink, setSelectedLink] = useState<LinkItem | null>(null);
  const [isEditVisible, setIsEditVisible] = useState(false);

  //hämta alla länkar
  const fetchLinks = useCallback(async () => {
    setRefreshing(true);

    const fetchedLinks = await getLinks();
    setAllLinks(fetchedLinks);
    setFilteredLinks(fetchedLinks);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  //filtrera när searchterm ändras
  useEffect(() => {
    if (searchTerm.trim().length === 0) {
      setFilteredLinks(allLinks);
      return;
    }
    const lower = searchTerm.toLocaleLowerCase();
    const filtered = allLinks.filter(
      (item) =>
        item.title?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower)
    );
    setFilteredLinks(filtered);
  }, [searchTerm, allLinks]);

  const handleDelete = async (linkId: string) => {
    Alert.alert(
      "Bekräfta radering",
      "Är du säker på att du vill ta bort denna länk?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Ta bort",
          onPress: async () => {
            const success = await deleteLink(linkId);
            if (success) {
              setAllLinks((prev) => prev.filter((l) => l.id !== linkId));
              setFilteredLinks((prev) => prev.filter((l) => l.id !== linkId));
            } else {
              Alert.alert("Fel", "Kunde inte ta bort länken. Försök igen");
            }
          },
          style: "destructive",
        },
      ]
    );
    // await deleteLink(linkId);
    // setAllLinks((prev) => prev.filter((l) => l.id !== linkId));
    // setFilteredLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  const handleEdit = (link: LinkItem) => {
    setSelectedLink(link);
    setIsEditVisible(true);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Laddar länkar...</Text>
        </View>
      );
    }
    if (filteredLinks.length === 0 && !refreshing) {
      return (
        <View>
          <Feather name="search" size={30} color="#fff" />
          <Text style={styles.emptyText}>Inga resultat hittades.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={filteredLinks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LinkCard
            link={item}
            onDelete={handleDelete}
            onEdit={() => handleEdit(item)}
          />
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
      <View style={styles.contentWrapper}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{ width: 24 }} />
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                alignSelf: "flex-end",
                flexDirection: "row",
              }}
            >
              <Text style={{ color: "white" }}>Tillbaka</Text>
              {/* <Text style={styles.goBackText}> Tillbaka</Text> */}
              <Feather name="arrow-left" size={24} color={"#fff"} />
            </TouchableOpacity>
          </View>

          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
          />
          <Text style={styles.headerText}> Alla länkar </Text>
          {renderContent()}
        </View>
      </View>
      {selectedLink && (
        <EditModal
          isVisible={isEditVisible}
          link={selectedLink}
          onClose={() => setIsEditVisible(false)}
          onUpdate={(updated) => {
            setAllLinks((prev) =>
              prev.map((l) => (l.id === updated.id ? updated : l))
            );
            setFilteredLinks((prev) =>
              prev.map((l) => (l.id === updated.id ? updated : l))
            );
            setIsEditVisible(false);
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 20,
    color: "white",
    fontWeight: "700",
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 200,
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  emptyText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  //   goBackText: {
  //     color: "rgba(255,255,255,0.8)",
  //     fontSize: 14,
  //   }
  contentWrapper: {
    flex: 1,
    width: "100%",
    paddingTop: 0,
    paddingHorizontal: 20,
  },
});
