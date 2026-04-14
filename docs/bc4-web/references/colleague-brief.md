# Brief od kolegy — `Web BC4Cloud.docx`

**Zdroj:** Interní dokument od kolegy z BusinessCom, nahráno 2026-04-14.
**Originál:** `colleague-brief-original.docx` (ve stejné složce)
**Typ:** Seed brief, primární source pro obsahovou architekturu. **Ne závazný design directive** — obsahuje konverzně problematické body, které potřebujeme pushbacknout.

Níže je obsah brief dokumentu přepsaný do čitelného markdownu + **moje komentáře** k tomu, co dává smysl, co ne, a jak s tím naložíme.

---

## Obsah od kolegy

### Cíl webu
- **Primární:** Generovat poptávky. Současný web je technický, pro úzkou skupinu co už ví co hledá — potřeba přetočit na obchod.
- **Sekundární:** Edukace trhu (co je moderní kontaktní centrum).

**Fáze 1:** Po vyplnění poptávky → validace zákazníka → kontakt obchodníka → uzavření.
**Fáze 2:** Vyklikaná konfigurace licencí → cenová nabídka → odsouhlasení podmínek → platební brána → zřízení služby.

> ✅ **Moje pozn.:** Plně v souladu s tím, co máme ve `strategy.md`. Potvrzuje směr. Fáze 2 (self-service) zůstává pro pozdější iteraci, MVP končí u odeslaného formuláře.

---

### Homepage — návrh kolegy

**Hlavní nadpis:**
> "BC4Cloud — Získejte pod kontrolu veškerou komunikaci se zákazníky"

**Podnadpisy (4×, každý s obrázkem):**
1. Jedno řešení pro firmy všech velikostí — bez složité infrastruktury
2. Zvyšte zákaznickou spokojenost
3. Spravujte hovory, týmy i výkon v reálném čase — odkudkoliv
4. Přehledný systém pro kompletní komunikaci — sjednoťte telefon, email, SMS, chat, WhatsApp do jednoho řešení

**CTA:**
- Video z praktické ukázky hovoru + AI shrnutí + předání obchodníkovi
- "Demo bych zatím nedával, zákazníci si s tím nevědí moc rady."
- "Domluvte si ukázku řešení (pro Vaši firmu)" → validační formulář

**Poptávkový formulář — pole:**
- IČ (validace ARES)
- Email (validace)
- Telefon (validace)
- Kolik lidí komunikuje se zákazníky
- Backend kontroly: existence firmy, zda není stávajícím zákazníkem přes TM/O2, zda nemá HW ústřednu od BC

**Po odeslání:** "Po odeslání formuláře vás budeme kontaktovat obvykle do několika minut."

> 🟡 **Moje pozn. #1 — hero se 4 podnadpisy:** Tohle je klasický anti-pattern. 4 sdělení na homepage nad foldem = žádné sdělení. Výzkum (NN/g, CXL, Unbounce 2024) ukazuje, že carousely a multi-message hero snižují konverzi oproti jednoznačnému single-message hero. **Co uděláme místo toho:** Vybereme **jeden** nejsilnější benefit jako hero (nejspíš **sjednocení kanálů do jednoho rozhraní** — to je nejkonkrétnější a nejvíc diferencující). Zbylé tři podnadpisy použijeme níže jako trojlístek benefitů v sekci 3 homepage, každý s vlastním vizuálem. Stejný obsah, lepší konverze.

> 🟡 **Moje pozn. #2 — formulář bez jména:** Kolega tam správně nedává jméno kontaktní osoby (i když ho může chtít). Držíme se toho — 4 pole jsou sweet spot, každé další pole = −15% konverze (Unbounce data).

> 🟢 **Moje pozn. #3 — demo zatím ne:** Souhlasím. Demo bez onboardingu v kontaktně centrální SaaS = ztrata. Až fáze 2+.

> 🟢 **Moje pozn. #4 — video z reálného hovoru:** Skvělý nápad. Product-as-marketing pattern (Linear playbook). Ale podmínka: **žádný autoplay**. Uživatel klikne, video spustí. Jinak zabíjí LCP, bere pozornost od CTA a na mobilu se stejně nespustí.

---

### Sekce "Jaké problémy řešíme" / "Co Vám BC4Cloud přinese"

