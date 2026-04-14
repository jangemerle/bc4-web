# BC4Cloud — Brand Tokens

Živý dokument. Poslední aktualizace: 2026-04-14.

Definitivní reference barev, fontů a brand assetů pro BC4Cloud web. Zdroj pravdy: **Figma `Call Centrum Design System`** (file key `ean7AOvOJA14ClZkwIGrf9`, nodes 1927:4 a 3429:14996).

Implementace: **Kvalt DS character `bc4`** (`characters/bc4/`, registrace v `src/characters/characters.ts`). Struktura Kvalt tokens zachována, pouze hodnoty přepsány.

---

## 1. Aktivace BC4 characteru

V kódu:

```tsx
import { useCharacter } from '@/characters';

// Kdekoli v marketingových stránkách:
const { setCharacter } = useCharacter();
useEffect(() => setCharacter('bc4'), [setCharacter]);
```

Nebo pevně v `MarketingLayout.tsx`:

```tsx
<CharacterProvider character="bc4">
  <Header />
  <main>{children}</main>
  <Footer />
</CharacterProvider>
```

**Důležité:** Kvalt DS docs site dál používá `kvalt-default`. Character switch se děje per-route tree, ne globálně.

## 2. Paleta primary (modrá)

| Token v Kvaltu | Figma shade | Hex | Použití |
|----------------|-------------|-----|---------|
| `--color-primary-1` | Primary/700 | `#3564EF` | Default primary — CTA, aktivní stavy, odkazy |
| `--color-primary-2` | Primary/800 | `#143284` | Hover primary — tlačítka na hover |
| `--color-primary-3` | Primary/900 | `#04123B` | Active primary — press state, tmavý header na hero |
| `--color-on-primary` | White | `#FFFFFF` | Text na primary pozadí |

Plná paleta Primary (pro případné direct usage v gradientech nebo special accents):

| Shade | Hex | HSLUV Lightness |
|-------|-----|-----------------|
| Primary/50 | `#F8F9FE` | L98 |
| Primary/100 | `#F2F3FE` | L96 |
| Primary/200 | `#DADEFC` | L89 |
| Primary/300 | `#BBC3FA` | L80 |
| Primary/400 | `#AAB5F8` | L75 |
| Primary/500 | `#95A3F7` | L69 |
| Primary/600 | `#6F86F4` | L59 |
| Primary/700 | `#3564EF` | L47 |
| Primary/750 | `#2049B8` | L35 |
| Primary/800 | `#143284` | L24 |
| Primary/850 | `#0B215C` | L15 |
| Primary/900 | `#04123B` | L7 |

## 3. Paleta secondary (světlé odstíny primary)

Per Janův požadavek: "sekundární tokeny jsou ve stejné barvě, jen světlé odstíny".

| Token v Kvaltu | Figma shade | Hex | Použití |
|----------------|-------------|-----|---------|
| `--color-secondary-1` | Primary/100 | `#F2F3FE` | Subtle primary bg — info callouty, hover rows, tag background |
| `--color-secondary-2` | Primary/200 | `#DADEFC` | Emphasized secondary — selection highlight, active tab indicator |
| `--color-on-secondary-1` | Primary/850 | `#0B215C` | Text na světle modrém bg |
| `--color-on-secondary-2` | Primary/800 | `#143284` | Dark text na mírně tmavším secondary bg |

## 4. Neutrální paleta (grey)

| Token | Figma shade | Hex | Použití |
|-------|-------------|-----|---------|
| `--color-bg` | Grey/100 | `#F3F3F5` | Page canvas |
| `--color-surface-1` | White | `#FFFFFF` | Primary surface — karty, modal, header |
| `--color-surface-2` | Grey/50 | `#F9F9FA` | Secondary surface — alternující sekce, subtle row |
| `--color-surface-3` | Grey/100 | `#F3F3F5` | Tertiary surface (= bg, identický) |
| `--color-surface-4` | Grey/200 | `#DEDFE4` | Divider backgrounds, disabled fills |
| `--color-surface-5` | Grey/300 | `#C3C6CF` | Deeper neutrals, stroke-like fills |
| `--color-surface-6` | Grey/400 | `#B4B9C4` | Skeleton placeholders |
| `--color-surface-7` | Grey/500 | `#A3A9B6` | Deepest surface (rare) |
| `--color-on-surface` | Primary/900 | `#04123B` | Primary text — **NIKDY pure black** per Figma rule |
| `--color-on-surface-subtle-1` | Grey/700 | `#69707E` | Secondary text — captions, muted UI |
| `--color-on-surface-subtle-2` | Grey/600 | `#868EA0` | Tertiary text — timestamps, labels |
| `--color-inverted-surface` | Primary/900 | `#04123B` | Tmavé pozadí — tooltip, footer, inverted bandy |
| `--color-on-inverted-surface` | White | `#FFFFFF` | Text na tmavém |
| `--color-border` | Grey/200 | `#DEDFE4` | Default borders |
| `--color-border-strong` | Grey/300 | `#C3C6CF` | Emphasized borders — table rows, card separators |

