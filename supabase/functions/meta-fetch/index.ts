// Importera Supabase klient för att kommunicera med databasen
import { createClient } from "jsr:@supabase/supabase-js@2";

import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

// Initialisera Supabase-klienten med miljövariabler
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  } catch (e) {
    // Ignorera fel, returnera null om URL:en är ogiltig
  }
  return { videoId: null, imageUrl: null };
}

// Huvudfunktionen som hanterar inkommande HTTP-anrop (POST)
Deno.serve(async (req) => {
  // Använd giltig placeholder UUID
  const user_id = "00000000-0000-0000-0000-000000000001";

  let inputUrl = "";

  // Variabler för metadata, initialiseras här för att kunna användas även om skrapningen misslyckas.
  let title: string;
  let description: string = "";
  let image: string = "";

  try {
    const body = await req.json();
    inputUrl = body.url;
    title = inputUrl; // Fallback title är alltid URL:en

    if (!inputUrl) {
      return new Response(JSON.stringify({ error: "URL är obligatorisk" }), {
        status: 400,
      });
    }

    const youtubeData = getYouTubeIdAndImage(inputUrl);
    // Sätt YouTube-bilden omedelbart som bästa fallback om den hittas
    image = youtubeData.imageUrl || ""; // --- 2. FÖRSÖK ATT SKRAPA METADATA ---

    // Vi lägger fetch/parsing i en egen try/catch för att hantera 429-fel (rate limit)
    // utan att krascha funktionen helt, vilket gör att vi fortfarande kan spara länken.
    try {
      const response = await fetch(inputUrl);

      if (!response.ok) {
        // Logga rate limit (429) eller andra fel, men låt funktionen fortsätta till DB-insättning.
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

        // Fallback till standard <title>-taggen
        const htmlTitle = document?.querySelector("title")?.textContent;

        // Sätt metadata med fallbacks
        title = ogTitle || htmlTitle || inputUrl;

        // Den robusta fallback-ordningen: OG -> Meta -> Första stycket
        description =
          ogDescription || metaDescription || firstParagraphText || "";

        // ENDAST uppdatera 'image' om vi INTE redan har en YouTube-bild
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

    console.log("Final Scraped Metadata:", {
      title,
      description,
      image,
      inputUrl,
    });
    // 3. SPARA DATA I DATABASEN (Med Service Role Key)

    // Vi kommer hit även om skrapningen misslyckades i steg 2, vilket förhindrar krasch på 429.
    const { data: insertedData, error: insertError } = await supabase
      .from("links")
      .insert([
        {
          user_id,
          url: inputUrl,
          title,
          description,
          image,
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
