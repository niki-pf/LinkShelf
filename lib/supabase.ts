import "react-native-url-polyfill/auto";
import { createClient, Session } from "@supabase/supabase-js";

// --- TEMPORÄR NÖDÅTGÄRD: Hardkoda nycklarna pga. .env läsfel ---
// Dessa måste tas bort EFTER att Dashboard-koden är committad och mergad.
const supabaseUrl = "https://idxgcjvcdsxkinxixuoh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkeGdjanZjZHN4a2lueGl4dW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTc0NDIsImV4cCI6MjA3NTMzMzQ0Mn0.S1zY63OkiA9dy6_rL6HO88FWcJ34Ah7Loe--zMjlZYw";
// ----------------------------------------------------------------

// *******************************
// NY DEBUG LOGG: Kontrollera om variabler hittades från .env
console.log("--- SUPABASE CONFIG DEBUG ---");
console.log(`URL Found: ${!!supabaseUrl}`);
console.log(`Anon Key Length: ${supabaseAnonKey ? supabaseAnonKey.length : 0}`);
console.log("-----------------------------");
// *******************************

if (!supabaseUrl || !supabaseAnonKey) {
  // Detta fel ska nu ALDRIG nås tack vare hardkodningen.
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
