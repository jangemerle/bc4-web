# BC4Cloud Web — Dokumentace projektu

Tato složka je **single source of truth** pro marketingový web BC4Cloud. Každý nový vývoj (Claude session, Jan, budoucí kolega) začíná tady.

**Projekt:** Konverzně zaměřený marketingový web pro BC4Cloud — SaaS omnichannel kontaktní centrum od BusinessCom a.s.
**Stack:** React 19 + Vite + TypeScript + Tailwind + Kvalt DS + vite-ssg + react-i18next
**Jazyk:** Čeština primární, architektura připravená pro i18n
**Deploy:** Vercel (zatím preview doména, ostrá doména TBD)

---

## Kudy na to

Pořadí, ve kterém číst dokumenty:

### Start here (povinné před první řádkou kódu)
1. [`strategy.md`](./strategy.md) — proč tento web existuje, persona Jany, value prop, tone, trust signály, anti-slop manifesto, success kritéria
2. [`information-architecture.md`](./information-architecture.md) — sitemapa, URL struktura, user flows, struktura homepage + produktových stránek, CTA placement rules
3. [`tech-architecture.md`](./tech-architecture.md) — engineering rozhodnutí, organizace složek, i18n strategy, formuláře, perf rozpočty
4. [`brand-tokens.md`](./brand-tokens.md) — definitivní reference barev, fontu (Manrope), character `bc4`, mapování Figma → Kvalt, brand asset checklist
5. [`knowledge-distilled.md`](./knowledge-distilled.md) — destilovaný playbook: 20 principů, headline formule v CS, testimonial pattern, copy sanity checklist, anti-slop checklist

### Reference (číst když potřebuješ detail)
- [`landing-page-research.md`](./landing-page-research.md) — hluboký research SaaS B2B landing page best practices, 5k+ slov, 15 oblastí, citace zdrojů
- [`pre-build-setup.md`](./pre-build-setup.md) — co udělat těsně před prvním kódem: npm install, scaffold přesun, env variables, deploy preflight
- [`scaffolds/`](./scaffolds/) — hotový kód k přesunu po npm install: zod schema, i18n config, MarketingLayout, LeadForm, router, leads endpoint
- [`references/colleague-brief.md`](./references/colleague-brief.md) — brief od kolegy z BusinessComu + moje komentáře (co bereme, co přepisujeme, co vypouštíme)
- [`references/colleague-brief-original.docx`](./references/colleague-brief-original.docx) — archiv originálu

### Mimo tuto složku, ale relevantní
- [`../../bc4-web/bc4cloud-web-dokumentace.html`](../../bc4-web/bc4cloud-web-dokumentace.html) — plná projektová dokumentace (mind map, persony, sitemap, kompetitiv, open questions)
- [`../SYSTEM.md`](../SYSTEM.md) — Kvalt DS overview, tech stack, co je built
- [`../components/INDEX.md`](../components/INDEX.md) — katalog všech DS komponent
- [`../philosophy.md`](../philosophy.md) — Kvalt motion/tone/a11y principy
- [`../../knowledge/website-marketing/_INDEX.md`](../../knowledge/website-marketing/_INDEX.md) — marketing knowledge base

---

## Principy nad vším

Zhuštěno na nejkratší možný výtah:

1. **Konverze, ne estetika.** Každá sekce má job-to-be-done. Když nemá, vypadává.
2. **Specifičnost nad obecností.** Konkrétní čísla, konkrétní příběhy, konkrétní screenshoty. Vždy.
3. **Kvalt DS je zákon.** Zero hardcoded barvy/motion/typografie. Všechno z `src/components/` a `src/tokens/`.
4. **Jana, ne IT.** Copy píšeme pro vedoucí call centra, ne pro systémového integrátora.
5. **Žádné slop.** Žádné stock fotky, žádné generické ilustrace, žádné vykřičníky, žádné "revoluční/moderní/inovativní".

---

## Fáze projektu a scope

### Vlna 1 — MVP (konverzní páteř)
Homepage, Kontaktní centrum, Volání, Ceník, Kontakt, Poptávkový formulář, Děkovná stránka. Deploy na Vercel preview.

### Vlna 2 — produkt a trust
AI Voicebot & Chatbot, Features, Reference, Případové studie, O nás.

### Vlna 3 — hloubka a SEO
Moduly, Integrace & API, Pro vývojáře, Blog, Právní stránky.

---

## Aktuální stav

**2026-04-14:** Fáze přípravy dokončena. Všechny strategické dokumenty na místě. Čekáme na Janovo "začínáme" pro první kód.

**Otevřené otázky k vyřešení s klientem:**
Seznam vedený v [`strategy.md` § 10](./strategy.md#10-success-kritéria-pro-launch) a [`references/colleague-brief.md`](./references/colleague-brief.md) na konci. Prioritně:
1. Přesná čísla o společnosti (léta, realizace, agenti)
2. 3–5 klientských log s povolením zveřejnění
3. Min. 1 case study s reálnými čísly
4. Status AI tiketovacího systému
5. ARES backend integrace (kdo píše serverless)
6. Deploy doména (bc4cloud.cz vs. bc4.cz)

---

## Jak aktualizovat tuto dokumentaci

- **Strategická změna** (persona, cíle, tone) → `strategy.md`
- **Strukturní změna** (sitemapa, URL, flows) → `information-architecture.md`
- **Technická změna** (stack, konvence, backend) → `tech-architecture.md`
- **Copy insight / playbook update** → `knowledge-distilled.md`
- **Nový externí materiál od klienta** → `references/` složka + odkaz z relevantního dokumentu

Po každé změně aktualizuj "Poslední aktualizace" header v daném souboru.
