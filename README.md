# LinkShelf 🔗 Din Personliga Länksamling

En **mobilapp** för att **spara**, **organisera** och **redigera** webblänkar. Byggd med **React Native (Expo)** och **Supabase**, med automatisk hämtning av **metadata**.
<img width="1536" height="1024" alt="ChatGPT Image 10 okt  2025 10_18_21" src="https://github.com/user-attachments/assets/94160e4f-8e63-4b7e-b719-6ffc1e8802c9" />



---

## 📑 Innehåll
- 📖 [Om projektet](#-om-projektet)
- ✨ [Funktioner](#-funktioner)
- 🛠 [Teknologier](#-teknologier)
- ⚙️ [Installation](#-installation)
- 🚀 [Användning](#-användning)
- 📈 [Arbetsflöde](#-arbetsflöde)
- 🗓 [Sprintplan](#-sprintplan)
- 📚 [Lärdomar](#-lärdomar)
- 📜 [Licens](#-licens)
- 🚀 [Utvecklingsmöjligheter](#-utvecklingsmöjligheter)

---

## 📖 Om projektet

Idén till appen kom från mitt eget behov: jag sparar ofta länkar i en WhatsApp-chatt med mig själv, men det blir snabbt svårt att söka efter dem. Med LinkShelf kan man spara länkar, redigera titlar och söka bland dem. I framtiden planerar jag även att lägga till kategorier för att organisera länkarna bättre.

Appen är byggd i **React Native**, **TypeScript** och använder **Supabase** som databas och för autentisiering. **Edge Functions** används för att hämta **metadata** från länkar automatiskt.

### Varför inte regex?

Till en början funderade jag på att enbart använda regex för att extrahera information från länkar. Men vissa sidor, som YouTube, går inte att skrapa på ett enkelt sätt med regex, vilket ledde till att jag valde Edge Functions. I praktiken gick det ändå inte att hämta all metadata med enbart Edge Functions – för fullständig data hade man behövt ytterligare logik utanför min nuvarande kunskap. Regex hade kanske räckt för enklare sidor, men Edge Functions gör lösningen mer flexibel och robust för mer komplexa eller dynamiska sidor.

---
## ✨ Funktioner

- Inloggning med autentisiering
- Registrering med bekräftelsemail
- Spara länkar
- Redigera titlar för att göra dem mer beskrivande
- Sökfunktion för att hitta specifika länkar
- Ta bort länkar

---

## 🛠 Teknologier

### Frontend:
- [React Native](https://reactnative.dev/) Ramverk för att bygga mobilappar med React.  
- [TypeScript](https://www.typescriptlang.org/docs/) Starkt typat språk som används för säkrare och mer strukturerad kod.
### Backend: 
- [Supabase](https://supabase.com/docs) Backend som hanterar databasen och autentisering.  
- [Edge Functions](https://supabase.com/docs/guides/functions) Serverlösa funktioner för att hämta metadata från länkar.

### Emulator, Utecklingsmiljö
- [Expo](https://docs.expo.dev/) Verktyg för att snabbt köra och testa React Native-appar.  
- [Android Studio](https://developer.android.com/studio)  Android-emulator för att testa appen på olika enheter.

---

## ⚙️ Installation
Följ stegen nedan för att köra appen lokalt på din dator eller mobil.

```bash
#1. Klona repo
git clone https://github.com/niki-pf/LinkShelf

#2. Gå in i projektmappen
cd LinkShelf

#3. Installera beroenden
npm install

#4. Installera Expo CLI (om du inte redan har det)
npm install -g expo-cli

#5. Starta utvecklingsserver
expo start
```

### 6. Köra appen

**På mobil:**

Ladda ner Expo Go-appen från App Store eller Google Play.

Scanna QR-koden som visas i terminalen eller webbläsaren.

**På emulator:**

Starta Android Studio eller iOS Simulator.

**Välj "Run on emulator" i Expo.**


### ⚠️ **Tips / krav**

**Node.js version 16** eller högre

**Expo Go app** på mobil om du inte använder simulator

**Android Studio** eller **Xcode** för att köra emulator

---

## 🚀 Användning

#### 1. Inloggning / Registrering
- **Registrera nytt konto:**  
  Ange e-postadress och lösenord, tryck på **Sign Up**.  
  Vänta på bekräftelsemejl och bekräfta länken i mejlet.  

- **Logga in:**  
  Ange din e-postadress och lösenord, tryck på **Log In**.  


#### 2. Dashboard
- **Senast sparade länkar:**  
  Här visas de senaste länkarna du sparat.  

- **Lägg till ny länk:**  
  Klistra in en länk i fältet och tryck på **Spara**.  

- **Redigera länk:**  
  Tryck på pennikonen för en länk.  
  Redigera titel och/eller beskrivning, sedan **Spara** eller **Avbryt**.  

- **Ta bort länk:**  
  Tryck på papperskorgen.  
  Bekräfta eller avbryt raderingen.  

- **Logga ut:**  
  Tryck på logga ut-knappen uppe till höger.  

- **Se alla länkar:**  
  Tryck på **Se alla →** för att komma till söksidan med alla sparade länkar.  


#### 3. Search-sidan (alla länkar)
- **Sökfält:**  
  Skriv i fältet för att filtrera länkar, listan uppdateras direkt med matchningar.  

- **Redigera / uppdatera länkar:**  
  Samma som i dashboard: tryck på pennan för att redigera titel/beskrivning.  

- **Ta bort länkar:**  
  Tryck på papperskorgen, bekräfta eller avbryt.  

- **Back-knapp:**  
  Tryck på bakåtknappen för att återvända till dashboard.

---

## 📈 [Arbetsflöde]

🗓 **Veckovis planering** – Projektet planerades i korta iterationer (”mini-sprintar”) där veckans fokus och mål definierades, till exempel att implementera en viss funktion eller lösa buggar.

📋 **GitHub Projects** som planeringsstöd – Använde GitHub Projects för att strukturera arbetet, skapa kort för olika uppgifter och hålla koll på framstegen under utvecklingen.

🌱 **Feature branches** – Nya funktioner och förbättringar utvecklades i separata branches för att hålla main-branchen stabil och ren. När funktionaliteten testats mergades den in i main via pull requests.

---
## 🗓 [Sprintplan](#-sprintplan)

### Vecka 1 – Projektuppstart & Designplanering
- Skapa övergripande designskisser i Figma.
- Säkerställ att alla miljöer fungerar och kommunicerar korrekt: Supabase, Expo, Edge Functions och Android Studio.
- Konfigurera lokal utvecklingsmiljö (aktivera virtualisering, SDK-installationer m.m.).
- Sätt upp projektstruktur och mappar.
- Implementera grundläggande autentisering/inloggning.


### Vecka 2 – Komponentuppdelning & Implementering
- Bryt ned applikationen i mindre, återanvändbara komponenter.
- Implementera funktionalitet steg för steg enligt prioriterad ordning.
- Säkerställ att UI och logik fungerar ihop.
- Börja testa flöden mellan olika vyer.

### Vecka 3 – Finputs & Avrundning
- Felsök och fixa buggar.
- Förbättra UI/UX och användarflöden.
- Skriv README och dokumentation.
- Förbered projektet för inlämning/demonstration.


---
## 📚 [Lärdomar](#-lärdomar)
- **React Native** – Jag fick praktisk erfarenhet av React Native. Det påminner om React JS, men det finns nya koncept och mobil-specifika utmaningar som var roliga att utforska.
- **Miljökonfiguration & virtualisering** – En stor del av projektet handlade om att få alla miljöer att prata med varandra (Expo, Android Studio, Supabase, Edge Functions). Det var mycket felsökning som inte alltid handlade om själva koden, men det gav mig en större förståelse för hur allt hänger ihop.
- **Backend-tänk** – Jag lärde mig hur databaser, autentisering och serverfunktioner kan integreras med frontend, och fick en bättre känsla för hur backend-flöden fungerar i praktiken.
- **UI/UX för mobil** – Att fokusera på mobil gjorde att jag fick tänka om kring UI/UX, och jag fick större förståelse för hur viktigt det är med användarvänligt gränssnitt på mobil.

Helhetsperspektiv – Genom projektet har jag fått större insikt i hur frontend, backend och olika miljöer kan samspela i ett komplett system.

---
## 📜 [Licens](#-licens)

Detta projekt är utvecklat i utbildningssyfte och är inte avsett för produktion.

---
## 🚀 [Utvecklingsmöjligheter](#-utvecklingsmöjligheter)

Några idéer för framtida förbättringar och vidareutveckling av projektet:

- 🔑 **Lösenordsåterställning (Password Recovery)** – möjliggöra att användare kan återställa sitt konto via e-post.
- 🗂️ **Kategorier** – skapa och spara länkar i olika kategorier för bättre överblick.
- 🔗 **Dela-knapp** – snabbt kunna kopiera eller dela en sparad länk vidare till andra appar.
- 🏷️ **Taggar** – låta användare lägga till taggar för att beskriva innehållet mer specifikt.
- 🔍 **Filtrering & sortering** – kunna filtrera och sortera länkar baserat på t.ex. kategori, tagg eller datum.
- ⭐ **Favoriter** – markera viktiga länkar som favoriter för snabb åtkomst.
- ☁️ **Offline-stöd** – cacha sparade länkar lokalt så de kan visas utan internetuppkoppling.
- 🧭 **Förhandsvisning av länkar** – visa en liten preview (bild, titel, beskrivning) när man sparar en ny länk.