**Benefity (bullet list):**
- Více vyřízených požadavků bez navýšení týmu
- Méně ztracených hovorů = více zakázek
- Kratší čekací doby zákazníků
- Vyšší produktivita zaměstnanců
- Lepší zákaznická zkušenost
- Plná kontrola nad komunikací

**Text:** "BC4 sjednocuje veškerou zákaznickou komunikaci do jednoho systému a umožňuje ji automatizovat."

**CTA:** "Zjistit jak funguje BC4" (video)

> 🟡 **Moje pozn. #5 — bullet list bez čísel:** Klasická B2B bolest. Každý z těchto bulletů je generický a platí pro kteréhokoliv konkurenta. Musíme je přepsat s konkretitou:
>
> - "Více vyřízených požadavků" → "Agenti zvládnou o 18% víc hovorů za směnu díky smart routing a auto-summary."
> - "Méně ztracených hovorů" → "Callback fronta dovolá zpět zákazníkům, které by jinak ztratili. Typicky 12–25% záchrana."
> - "Kratší čekací doby" → "IVR a skill-based routing zkracují čekání z průměrných 2:30 na 0:45."
>
> Čísla musí být reálná, ne vymyšlená. Pokud nemáme interní data, použijeme průměry z case studies — a ověříme se zákazníky.

> 🔴 **Moje pozn. #6 — duplicita s "Proč firmy nasazují BC4":** Tahle sekce + sekce "Přínosy pro firmu" níže je **dvakrát to samé**. Rychlejší podpora, nižší náklady, lepší zákaznická zkušenost, plná kontrola — obě sekce mají ±shodný obsah. **Co uděláme:** Spojíme do jedné sekce, odstraníme redundanci. Homepage má na seznamu 11 sekcí (viz `information-architecture.md`), každá má unikátní job. Duplikáty kradou pozornost.

---

### Sekce "Jak BC4 funguje" (3 úrovně produktu)

**Volání:**
- Dosloužila stará analogová ústředna, potřeba náhrady
- Přehled hovorů, chytrá telefonie, statistiky, nahrávky, IVR
- Rychlé nasazení bez velkých investic

**Kontaktní centrum (Omnichannel):**
- Telefon, email, chat, SMS, sociální sítě v jednom
- Inteligentní směrování
- AI voicebot/chatbot + tiketovací systém (???)
- Automatizace rutinních požadavků

> 🟢 **Moje pozn. #7 — 3 úrovně produktu:** Přesně v souladu s IA. Jeden z nejsilnějších patternů brief dokumentu. Tohle je ta "ladder" do placeného AI tieru — user začne s Voláním, upgraduje na CC, přidá AI. Pěkně to ukazuje modularitu.

> 🟡 **Moje pozn. #8 — "tiketovací systém???":** Otevřená otázka z brief. V projektové dokumentaci `bc4cloud-web-dokumentace.html` je to označeno jako otázka #2 ("bude součástí nového webu?"). **Návrh:** nesypat to na homepage dokud není jasné, jestli produkt existuje a je stabilní. V MVP homepage držíme 3 vrstvy (Volání, CC, AI) — ticketing zmíníme na AI stránce pokud bude existovat.

---

### Sekce "Pro jaké firmy je řešení vhodné"

Segmenty: E-commerce, Servisní firmy, Banky a finance, Telco operátoři.

> 🟢 **Moje pozn. #9:** Souhlasím. Persona selfselection je proven pattern (Equals, Notion). Každý segment potřebuje **jednovětnou specifickou hlášku**, ne jen "rychlá zákaznická podpora při objednávkách". Například:
> - E-commerce: "Peak season škálování bez navýšení agentů. Callback z chyby košíku."
> - Servisní firmy: "Hovor od technika v terénu na mobilu přes WebRTC, se zákazníkovou historií v jedné obrazovce."
> - Banky a finance: "Audit trail na každý hovor, šifrovaná nahrávka, PCI/GDPR compliant."
> - Telco: "Odchozí prediktivní dialer pro retention kampaně. Statistiky přímo ke směně."

---

### Sekce "Reference"

- Loga klientů
- Krátké citace
- Příklad: "Díky BC4 jsme zkrátili čekací dobu zákazníků a výrazně zlepšili zákaznickou spokojenost"

