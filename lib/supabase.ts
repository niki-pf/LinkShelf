// const SUPABASE_URL = "https://idxgcjvcdsxkinxixuoh.supabase.co";
// const SUPABASE_ANON_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkeGdjanZjZHN4a2lueGl4dW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTc0NDIsImV4cCI6MjA3NTMzMzQ0Mn0.S1zY63OkiA9dy6_rL6HO88FWcJ34Ah7Loe--zMjlZYw";

// export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://idxgcjvcdsxkinxixuoh.supabase.co";
const supabasePublishableKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkeGdjanZjZHN4a2lueGl4dW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTc0NDIsImV4cCI6MjA3NTMzMzQ0Mn0.S1zY63OkiA9dy6_rL6HO88FWcJ34Ah7Loe--zMjlZYw";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
