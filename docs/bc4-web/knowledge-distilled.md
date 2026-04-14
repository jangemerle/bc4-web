# BC4Cloud Web — Destilovaný playbook

Živý dokument. Poslední aktualizace: 2026-04-14.

Extrakt z Kvalt knowledge base + 3 Humbleteam/Design Bootcamp článků + landing-page-research.md relevantní pro BC4 projekt. **Jediný soubor, který Claude přečte, když startuje práci na konkrétní stránce** — obsahuje vše co má vědět o tom, jak web psát, strukturovat a kódovat.

Plný research (s citacemi, daty a dlouhými zdůvodněními) je v `landing-page-research.md`. Tady jsou destilované akční pravidla v kontextu BC4.

---

## 1. Top 20 principů, ranked

Seřazeno dle dopadu na konverzi u našeho typu produktu (B2B SaaS, střední decision cycle, Czech market).

1. **Specifičnost > obecnost, vždy.** Konkrétní čísla konvertují 3× líp než generické claims. "Zkrátili čekání z 2:30 na 0:45" > "Kratší čekací doby."
2. **4U headline pravidlo** (Useful, Urgent, Unique, Specific) — +5–20% konverze. Každý hero headline testovat proti této čtveřici.
3. **Hero má JEDNU zprávu, ne čtyři.** Carousely a multi-message hero snižují konverzi. Když má kolega 4 podnadpisy, jeden z nich je pilotní, zbytek jde níže.
4. **Lead form = 4–5 polí max.** 120% lepší konverze vs. 10-polí formulář (Unbounce 2024).
5. **Primary CTA jeden per stránka.** Sekundární CTA mají menší vizuální weight.
6. **Asymetrický hero layout** (text vlevo, screenshot vpravo) > full-width — heatmapy potvrzují, cognitive load nižší.
7. **Product screenshot > illustration** pro SaaS hero. 20% lepší konverze (2024 analysis). Reálná data v UI, ne stock.
8. **Trust signály nad foldem.** 3–5 klientských log + 1–2 konkrétní metriky. 30–40% impact na B2B konverzi (Baymard).
9. **LCP ≤ 2,5 s** — každých +100 ms LCP = −1 až −3% konverze (Google).
10. **Benefit sloveso v CTA** ("Získat", "Domluvit") > obligation ("Registrovat", "Odeslat") — +30–90% (ConversionXL).
11. **Každá sekce končí CTA nebo směřuje k primárnímu cíli.** "Every piece of content should direct users to the primary goal." (Design Bootcamp #3)
12. **Testimonials jsou verified a specific.** "Jmeno + fotka + LinkedIn + 20–30 slov + číslo" → +1–20% konverze (Humbleteam #1).
13. **Zákazníkův jazyk, ne marketingový.** Research na Reddit/Facebook/Quora, jak cílovka mluví, a použít to 1:1 (Humbleteam #2).
14. **Hierarchie: Naděje — Bolest — Bariéra.** Každý obsah musí spadat do jednoho z kbelíků, jinak letí.
15. **Whitespace je konverzní prvek.** Overloaded landing page je "annoying at best, turns customers away at worst" (Humbleteam #1).
16. **FAQ kde pozornost kulminuje strachem** (ceník, getting started). Ne na konci, kde už skoro nikdo nečte.
17. **Sticky CTA** v headeru, na mobilu bottom. Vždy viditelný, rozdíl 5–15% konverze.
18. **F-pattern reading** nad foldem: headline → bullety → vizuální anchor → CTA. 57% času stráví user nad foldem.
19. **Multi-step form > single-page form** když je ≥5 polí. Progress indicator snižuje vnímanou zátěž. +25–40% (Baymard).
20. **Tone: direct, dry, bez vykřičníků.** Jistota nekřičí. Korporátní fráze = AI slop signal = −50% trust (Raptive).

## 2. Headline formule použitelné pro BC4

Z Kvalt knowledge (`website-marketing/copy-patterns.md`) 10 provozuschopných formulí. Pro BC4 s českým překladem:

### Formule A: Specifický benefit + časový rámec
**Vzor:** "[Konkrétní výstup] za [konkrétní časový rámec]."
- "Přehled o každém hovoru za 24 hodin po spuštění."
- "Omnichannel komunikace za týden, ne za kvartál."

### Formule B: Provokativní otázka
**Vzor:** "Co když [aktuální stav] byl [nečekaný zvrat]?"
- "Co když vaše call centrum nemuselo mít 200 funkcí?"
- "Co kdybyste každý ztracený hovor viděli předtím než o něj přijdete?"

### Formule C: "Není to X, je to Y"
**Vzor:** "Ne [mylná představa]. [Přerámování]."
- "Ne ústředna s cloud nástavbou. Plnohodnotné kontaktní centrum od prvního hovoru."
- "Ne 100 funkcí. 20 věcí, které opravdu potřebujete."

### Formule D: Implicitní bolest
**Vzor:** "První [kategorie] které [negativní premisa o konkurenci]."
- "Kontaktní centrum, které neschováva cenu."
- "Kontaktní centrum, které nasadíme, ne prodáme."

### Formule E: Trojlístek identity
**Vzor:** "[Identita], [schopnost], [hodnota]."
- "Kontaktní centrum pro české firmy. Cloud. Česká podpora."

### Formule F: Action-verb-first
**Vzor:** "[Sloveso] [výstup]."
- "Spravujte hovory, emaily a chaty z jednoho okna."
- "Volejte, pište, zvedejte. Odkudkoliv."

### Formule G: "Unapologetically [value]"
**Vzor:** "[Produkt] je [záměrně kontroverzní hodnota], protože [důkaz]."
- "BC4Cloud je záměrně jednoduchý. Protože kontaktní centrum, které nikdo neobsluhuje, je horší než papírová tužka."

### Co NEpoužijeme
- ❌ "Revoluční/inovativní/enterprise-grade/world-class kontaktní centrum"
- ❌ "Komplexní řešení pro moderní firmy"
- ❌ "Využijte sílu/potenciál/výhody cloud technologií"
- ❌ "Na míru/tailored vašim potřebám"

## 3. Testimonial / case study šablona

Z Humbleteam #1: testimonial MUSÍ mít tyto elementy, jinak zabíjí trust:

- ✅ **Jméno** (skutečné, ne "Spokojený zákazník")
- ✅ **Pozice a firma** (ne jen jméno)
- ✅ **Fotka** (reálná, ne stock)
- ✅ **Link na LinkedIn / web firmy** (verifikace)
- ✅ **20–30 slov max** (stručnost = důvěryhodnost)
- ✅ **Konkrétní číslo / výsledek** uvnitř citace

**Struktura citace (pattern):**
> "Měli jsme [konkrétní bolest + číslo]. Po [časový rámec + produkt] jsme dosáhli [konkrétní zlepšení + číslo]."

**Dobrá citace:**
> "Před BC4Cloud jsme ztráceli 8% hovorů v špičkách. Za 3 měsíce jsme na 1% díky callback frontě a smart routing. To je 450 zachráněných hovorů měsíčně." — **Petra Nováková**, vedoucí CC, [Firma] s.r.o.

**Špatná citace (anti-pattern):**
> "Díky BC4 jsme zkrátili čekací dobu zákazníků a výrazně zlepšili zákaznickou spokojenost." — Spokojený zákazník

## 4. Section-by-section conversion check

Když píšu jakoukoliv sekci, projdu si tento seznam:

- [ ] **Spadá obsah do Naděje / Bolest / Bariéra?** Pokud ne → vyhodit.
- [ ] **Je v sekci alespoň jedno konkrétní číslo nebo příklad?**
- [ ] **Směřuje sekce k primárnímu cíli (poptávka)?** Přímo CTA nebo nepřímo přes argument?
- [ ] **Dokázal bych tuto sekci nahradit konkurenčním produktem?** Pokud ano → copy je generická, přepsat.
- [ ] **Kolik slov je tam?** Scroll estimátu: 1 obrazovka = 60–120 slov čtecí zátěže. Víc = odchod.
- [ ] **Je zde trust element (logo, citace, číslo, screenshot)?** Ideálně ano, i když sekce je primárně o něčem jiném.
- [ ] **Je tu vizuál, který prodává lépe než text?** Když ano, text jen anotuje.

## 5. Copy sanity checklist (před publikováním copy)

Test, kterým projdou VŠECHNY texty:

1. **The Swap Test:** Nahraď "BC4Cloud" za "Daktela" (nebo "IPEX"). Pořád dává smysl? → Copy je generic, napsat znovu.
2. **The "Jak" Test:** Můžeš ke každému claim přidat "Jak konkrétně?" a odpovědět? Když ne → abstraktní, specifikovat nebo vyhodit.
3. **The Read-Aloud Test:** Přečti nahlas v českém hovorovém tónu. Zní jako překladač? → Přepsat.
4. **The Persona Test:** Představ si Janu z IA dokumentu. Zareaguje na to "to je pro mě" nebo "to je pro IT"? Pokud druhé → přepsat.
5. **The Vykricnik Test:** Vykřičník? Vyhoď.
6. **The Mrtvá slova Test:** Obsahuje "moderní", "inovativní", "prostě", "jednoduše", "pouze"? Vyhoď nebo nahraď.

## 6. Visual design rules (nad rámec Kvalt konvencí)

**Typography hierarchie na marketingovém webu:**
- Headlines používají **Borna** (Kvalt display font), medium + bold weights
- Body používá **Inter** (Kvalt body font)
- Eyebrow labels (malé textové návěstí nad headliny): `font-mono` Inter, uppercase, tracking-wide, text-sm — konvenční "section label" pattern z Tailwind, signalizuje technickou profesionalitu
- Hero headline: `text-headline-2xl` (42px desktop), `text-headline-l` (28px mobile)
- Section headline: `text-headline-xl` (36px desktop), `text-headline-m` (24px mobile)

**Single accent color:**
Kvalt DS má 6 palet. Pro marketing **používáme primary (zelená) jako jediný akcent**. Všechno ostatní je neutrals + semantic. Nezaplňujeme stránku barvami — `one primary + semantic set` pattern z Cursor a Equals.

**Product screenshots:**
- Vždy v light mode by default (nebo dual jak light tak dark variant pokud je prostor)
- Export z BC4 aplikace v reálných datech (anonymizovaných), ne placeholder "John Doe"
- Konzistentní frame — subtle drop shadow + rounded (`shadow-large-2`, `rounded-lg`)
- Alt text popisuje co obrazovka dělá, ne "Screenshot"

**Background treatment:**
- Preferujeme bílou/surface-1 jako základ
- Sekce se můžou odlišit použitím `surface-2` pro alternaci
- Radiální gradienty za hero / CTA bandy: subtle, primary color s ~5% opacity, blur
- Žádné noise textury, žádné abstract wave SVG

**Motion (z Kvalt tokens):**
- Entrance animations: `duration.slow` (480ms) + `ease.enter` pro elementy nad foldem
- Stagger: max 50 ms mezi sourozenci (Kvalt rule)
- Scroll-triggered reveals: jen pro hero children a key statistiky. Ne pro každý paragraf.
- **Respektuj `prefers-reduced-motion`** — fallback na opacity-only fade

## 7. Lead form UX detaily

Rozpracovaný playbook pro `LeadForm` komponent:

**Visual structure:**
```
[ Eyebrow: DOMLUVIT UKÁZKU ]
[ Headline: Zjistěte, jak to funguje pro vás ]
[ Subhead: Vyplňte 4 pole. Ozveme se obvykle do několika minut. ]

[ IČ                           ] → on blur: "Firma: XYZ s.r.o." inline under
[ Email                        ]
[ Telefon                      ]
[ Kolik lidí komunikuje se zákazníky ]

[ ☐ Souhlasím se zpracováním údajů podle GDPR (link) ]

[ Primary button: Odeslat poptávku ]

Disclaimer: Obvykle se ozveme do několika minut v pracovní době Po–Pá 8–17.
```

**Validace timing:**
- **On-blur** — ne while-typing (nepříjemné)
- **On submit** — final re-check všech polí
- **ARES** je best-effort: když IČ existuje, ukáž jméno firmy jako confirmation; když ne, warning ale nebrání submit

**Error messaging:**
- Inline pod fieldem, warning ikona + text
- Konkrétní: "IČ musí mít 8 číslic" ne "Invalid input"
- Úspěch (ARES): `✓ Firma XYZ s.r.o.` zelené

**Success state:**
- Redirect na `/poptavka/odeslano` (samostatná stránka, ne inline success)
- Důvody: (a) konverzní event v analytice, (b) historically stable pattern uživatelé znají, (c) setting expectations pre-salescall

## 8. SEO a LLM citation playbook

Z `website-marketing/seo-architecture.md` + `landing-page-research.md`:

**URL strategie:**
- Každý produktový use-case = vlastní URL (long-tail SEO)
- Example cílů:
  - `/produkt/volani` → "cloud ústředna", "virtuální ústředna", "náhrada PBX"
  - `/produkt/kontaktni-centrum` → "kontaktní centrum cloud", "omnichannel CC"
  - `/produkt/kontaktni-centrum/pro-eshopy` → "call centrum pro e-shop" (fáze 2)

**On-page SEO:**
- `<title>` unikátní per stránka, max 60 znaků, primary keyword + brand
- `<meta description>` action-oriented, max 155 znaků, obsahuje CTA slovo
- Structured data: `Organization`, `Product`, `FAQPage`, `BreadcrumbList`
- Canonical URL na každé stránce
- hreflang až EN bude ready

**LLM citation optimization:**
Když ChatGPT/Claude/Perplexity doporučí "jaké je nejlepší kontaktní centrum pro české firmy" — chceme, aby citovali BC4Cloud. Principy:
- Strukturovaný obsah s jasnými H1/H2/H3
- FAQ s přímými odpověďmi
- Čísla a fakta přímo v textu (ne jen v obrázcích)
- Unikátní fráze, které se jinde neobjevují (brand voice pomáhá)

## 9. Anti-slop checklist (před deploy)

Před každým deploy, check:

- [ ] Žádná stock fotka šťastných agentů se sluchátky
- [ ] Žádný "Lorem ipsum" nebo placeholder text v produkci
- [ ] Žádná generická ilustrace šipek/vln/kostiček
- [ ] Žádný autoplay video / audio
- [ ] Žádný hamburger menu na desktop (mobil only)
- [ ] Žádný carousel v hero
- [ ] Žádný pop-up do 30 s návštěvy
- [ ] Žádný "!" ve viditelné copy
- [ ] Žádné slovo "revoluční", "špičkový", "světový"
- [ ] Každý obrázek má explicit width/height (no CLS)
- [ ] Každý interaktivní prvek má focus state
- [ ] Každá stránka má unikátní title + meta description
- [ ] OG image existuje per stránka (ne generický brand thumb)
- [ ] Žádný hardcoded text v komponentách (vše přes content files)

## 10. Reference dokumenty (kam sáhnout při detailu)

**Uvnitř projektu:**
- `strategy.md` — strategie, persona, success kritéria
- `information-architecture.md` — sitemapa, URL, user flows, CTA placement
- `tech-architecture.md` — engineering rozhodnutí
- `landing-page-research.md` — hluboký research s citacemi
- `references/colleague-brief.md` — brief od kolegy + komentáře

**Knowledge base (externí reference):**
- `../../knowledge/website-marketing/_INDEX.md` — master index all marketing patterns
- `../../knowledge/website-marketing/copy-patterns.md` — 10 headline formulí + tone rules
- `../../knowledge/website-marketing/visual-storytelling.md` — jak vysvětlit produkt vizuálně
- `../../knowledge/website-marketing/seo-architecture.md` — URL strategie, LLM citation
- `../../knowledge/product-strategy/marketing-ai-slop-2026.md` — proč AI obsah pere trust
- `../../knowledge/engineering-workflows/claude-code-10k-website-techniques.md` — jak dělat kvalitní web

**Kvalt DS dokumentace:**
- `../SYSTEM.md` — Kvalt overview
- `../tokens.md` — tokens
- `../philosophy.md` — motion, tone, a11y principles
- `../conventions.md` — coding rules
- `../components/INDEX.md` — katalog DS komponent