> 🔴 **Moje pozn. #10 — generická citace:** Tento příklad citace je **přesně to, co nechceme**. Žádný čtenář se k ní nepřipoutá, protože nemá konkrétnost. Musíme sehnat reálné citace od reálných klientů (se jmény, pozicemi, firmou). Forma dobré citace:
>
> > "Před BC4Cloud jsme měli callback rate 8%. Po nasazení jsme během 3 měsíců dostali na 32%. To je 24 procentních bodů hovorů, co by nám jinak uteklo."
> > — **Petra Nováková**, vedoucí call centra, [Firma] s.r.o.
>
> Pokud neseženeme reálné s čísly, **necháme sekci prázdnou a použijeme ji později**. Lepší mít 2 silné reference než 8 slabých placeholder citací.

---

### Sekce "Výzva k akci" (druhý inline formulář)

> **"Toto je nejdůležitější část webu."**

Nadpis: "Zjistěte, jak může BC4 zlepšit vaši zákaznickou podporu"
Text: "Vyplňte krátký formulář a náš specialista vás bude kontaktovat."

Formulář identický s hlavním (IČ, email, telefon, počet lidí, backend kontroly).

> 🟢 **Moje pozn. #11:** V souladu s IA (sekce 8 homepage = inline formulář). Potvrzuje důležitost. Použijeme stejný `LeadForm` komponent znovu, ne copy-paste.

---

### Sekce "Důvěra" — Proč spolupracovat s námi

- Desítky let zkušeností ???
- Stovky realizací ????
- Česká podpora
- Flexibilní řešení

> 🔴 **Moje pozn. #12 — "???":** Kolega sám označil čísla otazníky. Tahle čísla MUSÍME ověřit s vedením BusinessComu. Když přesná čísla vyjdou menší, než se čeká, pořád je lepší napsat "18 let na trhu" než "desítky let", protože konkrétnost je silnější než vágnost. Pokud čísla jsou velká, ještě lepší: "23 let, 150+ realizací, 5 000+ agentů na platformě."

> 🟡 **Moje pozn. #13 — "flexibilní řešení":** Slovní vata. Každý to říká. **Nahradíme konkrétností:** "Začnete 5 agenty, rostete na 500. Bez re-kontraktace." nebo "Přidáte kanál v pár kliknutích. Žádné změnové řízení."

---

### Obecná pravidla od kolegy

- ✅ CTA tlačítko stále viditelné (sticky)
- ✅ Formulář 2× na stránce (střed + konec)
- ✅ Video v polovině stránky

> 🟢 **Moje pozn. #14:** Všechny tři jsou v souladu s `strategy.md` § 7 a `information-architecture.md` § 9. Potvrzujeme.

---

## Shrnutí: co z briefu bereme, co ne

### ✅ Bereme v plné míře
- Cíle (primární lead-gen, sekundární edukace)
- Fázování (MVP = lead form, fáze 2 = self-service)
- 3 produktové vrstvy (Volání → CC → AI) jako páteř produktového příběhu
- 4 pole ve formuláři + backend validace přes ARES / duplicitní zákazníci
- Sticky CTA, 2× inline formulář na homepage, video uprostřed
- Cross-sell přes segmenty (E-commerce, Servisní, Banky, Telco)

### 🟡 Přeprogramujeme
- **Hero:** 4 podnadpisy → 1 hlavní sdělení + 3 benefity v sekci níže
- **Benefity:** Generické bullet listy → konkrétní čísla + příčina-následek formulace
- **Citace referencí:** Generický placeholder → reálné citace s jmény, firmami, čísly (nebo sekce prázdná, dokud nebudou)
- **"Desítky let zkušeností ???":** Ověřit přesná čísla a použít je

### 🔴 Vypouštíme nebo přesuneme
- **Duplicitní benefit sekce** ("Co Vám BC4Cloud přinese" + "Proč firmy nasazují BC4" mají stejný obsah) → spojeno do jedné
- **AI tiketovací systém na homepage** → čekáme na status produktu, zatím jen zmínka na AI stránce
- **Autoplay video** → kliknutelné, s poster obrázkem

### ❓ Otevřené otázky k vyřešení s kolegou / vedením
1. Přesná čísla o společnosti (léta, realizace, agenti)
2. Status AI tiketovacího systému — existuje, existuje roadmapa?
3. 3–5 klientů s povolením zveřejnit logo
4. Min. 1 case study s reálnými čísly (nebo rozhovor se zákazníkem na vytvoření)
5. ARES API — kdo píše serverless endpoint pro validaci?
6. Backend kontrola stávajících zákazníků (TM/O2/HW ústředna) — kam se má dotazovat?
