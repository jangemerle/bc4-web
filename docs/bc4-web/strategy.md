# BC4Cloud Web — Strategický brief

Živý dokument. Poslední aktualizace: 2026-04-14. Pokud se cokoli změní při konverzaci s Janem, aktualizuj tento soubor — je to kotva, na kterou se odkazují všechny ostatní rozhodnutí.

---

## 1. Proč tento web existuje

BusinessCom a.s. provozuje platformu **BC4Cloud** — SaaS omnichannel kontaktní centrum. Současný web `bc4.cz` je psaný pro IT publikum (SIP, CSTA, VMware) a nekonvertuje. Cílem nového webu je přesměrovat komunikaci na obchodní decision makery a systematicky generovat kvalifikované poptávky.

**Primární cíl webu:**
> Konvertovat návštěvníka do poptávkového formuláře, který vede ke kvalifikovanému obchodnímu hovoru.

**Sekundární cíl:**
> Vzdělávat trh. Mnoho cílových firem netuší, že jejich komunikační chaos má jméno a řešení.

**Success metriky (MVP, revize po 60 dnech):**
- **Hlavní:** Conversion rate (návštěva → odeslaný formulář). Benchmark: 2,5–5% pro B2B SaaS s jasnou value prop (Unbounce 2024). Začínáme s cílem 1,5% a laděním nahoru.
- **Kvalita leadů:** % formulářů, které prošly ARES validací a nejsou stávajícím zákazníkem (filter na kvalitu, ne objem).
- **Scrolling depth:** % návštěvníků, kteří dojdou ke druhému embeddovanému formuláři. Proxy pro ochotu číst.
- **Bounce rate homepage** pod 50%.
- **LCP pod 2,5 s** (Google Web Vitals — níže je korelace s konverzí doložena: každých +100ms LCP = −1 až −3% konverze, zdroj Google/Amazon).

## 2. Persona, na kterou píšeme všechno

**Jana, 35–55 let, vedoucí call centra nebo manažerka komunikace.**

**Denní realita:**
- Vede tým 5–20 agentů, zodpovídá za kvalitu zákaznické komunikace
- Tlak: méně ztracených hovorů, kratší čekání, měřitelné KPI pro vedení
- Má historickou zkušenost s call centry, ale není IT expert. Když slyší "SIP trunking", přepne.
- Nakupuje buď protože (a) současné řešení dožívá nebo končí podpora, (b) přechází na nového operátora, (c) roste a chaos telefonů už nestíhá.

**Co chce slyšet:**
- "Nepotřebujete 200 funkcí. Potřebujete základ, který funguje. To umíme."
- "Vaši agenti tím budou umět pracovat za hodinu."
- "Vaše IT oddělení nemusí nic instalovat."
- "Kolik to stojí, se dozvíte teď, ne po třech meetinzích."
- Konkrétní čísla od zákazníků, kteří jsou jí podobní.

**Co ji vypne:**
- Technický žargon (SIP, SBC, CSTA, WebRTC, CSTA, VMware)
- Abstraktní výhody bez čísel ("vyšší produktivita", "lepší zákaznická zkušenost")
- "Revoluční řešení", "AI-powered", "enterprise-grade"
- Nejasná cena
- Generické stock fotky šťastných agentů se sluchátky
- Formulář s 12 poli

**Rozhodovací cyklus B2B CC:**
90–120 dní od prvního kontaktu k podpisu. Na webu potřebujeme zkrátit první fázi (discovery) z týdnů na dny tím, že všechny důležité informace jsou přístupné bez hovoru s obchodníkem.

**Sekundární persony (prioritně nižší, ale nezapomínáme):**
- **IT manažer** — přijde si ověřit, že to nebude noční můra integrace. Potřebuje důvěru v API, bezpečnost, nasazení. Má vlastní sekci v dokumentaci / resources.
- **Ředitel / CFO** — přijde si ověřit ROI a cenu. Potřebuje ceník a case study s čísly.

## 3. Value proposition

**Hlavní větná hypotéza (bude validována copy sessions):**

> "BC4Cloud sjednocuje telefony, emaily, chat a WhatsApp do jednoho přehledného rozhraní. Váš tým pracuje rychleji, žádný hovor se neztratí a vy vidíte výkon v reálném čase."

**Tři pilíře, na kterých stavíme:**
1. **Přehled.** Všechna komunikace v jednom místě. Jeden panel, ne šest aplikací.
2. **Rychlost nasazení.** Žádná ústředna, žádná instalace. Nasazení v řádu dnů, ne měsíců.
3. **Modularita.** Začnete s voláním, přidáte AI, když potřebujete. Plaťte za to, co používáte.

**Differentiace proti konkurenci (bude prohloubeno v samostatné konkurenční analýze):**
- vs. **Daktela:** Jednodušší, méně enterprise, rychlejší nasazení, pro menší týmy přívětivější cena. (Nutno validovat.)
- vs. **IPEX:** Modernější UX, true cloud, nikoliv hybrid legacy.
- vs. **Spinoco:** Větší šíře kanálů (WhatsApp, SMS, sociální), zralejší telefonie.
- vs. **Gorgias (zahraničí):** Lokální česká podpora, GDPR/EU data residency, integrace s českým ekosystémem (ARES, ABRA, POHODA, integrace s českými operátory).

