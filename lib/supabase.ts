import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

// Läs din Supabase URL och Anon Key från Expo Environment Variables.
// Se till att dessa variabler finns definierade i din .env-fil och app.config.js
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

// --- SecureStore Adapter för React Native ---
// Supabase Auth behöver en asynkron lagringsadapter
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};
// ------------------------------------------

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter as any, // Använd vår SecureStore-adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Typdefinition för databasen (viktigt för TypeScript-säkerhet)
export interface LinkItem {
  id: string;
  // created_at är en automatisk tidsstämpel som läggs till av Supabase/PostgreSQL.
  // Den är nödvändig för sortering i Dashboard.
  created_at: string;
  url: string;
  title: string;
  description: string;
  image: string | null;
  user_id: string;
}
