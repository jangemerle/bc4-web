# BC4Cloud Web — Informační architektura

Živý dokument. Poslední aktualizace: 2026-04-14.

Definuje sitemapu, URL strukturu, user flows a pravidla rozložení CTA napříč stránkami.

---

## 1. Sitemapa s prioritami

Rozděleno do tří vln. Nic z **Vlny 2** a **Vlny 3** nezačínáme, dokud Vlna 1 není kompletní a deployed.

### Vlna 1 — MVP (konverzní páteř)

| # | Stránka | URL (CS) | URL (EN, příprava) | Job-to-be-done |
|---|---------|----------|--------------------|-----------------|
| 1 | Homepage | `/` | `/en` | V 10 s říct, co to je, pro koho, a proč mě to má zajímat. Dovést na formulář. |
| 2 | Produkt: Kontaktní centrum | `/produkt/kontaktni-centrum` | `/en/product/contact-center` | Hlavní produkt — plnohodnotná omnichannel story. |
| 3 | Produkt: Volání | `/produkt/volani` | `/en/product/calling` | Vstupní úroveň — náhrada ústředny. |
| 4 | Ceník | `/cenik` | `/en/pricing` | Snížit nejistotu o ceně. Pre-kvalifikovat budget. |
| 5 | Kontakt | `/kontakt` | `/en/contact` | Alternativní vstup pro lidi, kteří nechtějí vyplnit formulář. |
| 6 | Poptávkový formulář | `/poptavka` | `/en/request-demo` | Konverzní vrchol. Vlastní stránka pro hluboké SEO a re-use v CTA. |
| 7 | Děkovná stránka | `/poptavka/odeslano` | `/en/request-demo/submitted` | Potvrzení + nastavení očekávání + tracking event. |

### Vlna 2 — rozšíření produktu

| # | Stránka | URL (CS) |
|---|---------|----------|
| 8 | Produkt: AI Voicebot & Chatbot | `/produkt/ai-voicebot` |
| 9 | Features / Funkce | `/funkce` |
| 10 | Reference / klienti | `/reference` |
| 11 | Případová studie (šablona) | `/reference/[slug]` |
| 12 | O společnosti | `/o-nas` |

### Vlna 3 — trust, hloubka, SEO

| # | Stránka | URL (CS) |
|---|---------|----------|
| 13 | Moduly aplikace | `/moduly` (+ podstránky) |
| 14 | Integrace & API | `/integrace` |
| 15 | Pro vývojáře | `/dev` (API docs, webhooks) |
| 16 | Blog / zdroje | `/blog` |
| 17 | Právní stránky | `/gdpr`, `/obchodni-podminky`, `/cookies` |

---

## 2. URL struktura — pravidla

**Locale prefix od začátku:**
- Primární jazyk **čeština bez prefixu nebo s `/cs`** — musíme se rozhodnout. Doporučuji `bez prefixu` pro CZ (lepší SEO na .cz doméně, čistší UX pro hlavní cílovou skupinu) a `/en` pro anglickou mutaci. Redirect `/cs` → `/` pro konzistenci.
- Fallback: pokud user jde na neznámou URL v EN, 301 na ekvivalent v CS nebo na `/en`.

**URL konvence:**
- Všechno lowercase, slash separated, diakritika **bez**. `/produkt/kontaktni-centrum` ne `/produkt/kontaktní-centrum`.
- Žádné query parametry v základních URL. Query jen pro UTM, search, filtry.
- Kanonický URL bez trailing slash. `/cenik` ano, `/cenik/` ne. V routing config vyřešit redirect.
- Hluboké URL jen tam, kde má smysl hierarchie. `/produkt/kontaktni-centrum` ano, `/kontaktni-centrum` ne (ztráta SEO a navigace).

**SEO priority URL:**
1. `/` — brand + main category
2. `/produkt/kontaktni-centrum` — "kontaktní centrum", "omnichannel", "cloud call centrum"
3. `/produkt/volani` — "cloud ústředna", "virtuální ústředna", "náhrada ústředny"
4. `/cenik` — "BC4Cloud cena", "kontaktní centrum cena"

---

## 3. Globální navigace

### Header (desktop)

```
[Logo BC4Cloud]    Produkty ▼   Ceník   Reference   Kontakt   [CZ ▼]   [Domluvit ukázku]
```