## 4. Tone of voice pro marketingový kontext

Kvalt DS tone of voice (direct, dry, warm, brief) zůstává, ale rozšiřujeme ho o marketing-specific pravidla:

**Co děláme:**
- **Specifická čísla nad generickými tvrzeními.** "Zkrátili jsme průměrnou čekací dobu z 4:20 na 0:45" ano. "Zlepšujeme zákaznickou zkušenost" ne.
- **Příčina → následek.** "Agent vidí historii zákazníka hned po přijetí hovoru. Nemusí se ptát, co kdy volal." Ne "Přehledná historie interakcí."
- **Zákazníkův jazyk.** Píšeme slovy, která používá Jana. Ne slova z interních specifikací BusinessComu.
- **Výrok → důkaz.** Každé tvrzení má v dosahu (ideálně na stejné obrazovce) důkaz. Buď číslem, screenshotem nebo citací.
- **Česky správně.** Žádné "powered by", "enabled by", "leveraging". Když jde česky, česky.

**Co neděláme:**
- Vykřičníky. Jistota nekřičí.
- Superlativy: "nejlepší", "revoluční", "špičkový", "průlomový", "světový". Říkají to všichni, nic tím nezískáš.
- Slova: "jednoduše", "snadno", "pouze", "prostě". Patronizují.
- "Klikněte zde", "Prosím", "Gratulujeme". Tupé.
- Korporátní kostrbatiny: "poskytujeme řešení", "umožňujeme zákazníkům", "zajišťujeme procesy".
- "Chcete-li", "pokud byste rádi". Pasivní, vzdálené.

**Formát tlačítek:**
- Sloveso + konkrétní výstup. "Domluvit ukázku" ano. "Zjistit více" ne. "Odeslat" ne.
- Výzkum (ConversionXL, HubSpot): benefit slovesa ("Získat", "Domluvit") konvertují o 30–90% lépe než obligation slovesa ("Registrovat", "Odeslat").

## 5. Trust signály a proč na nich záleží

Pro B2B SaaS s cílem na rozhodovatele jsou trust signály **30–40% impactu na konverzi** (Baymard, Trust Radius). Pro BC4Cloud prioritně:

**Must-have (MVP):**
- Reálná loga 3–5 viditelných českých klientů (nad foldem, pokud to podklady dovolí)
- Min. jedna case study s konkrétními čísly na homepage
- Čísla o firmě: **ověřit s vedením** — kolik let na trhu, kolik realizací, kolik agentů obsluhuje platformu v součtu
- GDPR compliance badge + data residency v EU (key diferenciátor proti Gorgias)
- Česká podpora, pracovní doba, kontakt na konkrétní lidi (ne generic info@)
- Status page / uptime (pokud neexistuje, je to blocker — B2B zákazník se po tom pídí)

**Nice-to-have (fáze 2):**
- ISO / SOC 2 / GDPR certifikace (pokud jsou)
- Integrace loga (Microsoft Teams, Salesforce, HubSpot…)
- Video testimonial od 1–2 zákazníků

## 6. Anti-AI-slop manifesto

Tento web **nesmí** vypadat jako další SaaS šablona. Pravidla odvozená z knowledge base (`marketing-ai-slop-2026.md`, `37k-lines-of-slop.md`, `claude-code-10k-website-techniques.md`):

1. **Specifičnost > obecnost.** Každá sekce prochází testem: "Nahradil bych BC4Cloud za Daktelu a bylo by to pořád platné?" Pokud ano, přepsat.
2. **Žádné generické ilustrace.** Usmívající se agenti s headsety, abstraktní vlny, 3D kostičky. Místo toho: reálné screenshoty produktu, mikro-produktové animace (skutečný hovor přijetý v aplikaci, skutečné shrnutí AI), dokumentový styl místo zábavy.
3. **Product-as-marketing.** Screenshot aplikace prodává líp než copy o aplikaci. Každá produktová sekce má minimálně jeden autentický UI element.
4. **Originální myšlenka per stránka.** Každá stránka má jednu ostrou myšlenku, ne mix pěti průměrných. "Find a wedge" (Notion pattern).
5. **Konkrétní nad abstraktní, vždy.** "Agent vidí, kolik zákazníků čeká ve frontě" > "Transparentní řízení front". "IVR v Microsoft TTS nebo vlastní nahrávkou" > "Flexibilní konfigurace hlasového průvodce".
6. **Cooking show efekt.** Víc o tom, jak to reálně funguje, než jak je to super. Proces > výsledek.
7. **Typography jako osobnost.** Jeden display font (Borna z Kvaltu), jeden body (Inter). Intencionální pairing.
8. **Motion s důvodem.** Animace posouvá informaci, ne ozdobuje. Kvalt motion tokeny, žádný hardcoded timing.
9. **Každá bullet má váhu.** Raději 3 silné odrážky než 8 slabých.
10. **Lidský tón.** "Přijetí hovoru nezdrží ani internetové zpoždění — voláme přes vlastní VoIP síť." ne "High-availability infrastructure guarantees sub-millisecond latency."