**Poznámka:** Figma má `border-i1` až `border-i4` (4 úrovně). Kvalt má jen `border` a `border-strong`. Pro BC4 MVP stačí. Pokud se vynoří potřeba dalších úrovní, rozšíříme token system (ne character override).

## 5. Semantic barvy

| Token | Figma shade | Hex | Použití |
|-------|-------------|-----|---------|
| `--color-success-1` | Success/600 | `#00A35A` | Úspěch default — success badge, confirmation |
| `--color-success-2` | Success/700 | `#008145` | Úspěch hover |
| `--color-success-3` | Success/800 | `#154127` | Úspěch active |
| `--color-success-secondary-1` | Success/100 | `#D7FDE2` | Subtle success bg |
| `--color-success-secondary-2` | Success/200 | `#93F4B5` | Emphasized success bg |
| `--color-on-success-secondary` | Success/850 | `#002D14` | Text na světle zelené |
| `--color-warning-1` | Warning/600 | `#E36B00` | Varování default |
| `--color-warning-2` | Warning/700 | `#B45400` | Varování hover |
| `--color-warning-3` | Warning/800 | `#602900` | Varování active |
| `--color-warning-secondary-1` | Warning/100 | `#FFF1ED` | Subtle warning bg |
| `--color-warning-secondary-2` | Warning/200 | `#FFD7CC` | Emphasized warning bg |
| `--color-on-warning-secondary` | Warning/850 | `#421A00` | Text na světle oranžové |
| `--color-danger-1` | Danger/700 | `#D23031` | Nebezpečí default — error message, destructive CTA |
| `--color-danger-2` | Danger/750 | `#9E2123` | Nebezpečí hover |
| `--color-danger-3` | Danger/900 | `#310505` | Nebezpečí active |
| `--color-danger-secondary-1` | Danger/100 | `#FDF1F1` | Subtle error bg |
| `--color-danger-secondary-2` | Danger/200 | `#F9D8D8` | Emphasized error bg |
| `--color-on-danger-secondary` | Danger/850 | `#4E0B0C` | Text na světle červené |

## 6. Typografie — Manrope

