import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

// FIX: Hårdkodade publika nycklar för att undvika Metro Caching Bug.
// Dessa nycklar är offentliga och säkra att ha här
const SUPABASE_URL = "https://idxgcjvcdsxkinxixuoh.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkeGdjanZjZHN4a2lueGl4dW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTc0NDIsImV4cCI6MjA3NTMzMzQ0Mn0.S1zY63OkiA9dy6_rL6HO88FWcJ34Ah7Loe--zMjlZYw";

// --- EXPO SecureStore Storage Adapter (Måste finnas för Supabase Auth) ---
// Supabase-klienten behöver ett sätt att spara tokens säkert, vilket
// SecureStore fixar i React Native/Expo-miljön.
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

// 3. Skapa och exportera Supabase-klienten
// Klienten initialiseras direkt med de hårdkodade nycklarna.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter as any, // Använd vår SecureStore adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Typdefinitioner för LinkShelf
export interface LinkItem {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description: string | null;
  image: string | null;
  created_at: string;
}

// export interface Category {
//   id: string;
//   title: string;
// }

// --- CLIENT-SIDE API FUNKTIONER ---

/**
 * Anropar Edge Function för att spara en länk och skrapa metadata.
 * @param url URL:en som ska sparas.
 * @returns Den sparade LinkItem eller null vid fel.
 */
export async function saveLink(url: string): Promise<LinkItem | null> {
  try {
    // Hämtar sessionen för att skicka JWT till Edge Function (Auth)
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("Session missing or error:", sessionError?.message);
      // Fortsätter utan JWT här eftersom Edge Function är konfigurerad att använda Service Role Key.
    }

    // Anropa Edge Function
    const { data, error } = await supabase.functions.invoke("meta-fetch", {
      body: { url },
    });

    if (error) {
      console.error("Edge Function Invocation Error:", error.message);
      return null;
    }

    const savedLink = data?.data?.[0];

    if (savedLink) {
      console.log("Link saved successfully via Edge Function.");
      return savedLink as LinkItem;
    }

    return null;
  } catch (e) {
    console.error(
      "An unexpected error occurred during saveLink:",
      (e as Error).message
    );
    return null;
  }
}

// hämtar alla läknar från db fär inloggad användare
export async function getLinks(): Promise<LinkItem[]> {
  try {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as LinkItem[];
  } catch (e) {
    console.error("error fetchin links", (e as Error).message);
    return [];
  }
}

// ta bort länk från db baserat på id.
export async function deleteLink(linkId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("links")
      .delete()
      .match({ id: linkId });
    if (error) throw error;

    return true;
  } catch (e) {
    console.error("unable to delete link", (e as Error).message);
    return false;
  }
}

//redigera länk

export async function updateLink(
  linkId: string,
  newTitle: string,
  newDescription: string
): Promise<boolean> {
  const { error } = await supabase
    .from("links")
    .update({
      title: newTitle,
      description: newDescription,
      // updated_at: new Date(),
    })
    .eq("id", linkId);

  if (error) {
    console.error("Error updating link", error);
    return false;
  }
  return true;
}