Pravidla:
- **Header je sticky.** Nejedná se o dekoraci — primární CTA musí být vždy na dosah.
- **Počet top-level položek = 5 max.** Víc = kognitivní dluh.
- **Primary CTA v headeru je vždy stejný:** `Domluvit ukázku`. Je to jediný vizuálně zvýrazněný prvek (DS Button `primary`, vše ostatní text-link).
- **"Produkty" je dropdown** s mega menu (Volání, Kontaktní centrum, AI Voicebot). Implementace: 300ms close delay (diagonal accommodation pattern z `interaction-patterns.md`).
- **Language switcher vpravo** od nav itemů, před CTA. Pro MVP zobrazen, ale disabled s tooltipem "Anglická mutace připravujeme", pokud EN ještě není hotová.

### Header (mobil)

```
[Logo]                                          [☰]
```

- Hamburger menu otevírá full-screen drawer (modal z Kvaltu)
- V drawery: všechny top-level nav itemy + primary CTA jako tlačítko na konci
- **Sticky CTA nad bottom edge obrazovky** (zmiňuje `strategy.md` § 7). Vždy viditelný.

### Footer (desktop)

Čtyřsloupcový layout:

```
BC4Cloud                 Produkt              Společnost         Kontakt
Logo                     Kontaktní centrum    O nás             Adresa
Krátký claim (1 věta)    Volání               Reference          Telefon
                         AI Voicebot          Blog               Email
                         Ceník                Kariéra            Status page
                         Integrace

                                              Právní
                                              GDPR
                                              Obchodní podmínky
                                              Cookies

                                              © 2026 BusinessCom a.s. · Linkedin · Github (pokud bude)
```

- Sociální ikony: jen ty, které jsou aktivní. Mrtvý Twitter účet = trust killer.
- Footer není navigační bypass — neduplikujeme tam 40 linků. Každá sekce 3–5 linků max.
- **Pre-footer CTA band** (nad vlastním footerem): "Připravte se na méně ztracených hovorů." + tlačítko. Viz § 5.

---

## 4. Struktura homepage (sekce shora dolů)

Odvozeno z `landing-page-research.md` § 4 a Humbleteam article #3 (každá sekce směřuje k primárnímu cíli).

| # | Sekce | Job | Čas čtenáře |
|---|-------|-----|-------------|
| 1 | **Hero** | 10s test: kdo, pro koho, proč. Primární CTA. | 10–15 s |
| 2 | **Sociální důkaz — loga** | "Podobné firmy už to řeší s námi." | 3 s |
| 3 | **Co to řeší** (triplet výhod) | 3 konkrétní bolesti → 3 konkrétní odpovědi. | 20 s |
| 4 | **Jak to vypadá v aplikaci** (produkt screenshot + anotace) | "Tohle je realita, ne marketing." | 30 s |
| 5 | **Jak BC4 funguje** (3 úrovně: Volání → CC → AI) | Onboarding do logiky modulárního produktu. | 45 s |
| 6 | **Pro koho to je** (segmenty) | Sebeidentifikace návštěvníka. | 20 s |
| 7 | **Případová studie — highlight** (1 reference s čísly) | Důvěra konkrétností. | 30 s |
| 8 | **Inline poptávkový formulář** | Druhý konverzní bod pro připravené. | — |
| 9 | **Proč my** (důvody spolupráce s BC) | Diferenciátory v stručnosti. | 20 s |
| 10 | **FAQ** (5–7 nejčastějších) | Odstranit poslední pochybnosti. | 45 s |
| 11 | **Pre-footer CTA band** | Poslední šance. | 5 s |

**Rozhodnutí o hero composition:**
- **Asymetrický layout.** Vlevo headline + subhead + primary CTA + 3 bulletpointy jako trust baseline. Vpravo **skutečný screenshot z Agent Panelu** s anotacemi.
- Žádný carousel, žádná autoplay video. Scroll tease pattern: spodních ~50 px další sekce viditelných, aby se dala scrollem prozkoumat.

**Rozhodnutí o druhém formuláři (sekce 8):**
- Není modal, je inline embedded. Zkratka pro návštěvníky, kteří dojeli daleko a jsou přesvědčení.
- Stejné fieldy jako na `/poptavka`. Submit vede na `/poptavka/odeslano`.

---

## 5. Struktura produktové stránky (šablona pro CC, Volání, AI)

Jeden konzistentní vzor napříč třemi produktovými stránkami:

```
1. Hero (produkt-specific headline, subhead, CTA, hero visual = key UI area)
2. Sociální důkaz — 2-3 loga z segmentu, kde produkt letí
3. Klíčové bolesti, které produkt řeší (3 items, persona-driven)
4. Anatomie produktu (3-5 features s UI screenshoty, každá 1 obrazovka)
5. Technické parametry & integrace (tabulka nebo accordion)
6. Case study snippet (jedna reference relevantní k tomuto produktu)
7. Související produkty (cross-sell do CC / AI)
8. Ceník reference ("Od X Kč/agent/měsíc — zobrazit detail")
9. Pre-footer CTA band
```