**Font:** [Manrope](https://fonts.google.com/specimen/Manrope) od Google Fonts. Geometrický sans-serif s profesionálním charakterem, vhodný pro headliny i body.

**Import:** `index.html` obsahuje `<link>` na Google Fonts s váhami 400/500/600/700/800 a `display=swap`. Pro produkční self-hosting je to otevřený úkol (performance).

**Použití v Kvalt tokens:**

| Kvalt token | BC4 hodnota |
|-------------|-------------|
| `--font-display` | `'Manrope', 'Inter', system-ui, sans-serif` |
| `--font-body` | `'Manrope', 'Inter', system-ui, sans-serif` |
| `--font-brand` | `'Manrope', 'Inter', system-ui, sans-serif` |

**Váhy a jejich smysl:**
- **400 Regular** — body text
- **500 Medium** — odstavce s důrazem, captions
- **600 SemiBold** — UI labels, button text
- **700 Bold** — subheadings, sekce titles
- **800 ExtraBold** — hero headliny, velká čísla

**Tracking a line-height pro marketingové headliny:**
- Velké H1 (42px+): `letter-spacing: -0.02em`, `line-height: 1.15`
- H2 (28–36px): `letter-spacing: -0.01em`, `line-height: 1.25`
- Body: default `line-height: 1.5`

**Nepoužívat:** Weight 300 Light, 200 ExtraLight, 100 Thin. Manrope v nižších váhách čte na menších velikostech špatně.

## 7. Radius, Shadows, Motion, Spacing

**Zachováno z Kvalt DS** bez přepisu. Character přepisuje pouze barvy a fonty (viz Janův požadavek: "pojdme pouzit to co mame v kvalt ds"). Pro detaily viz:

- `docs/tokens.md` — radius (s/m/lg/xl), shadows (small-1..3, large-1..3), spacing (4px base)
- `src/tokens/motion.ts` — springs, durations, easings

## 8. Dark theme

Figma definuje i dark theme (DT/ prefix). **Pro BC4 marketing MVP dark neimplementujeme** — web bude primárně light a dark toggle by zvyšoval složitost bez konverzního benefitu pro persona Jana.

Charakter `bc4` aktuálně přepisuje pouze `:root` (light theme). Kvalt DS default dark tokens v `.dark` selectoru zůstávají nezměněny — což znamená, že když user přepne dark, padá na Kvalt default dark barvu (zelená). Není to ideální, ale jelikož marketing web dark neaktivuje, není to problém.

**Pokud v budoucnu chceme BC4 dark:** Přidat `.dark { ... }` override v `characters/bc4/variables.css` s hodnotami z Figmy node 3429:14996 pravého sloupce (DT/ prefixed).

## 9. Brand assets — otevřené otázky

Věci, které musíme dodat PŘED prvním deployem:

- [ ] **Logo BC4Cloud** (SVG, dark + light varianta) — **blocker pro Header**
- [ ] **Favicon** (`.ico`, `.svg`, 192/512 PNG pro PWA) — **blocker pro deploy**
- [ ] **Apple touch icon** (180×180)
- [ ] **OG image template** (1200×630) — buď statická master verze pro MVP, nebo Satori-based dynamická
- [ ] **Logo klientů** pro LogoCloud sekci — **blocker pro homepage trust band**
- [ ] **Screenshoty z aplikace** v čitelné kvalitě (Agent Panel, Supervizor, dashboard view, IVR editor) — **blocker pro produktové stránky**
- [ ] **Video hero** (kolega chce video z reálného hovoru + AI summary) — volitelné pro MVP, ale silný conversion tool

**Jak žádat:** Email nebo ticket na BusinessCom marketing s přesnou specifikací (formáty, rozměry, kdo má povolení).

## 10. Mapování Figma → Kvalt (kompletní reference)

Pro případné budoucí zmatení. Figma BC4 token struktura vs. Kvalt tokeny:

| Figma token | Kvalt token |
|-------------|-------------|
| `LT/Bg/bg` | `--color-bg` |
| `LT/Surface/surface-i1` | `--color-surface-1` |
| `LT/Surface/surface-i2` | `--color-surface-2` |
| `LT/Surface/surface-i3` | `--color-surface-3` |
| `LT/Surface/inverted-surface` | `--color-inverted-surface` |
| `LT/Surface/on-surface` | `--color-on-surface` |
| `LT/Surface/on-surface-subtle` | `--color-on-surface-subtle-1` |
| `LT/Surface/on-surface-subtler` | `--color-on-surface-subtle-2` |
| `LT/Surface/on-inverted-surface` | `--color-on-inverted-surface` |
| `LT/Primary/primary` | `--color-primary-1` |
| `LT/Primary/primary-hover` | `--color-primary-2` |
| `LT/Primary/primary-active` | `--color-primary-3` |
| `LT/Primary/on-primary` | `--color-on-primary` |
| `LT/Secondary/secondary-i1` | `--color-secondary-1` |
| `LT/Secondary/secondary-i2` | `--color-secondary-2` |
| `LT/Secondary/on-secondary` | `--color-on-secondary-1` |
| `LT/Success/success` | `--color-success-1` |
| `LT/Success/success-hover` | `--color-success-2` |
| `LT/Success/success-active` | `--color-success-3` |
| `LT/Success/on-success` | `--color-on-success` |
| `LT/Secondary Success/secondary-success-i1` | `--color-success-secondary-1` |
| `LT/Secondary Success/secondary-success-i2` | `--color-success-secondary-2` |
| `LT/Secondary Success/on-secondary-success` | `--color-on-success-secondary` |
| `LT/Warning/*` | `--color-warning-*` (analogicky k success) |
| `LT/Danger/*` | `--color-danger-*` (analogicky k success) |
| `LT/Border/border-i1` | `--color-border` |
| `LT/Border/border-i2` | `--color-border-strong` |
| `LT/Border/border-i3` | _(není ekvivalent, použít border-strong)_ |
| `LT/Border/border-i4` | _(není ekvivalent)_ |
| `LT/Nav/nav-bg` | _(použít `--color-inverted-surface` nebo custom per-layout)_ |
| `LT/Nav/on-nav` | _(použít `--color-on-inverted-surface`)_ |
| `LT/Primary/primary-alternative` | _(nemapováno — pro MVP ignorováno)_ |
| `LT/Disabled/disabled` | _(pro Kvalt komponenty použít default disabled style)_ |

**Tokens, které Figma má a Kvalt ne:** `nav-bg`, `primary-alternative`, `disabled`, `border-i3`, `border-i4`. Pokud se ukáže potřeba, přidáme je do Kvalt DS (po konzultaci s Janem), ne do character overridu — to by zanesl specifičnost do shared DS.
