// Importera Supabase klient för att kommunicera med databasen
import { createClient } from "jsr:@supabase/supabase-js@2";

// Importera HTML-parsern (deno_dom) för att pålitligt läsa HTML
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

// Initialisera Supabase-klienten med miljövariabler
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- AGGRESSIV LOGGNING VID START ---
console.log(
  `booted (URL present: ${!!supabaseUrl}, Service Key present: ${!!supabaseKey})`
);
// -------------------------------------

/**
 * Hjälpfunktion för att extrahera YouTube video ID och konstruera thumbnail-URL.
 * @param url Den inkommande URL:en.
 * @returns Video ID och den konstruerade thumbnail-URL:en.
 */
function getYouTubeIdAndImage(url: string): {
  videoId: string | null;
  imageUrl: string | null;
} {
  try {
    const urlObj = new URL(url);

    // 1. Hantera standardlänkar (watch?v=videoId)
    const videoId = urlObj.searchParams.get("v");

    if (videoId) {
      // YouTube thumbnail-format: https://img.youtube.com/vi/{videoId}/hqdefault.jpg
      const imageUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      return { videoId, imageUrl };
    }

    // 2. Hantera kortlänkar (youtu.be/videoId)
    if (urlObj.hostname === "youtu.be" && urlObj.pathname.length > 1) {
      const shortId = urlObj.pathname.substring(1);
      const imageUrl = `https://img.youtube.com/vi/${shortId}/hqdefault.jpg`;
      return { videoId: shortId, imageUrl };
    }

    //3. hantera youtube shorts
    if (urlObj.pathname.startsWith("/shorts")) {
      const parts = urlObj.pathname.split("/");
      const shortId = parts[2];
      if (shortId) {
        const imageUrl = `https://img.youtube.com/vi/${shortId}/hqdefault.jpg`;
        return { videoId: shortId, imageUrl };
      }
    }
  } catch (e) {
    // Ignorera fel, returnera null om URL:en är ogiltig
  }
  return { videoId: null, imageUrl: null };
}

// Huvudfunktionen som hanterar inkommande HTTP-anrop (POST)
Deno.serve(async (req) => {
  // --- FIX FÖR RLS: HÄMTA DET RIKTIGA USER ID:T FRÅN JWT ---
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: "Authorization header saknas" }),
      { status: 401 }
    );
  }
  const jwt = authHeader.split(" ")[1];

  // Få användaren från JWT (med Service Role Key)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(jwt);

  if (userError || !user) {
    // Returnera 401 om token är ogiltig eller utgången
    return new Response(
      JSON.stringify({ error: "Ogiltig eller utgången JWT. Logga in igen." }),
      { status: 401 }
    );
  }

  const user_id = user.id; // ANVÄND RIKTIGT ANVÄNDAR-ID
  // --- SLUT PÅ USER ID FIX ---

  let inputUrl = "";
  // KATEGORI KOMMENTAR: Variabeln category_id har tagits bort för aatt fokusera på
  // huvudfunktionaliteten innan deadline. Koden för att hämta category_id
  // från request body fanns här.

  // Variabler för metadata, initialiseras här för att kunna användas även om skrapningen misslyckas.

  let title: string;
  let description: string = "";
  let image: string = "";

  try {
    const body = await req.json();
    inputUrl = body.url;
    // KATEGORI KOMMENTAR: Koden för att hämta category_id från request body fanns här:
    // const category_id = body.category_id || null;
    title = inputUrl; // Fallback title är alltid URL:en

    if (!inputUrl) {
      return new Response(JSON.stringify({ error: "URL är obligatorisk" }), {
        status: 400,
      });
    }

    const youtubeData = getYouTubeIdAndImage(inputUrl);
    // Sätt YouTube-bilden omedelbart som bästa fallback om den hittas
    image = youtubeData.imageUrl || ""; // --- 2. FÖRSÖK ATT SKRAPA METADATA ---

    try {
      const response = await fetch(inputUrl);

      if (!response.ok) {
        console.warn(
          `Scraping attempt failed for ${inputUrl} with status: ${response.status}. Using fallback data.`
        );
      } else {
        const html = await response.text();

        const parser = new DOMParser();
        const document = parser.parseFromString(html, "text/html");

        // Hjälpfunktioner för att hämta meta-taggar
        const getMetaContent = (property: string) =>
          document
            ?.querySelector(`meta[property="${property}"]`)
            ?.getAttribute("content");

        const getMetaNameContent = (name: string) =>
          document
            ?.querySelector(`meta[name="${name}"]`)
            ?.getAttribute("content");

        // Hämta metadata
        const ogTitle = getMetaContent("og:title");
        const ogDescription = getMetaContent("og:description");
        const ogImage = getMetaContent("og:image");
        const metaDescription = getMetaNameContent("description");

        // --- Hämta första stycket text (fallback) ---
        const firstParagraphElement = document?.querySelector("p");
        let firstParagraphText = "";

        if (firstParagraphElement) {
          firstParagraphText = firstParagraphElement.textContent || "";
          // Korta ner texten om den är för lång
          if (firstParagraphText.length > 300) {
            firstParagraphText =
              firstParagraphText.trim().substring(0, 300) + "...";
          } else {
            firstParagraphText = firstParagraphText.trim();
          }
        }
        // ---------------------------------------------------

        // Fallback till standard <title>-taggen
        const htmlTitle = document?.querySelector("title")?.textContent;

        // Sätt metadata med fallbacks
        title = ogTitle || htmlTitle || inputUrl;

        // Den robusta fallback-ordningen: OG -> Meta -> Första stycket
        description =
          ogDescription || metaDescription || firstParagraphText || "";

        // ENDAST uppdatera 'image' om vi INTE redan har en YouTube-bild (som är säkrare)
        if (!youtubeData.imageUrl) {
          image = ogImage || "";
        }
      }
    } catch (e) {
      console.error(
        "Scraping failed due to network error or parsing error:",
        (e as Error).message
      );
      // title, description, and image behåller sina initiala/fallback-värden.
    }
    if (youtubeData.videoId) {
      if (
        !description ||
        description.length < 15 ||
        description.toLowerCase().includes("auf youtube findest du")
      ) {
        description = "En YouTube video. Öppna länken för att titta.";
      }
    }

    console.log("Final Scraped Metadata:", {
      title,
      description,
      image,
      inputUrl,
      user_id,
    }); // 3. SPARA DATA I DATABASEN

    const { data: insertedData, error: insertError } = await supabase
      .from("links")
      .insert([
        {
          user_id,
          url: inputUrl,
          title,
          description,
          image,
          // KATEGORI KOMMENTAR: category_id togs bort härifrån i sista minuten
          // för att lämna in projektet i tid. Detta är en framtida feature.
        },
      ])
      .select();

    if (insertError) throw insertError;

    console.log("Database Insertion SUCCESS."); // 4. ÅTERKOPPLA TILL KLIENTEN med den sparade datan

    return new Response(JSON.stringify({ data: insertedData }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    // --- KRITISK LOGGNING ---
    console.error("Edge Function Fatal Error:", (error as Error).message);
    console.error(
      "Full Error Object:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    ); // -----------------------
    return new Response(
      JSON.stringify({
        error:
          "Internal Server Error during initial processing or database insertion.",
      }),
      { status: 500 } // Returnerar 500 vid fel
    );
  }
});