**Konzistence:**
- Identická vizuální šablona napříč produkty → zrychluje čtení pro uživatele, který si prochází víc produktů
- Každý produkt má svoje unikátní screenshoty a specifickou copy
- Žádný produkt nekopíruje bullet-listy od jiného — specifičnost, ne šablonovitost

---

## 6. Struktura stránky Ceník

Cíl: snížit nejistotu. Neprodávat. Pre-kvalifikovat.

```
1. Hero: "Férový ceník. Bez měsíčních překvapení."
2. Model vysvětlen (Per agent / měsíc, minimum 5 agentů, atd.) — 1 odstavec
3. Tabulka plánů (3 tier: Volání / CC / Business) — každý se zřejmými featurami
4. Add-ons (AI voicebot, WhatsApp kanál, přídavné nahrávání…) — grid
5. FAQ ceníková sekce (co se počítá, kdy platím, smlouva, výpovědní lhůta)
6. "Potřebujete jiný model?" — link na `/kontakt` pro enterprise
7. CTA formulář pro kalkulaci pro moji firmu (vede na /poptavka s prefill `source=pricing`)
```

**Pozn:** Interaktivní konfigurátor ceny je velký build. Pro MVP stačí statická tabulka + "kalkulovat pro moji firmu" CTA, která vede na formulář s obohaceným trackingem.

---

## 7. Poptávkový formulář — hluboký návrh

Odvozeno z `landing-page-research.md` § 7 a Humbleteam article #1 (3 mistakes: headlines, testimonials, empty space).

### Fieldy (MVP — 4 pole + 1 checkbox, cíl: 2 minuty vyplnění)

| # | Field | Typ | Validace | Povinné |
|---|-------|-----|----------|---------|
| 1 | IČ | Text (8 číslic) | ARES API lookup → auto-fill firemní údaje | ✅ |
| 2 | Email | Email | Regex + základní anti-typo (gmail.con → gmail.com) | ✅ |
| 3 | Telefon | Phone | České formáty + +420 handling | ✅ |
| 4 | Počet lidí komunikujících se zákazníky | Number | Min 1, max 1000 | ✅ |
| 5 | Souhlas s GDPR | Checkbox | — | ✅ |

**Rozhodnutí:**
- **Jméno kontaktní osoby** není ve formuláři. Důvod: obchodník to zjistí z první minuty hovoru, a přidání pole = +15% drop-off (Unbounce 2024). Radši vysoká konverze než kompletní data.
- **Pozice / role** volitelně v šachtě "Jak vám můžeme pomoci?" free-text, ale ne v MVP. Fáze 2.
- **Velikost firmy / odvětví** nedovádíme — tyhle insights přijdou z ARES.

### Chování

- **On-blur validace** (ne while-typing — anti-pattern, obtěžuje). On-submit final check.
- **ARES validace** se spustí po zadání IČ a blur → zobrazí se firemní jméno pod fieldem jako potvrzení. Pokud IČ neexistuje, warning "Toto IČ jsme v ARES nenašli. Zkontrolujte prosím." Nebrání submitu — může jít o nové IČ.
- **Chyba** zobrazí se inline pod fieldem, warning ikona + text. Ne barevně zvýrazněný celý field (screen readeru nic neřekne samo o sobě).
- **Success stav po submit:** přesměrování na `/poptavka/odeslano`, ne inline success. Nová stránka = konverzní event v analytice, správná UX expectation setting.
- **Duplikátní odeslání** (user dvojklik nebo refresh): idempotentní submit přes hash submission. Druhý identický submit do 60 s se ignoruje.

### Copy na děkovné stránce

Vyhrazený H1 + sub:
> **"Díky. Ozveme se obvykle do několika minut v pracovní době."**
>
> Pondělí–pátek 8:00–17:00 středoevropského času. Mimo tuto dobu voláme první následující pracovní den.

Dále: odkaz zpět na homepage + shrnutí "co se bude dít teď" (3 kroky: hovor → mini-ukázka → individuální nabídka).

---

## 8. User flows

### Flow A: Google → Homepage → Formulář (hlavní cesta)

