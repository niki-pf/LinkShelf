# LinkShelf 🔗 Din Personliga Länksamling

En mobilapp utvecklad i **React Native (Expo)** och **Supabase**. Appens syfte är att låta användare spara webblänkar automatiskt. Huvudfokus ligger på **prestanda** och **effektiv datainsamling** genom att flytta den tunga uppgiften (metadata-skrapning) till en snabb **serverlös arkitektur (Edge Function)**.


---

## 📑 Innehåll
- 📖 [Om projektet](#-om-projektet)
- ✨ [Funktioner](#-funktioner)
- 🛠 [Teknologier](#-teknologier)
- ⚙️ [Installation](#-installation)
- 🚀 [Användning](#-användning)
- 📂 [Projektstruktur](#-projektstruktur)
- 📈 [Arbetsflöde](#-arbetsflöde)
- 🗓 [Sprintplan](#-sprintplan)
- 🤝 [Bidra](#-bidra)
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
## Funktioner
