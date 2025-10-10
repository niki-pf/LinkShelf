import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import Auth from "../components/Auth";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let mounted = true;

    // Hämta aktuell session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setSession(session);
    });

    // LYssna på ändringar i auth state
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setSession(session);
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Om vi INTE har session, visa Auth
  if (!session) {
    return (
      <View style={{ flex: 1 }}>
        <Auth />
      </View>
    );
  }

  // Om INLOGGAD, visa tillfällig placeholder
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Du är inloggad
      </Text>
    </View>
  );
}