```
Google search "kontaktní centrum pro e-shop"
    ↓
Homepage (10s decision)
    ↓
Scroll k sekci 4 (screenshot aplikace)
    ↓
Scroll k sekci 7 (case study)
    ↓
Inline formulář (sekce 8)   ——— NEBO ———   CTA v headeru
    ↓                                              ↓
    ↓ odeslání                              /poptavka stránka
    ↓                                              ↓ odeslání
    └────────────→  /poptavka/odeslano  ←─────────┘
```

### Flow B: Google → Produktová stránka → Ceník → Formulář

```
Google "cloud call centrum cena"
    ↓
/produkt/kontaktni-centrum
    ↓ scroll, kliknutí na "Zobrazit cenu"
    ↓
/cenik
    ↓ projde tabulku, vybere tier, klikne "Kalkulovat pro moji firmu"
    ↓
/poptavka?source=pricing&tier=business
    ↓
/poptavka/odeslano
```

### Flow C: LinkedIn / email → Konkrétní produkt → Formulář

```
Externí odkaz na /produkt/ai-voicebot
    ↓ přečte produktovou stránku
    ↓
Pre-footer CTA band → /poptavka?source=product-ai
    ↓
/poptavka/odeslano
```

### Flow D: Jana bez kontextu přijde přímo na bc4cloud.cz

```
Homepage   ↓ nechápe úplně, scroll dolů
    ↓
Sekce 5 "Jak BC4 funguje" (3 úrovně) → klik na Kontaktní centrum
    ↓
/produkt/kontaktni-centrum
    ↓
Back, přečte Ceník, Reference
    ↓
Vrátí se na homepage, klikne header CTA
    ↓
/poptavka → odeslano
```

---

## 9. Pravidla umístění CTA napříč webem

Každá stránka:

- [ ] **Header sticky** s primary CTA (`Domluvit ukázku`) — vždy
- [ ] **Hero CTA** (primary) + **sekundární CTA** (většinou "Jak to funguje" nebo "Zobrazit cenu")
- [ ] **Po třetinové hloubce** (scroll ~33%) druhý CTA v kontextu
- [ ] **Po dvoutřetinové hloubce** (scroll ~66%) třetí CTA, ideálně embed formulář (homepage) nebo link na /poptavka
- [ ] **Pre-footer CTA band** (nad footerem)
- [ ] **Mobil: sticky bottom CTA** "Domluvit ukázku" po scroll > 600px

**Co neděláme:**
- CTA nad hlavičkou (double sticky) — vizuální šum
- Opakující se stejný CTA třikrát těsně za sebou — spam
- Sekundární CTA se stejným vizuálním weightem jako primární — zmate Janu
- Popup overlay CTA — anti-pattern v B2B

---

## 10. Mobile-first rozhodnutí

Dle `landing-page-research.md` § 10: ~40–60% B2B SaaS traffic je mobilní (ale konverze na mobilu typicky 30–40% nižší). Design principia:

- **Mobile-first wireframe každé stránky.** Nejprve 375px layout, pak 768, pak 1024, pak 1440+.
- **Hero na mobilu:** text nahoře, screenshot/vizuál dolů. Headline max 2 řádky na mobilu.
- **Formulář na mobilu:** vertikální, jedno pole na řádek, correct `inputMode` (tel, email, numeric).
- **Sticky bottom CTA** se zobrazuje po scroll 600px. Ve viewporta vždy nad fold CTA, pak po scroll-down Sticky bottom CTA.
- **Hamburger menu** full-screen drawer, ne side slide (který se hůř odavírá jedním palcem).
- **Tap targets min 44×44 px** (WCAG 2.5.5 Target Size).
- **Žádný horizontální scroll.** Bod.

---

## 11. Meta, OG a SEO tagging

Pro každou stránku:

- [ ] `<title>` — max 60 znaků, unikátní, primární keyword + brand
- [ ] `<meta description>` — max 155 znaků, action-oriented
- [ ] `<link rel="canonical">`
- [ ] `<meta property="og:*">` — title, description, image (1200×630), type
- [ ] `<meta name="twitter:*">`
- [ ] `hreflang` tagy pro CS/EN varianty jakmile EN spustíme
- [ ] JSON-LD schema: `Organization` na homepage, `Product` na produktových stránkách, `FAQPage` na ceníku/homepage FAQ sekci, `BreadcrumbList` na všech podstránkách

**OG image strategie:**
- Dynamicky generované přes serverless function nebo statické premade screenshoty per stránka
- Každá stránka má vlastní OG image — ne generický brand thumbnail
- Visual style: tmavé pozadí, brand typo, screenshot aplikace nebo ikona produktu, lokalita (CZ/EN variant)