## 7. Hierarchie CTA

Jednomocný web: **každá stránka má jeden primární CTA.** Všechny ostatní odkazy jsou sekundární.

**Primární CTA pro celý web:** `Domluvit ukázku` (vede na poptávkový formulář)

**Sekundární CTA (per kontext):**
- Na produktové stránce navíc: `Podívat se na cenu`
- Na homepage navíc: `Podívat se, jak to funguje` (video)
- Na ceníku: `Spočítat pro moji firmu`
- V případových studiích: `Domluvit ukázku pro podobnou firmu`

**CTA placement rules:**
- Hero nad foldem (každá stránka)
- Po každé produktové sekci jednou (po third-scroll)
- Sticky v hlavičce (desktop + mobil)
- Pre-footer CTA band (poslední šance)
- Na homepage navíc: druhý inline poptávkový formulář uprostřed stránky (tam, kde scrollování sáhne 60%)

## 8. Obsahový prioritizační rámec (z Humbleteam guide)

Každý obsah na stránce musí spadnout do jedné z těchto kategorií, jinak letí:

| Kategorie | Co to je | Příklad pro BC4 |
|-----------|----------|-----------------|
| **Naděje a sny** | Co chce Jana skutečně | "Konečně vědět, kolik hovorů nám uteklo." |
| **Bolesti a strachy** | Co Janu štve nebo trápí | "Staré CC s 200 funkcemi, kterým stejně nikdo nerozumí." |
| **Bariéry a pochybnosti** | Co ji brzdí v nákupu | "Nebude zase půlroční implementace?" "Nezavře nás to do černé skříňky?" |

Při psaní každé sekce homepage & produktových stránek: tahat z těchto tří kbelíků. Testovací otázka před publikováním: "Kterou Janinu naději, bolest nebo bariéru tahle sekce řeší?"

## 9. Co web NEBUDE dělat v MVP

Explicitně vynecháváme, aby byl scope zvládnutelný a každá stránka měla jasný job:

- ❌ Blog / resources / content marketing — fáze 2+
- ❌ Self-service objednávka s platební bránou — fáze 2 (dle projektové dokumentace)
- ❌ Demo prostředí — "zákazníci si s ním nevědí rady" (citace z dokumentace)
- ❌ Live chat / chatbot na webu — tlačí k alternativě k formuláři, zhorší konverzi
- ❌ Exit-intent popupy / newsletter modály — anti-pattern pro B2B
- ❌ Carousely v hero — research (NN/g, CXL) ukazuje nulový až negativní impact
- ❌ Auto-play video na homepage — poškozuje LCP
- ❌ Víc než 3 sekce "trust signals" na stránku — cognitive load

## 10. Success kritéria pro launch

MVP je považován za production-ready když splňuje:

- [ ] Homepage, Produkt CC, Ceník, Kontakt stránky kompletní v češtině
- [ ] Lighthouse Performance ≥ 90 na mobilu i desktopu
- [ ] LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms
- [ ] Poptávkový formulář s validací a ARES integrací funguje end-to-end
- [ ] Všechny komponenty z Kvalt DS, zero hardcoded hex nebo motion hodnot
- [ ] WCAG 2.1 AA compliance (fokus, kontrasty, keyboard nav, alt texts)
- [ ] Architektura připravená pro i18n (URL prefix, content files per lokalita)
- [ ] Plausible / PostHog analytika napojena, events na všech CTA a form submittech
- [ ] Sitemapa, robots.txt, OG tagy, meta descriptions
- [ ] Deploy na Vercel, subdoméně / preview

---

## Otevřené otázky, které blokuje až start prací

Tyto věci potřebujeme doplnit od Jana nebo od klienta před/během MVP:

1. **Čísla o společnosti:** Přesně let, realizací, agentů ve správě. Nesmíme nechat "???" v produkci.
2. **3–5 klientských log s povolením je zveřejnit.**
3. **Min. 1 case study s čísly.** Pokud neexistuje, potřebujeme hloubkový rozhovor se zákazníkem a napsat ji.
4. **Cenové hladiny a licenční model.** Interaktivní ceník potřebuje vstupní data.
5. **Screenshoty produktu** ve kvalitě použitelné na webu (nebo access do prostředí, ze kterého můžeme screenshotovat).
6. **Uptime / status page URL** nebo souhlas ji vytvořit.
7. **GDPR dokumentace** (odkazy na privacy policy, cookie policy — už existují, nebo tvoříme nové?).
8. **ARES API integrace** — kdo implementuje backend pro validaci IČ? Nebo jestli použijeme veřejné ARES API přímo z frontendu/serverless.
