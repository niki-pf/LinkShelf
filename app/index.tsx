import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "../lib/supabase";

export default function Index() {
  const [msg, setMsg] = useState("Laddar...");

  useEffect(() => {
    const testFetch = async () => {
      const { data, error } = await supabase.from("links").select("*");
      if (error) setMsg(" Fel: " + error.message);
      else setMsg("Fick " + (data?.length || 0) + " rader från Supabase");
    };
    testFetch();
  }, []);

  return (
    <View style={styles.center}>
      <Text>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
