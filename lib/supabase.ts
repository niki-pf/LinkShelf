import "react-native-url-polyfill/auto";
import { createClient, Session } from "@supabase/supabase-js";

// --- ÅTERGÅR TILL SÄKERHET: Läser nycklar från process.env (via app.config.js) ---
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// --------------------------------------------------------------------------------

// *******************************
// DEBUG LOGG: Kontrollera om variabler hittades från .env
console.log("--- SUPABASE CONFIG DEBUG (PRODUCTION MODE) ---");
console.log(`URL Found: ${!!supabaseUrl}`);
console.log(`Anon Key Length: ${supabaseAnonKey ? supabaseAnonKey.length : 0}`);
console.log("-----------------------------------------------");
// *******************************

if (!supabaseUrl || !supabaseAnonKey) {
  // Felkastning om nycklarna saknas. Detta kommer bara att inträffa om
  // din .env-fil inte läses in, vilket indikerar ett konfigurationsfel.
  throw new Error(
    "Supabase URL och Anon Key saknas. Kontrollera din .env-fil och att Expo läser in den."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Standardinställningar för Expo/React Native
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface LinkItem {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export { Session };
