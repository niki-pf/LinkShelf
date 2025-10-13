import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import LinkCard from "@/components/LinkCard";
import { supabase, LinkItem } from "@/lib/supabase";

import { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 1. Hämta inloggad användare ELLER sätt till null/ladda
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  // 2. Användarens ID har ändrats (eller hittats) - hämta länkar och sätt upp lyssnare
  useEffect(() => {
    // Hoppa över om användaren inte är känd ännu (initial laddning)
    if (user === undefined) return;

    // Om vi inte har en användare, kan vi inte hämta länkar
    if (!user) {
      setError("Du måste vara inloggad för att se dina länkar.");
      setLoading(false);
      return;
    }

    const userId = user.id;

    // Funktion för att hämta data
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("links")
        // Filter: Hämta bara länkar för den faktiska inloggade användaren
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching links:", error.message);
        setError("Kunde inte hämta länkar: " + error.message);
        setLoading(false);
        return;
      }

      setLinks(data || []);
      setLoading(false);
    };

    // 3. Skapa en realtids-prenumeration (listener) INOM denna effekt
    const linksChannel = supabase
      .channel("links_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "links",
          filter: `user_id=eq.${userId}`,
        }, // FILTRERA PÅ ANVÄNDAR-ID
        (payload) => {
          console.log("Realtime change received. Refetching links.");
          fetchLinks();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          fetchLinks(); // Hämta initial data direkt vid prenumeration
        }
      });

    // Rensa upp realtidsprenumerationen när komponenten unmount
    return () => {
      supabase.removeChannel(linksChannel);
    };
  }, [user]); // Beroende på 'user' state

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Laddar länkar...</Text>
        </View>
      );
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    if (links.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Inga länkar sparade ännu. Börja lägga till!
        </Text>
      );
    }

    // Rendera listan med LinkCard-komp
    return (
      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LinkCard link={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <LinearGradient
      colors={["#1A2980", "#26D0CE"]} // Deep Blue till Cyan
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.contentArea}>
        <Text style={styles.headerText}>LinkShelf Dashboard</Text>
        <Text style={styles.subHeaderText}>Dina 5 Senaste Sparade Länkar</Text>

        {renderContent()}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    width: "100%",
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: "center",
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
    marginBottom: 20,
    fontWeight: "400",
  },
  listContent: {
    paddingBottom: 100, // Extra padding för att se sista kortet
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 200, // För att ge lite höjd i mitten av skärmen
  },
  loadingText: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#FFD1D1", // Ljus röd för felmeddelande
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
});
