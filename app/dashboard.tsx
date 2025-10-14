import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase, LinkItem } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export default function Dashboard() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(undefined as unknown as User);

  // 1. Hämta inloggad användare
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 2. funciton för att hämta länkar
  const fetchLinks = async () => {
    if (!user) return; // Gör inget om user inte är inloggad

    setLoading(true);

    setLoading(false);
  };

  useEffect(() => {}, [user]);

  const renderContent = () => {
    if (loading || user === undefined) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Laddar...</Text>
        </View>
      );
    }

    if (!user) {
      return <Text style={styles.errorText}>Vänligen logga in igen.</Text>;
    }

    if (links.length === 0) {
      return (
        <Text style={styles.emptyText}>
          Din lista är tom! Börja spara länkar genom att trycka på "lägg till"
        </Text>
      );
    }

    return (
      <FlatList
        data={links}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.loadingText}>{item.title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
        <Text style={styles.headerText}>Dashboard</Text>
        <Text style={styles.subHeaderText}>
          Välkommen tillbaka, {user ? user.email : "Användare"}!
        </Text>

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
});
