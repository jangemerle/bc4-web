# BC4Cloud — Character Instructions for AI

You are building with the **BC4Cloud** character. Interface pro B2B SaaS kontaktní centrum — profesionální, důvěryhodné, bez zbytečných ozdob.

## Design Philosophy

- **Modrá je identita.** Primary všechny akcentní prvky (CTA, aktivní stavy, odkazy) jsou v primary blue (`#3564EF`). Secondary pozadí jsou světlé odstíny té stejné modré, nikoli jiná barva. Vizuální koherence skrz monochromatický přístup.
- **"Never pure black."** Text na povrchu je `#04123B` (nejtmavší modrá), ne `#000`. Udržuje jemnost a konzistenci s paletou.
- **Flat, ne ornamentální.** Žádné pattern backgrounds, žádné gradientové složitosti. Bílá, světlá šedá, a občasný radial gradient primary color @ 5% pro hero / CTA sekce.
- **Professional but alive.** Motion tokens Kvalt DS zachovány — animace mají účel, ne dekoraci.

## Token Rules

### Colors
- **Primary:** modrá `#3564EF` default / `#143284` hover / `#04123B` active. Použít na: CTA tlačítka, aktivní stavy, odkazy, ikony ve focus ringu.
- **Secondary:** světlé odstíny modré (`#F2F3FE`, `#DADEFC`) pro nenárokované zdůraznění — tag pozadí, subtle callouty, informativní bandy.
- **Surfaces:** bílá (`#FFFFFF` surface-1) pro primární kontext, grey-50 (`#F9F9FA` surface-2) pro sekundární, grey-100 (`#F3F3F5` bg) pro page canvas.
- **Text:** primary-900 (`#04123B`) pro hlavní text, grey-700 (`#69707E`) pro subtle, grey-600 (`#868EA0`) pro muted.
- **Semantic:** success = zelená `#00A35A`, warning = oranžová `#E36B00`, danger = červená `#D23031`. Používat pouze pro skutečná hlášení statusu, ne pro design flair.

### Typography
- **Display (headliny):** Manrope, weights 600/700/800. Tight tracking na velkých velikostech (-2% pro H1/H2).
- **Body:** Manrope, weights 400/500. Line-height 1.5 pro pohodlné čtení delších odstavců.
- **Mono:** JetBrains Mono pouze pro code-like labels (eyebrow section labels, file names v technické dokumentaci).
- **Font loading:** přes Google Fonts link (viz `character.json > fonts`). V produkci zvážit self-hosting pro LCP.

### Spacing
Zachováno z Kvalt DS. Defaultní spaciness = 1.0 (neither compact nor airy). Pro marketingové sekce volně používat `--space-3xl` (64 px) mezi sekcemi, `--space-xl` (32 px) v rámci sekce.

### Border Radius
- Buttons, inputs, chips: `--radius-m` (8 px)
- Cards, modals, large panels: `--radius-lg` (12 px)
- Tags, badges, small controls: `--radius-s` (6 px)
- Fully rounded (avatar, pill): `--radius-xl` (9999 px)
- **Nikdy** arbitrary px hodnoty. Nikdy rounded-2xl/3xl přímo v Tailwind, pouze tokeny.

### Shadows
Zachované z Kvalt DS. `shadow-small-1..3` pro hover elevace, `shadow-large-1..3` pro modaly a důležité karty. Preferovat lehké — B2B SaaS není iOS.

### Motion
Zachované z Kvalt DS. `spring.snappy` pro tlačítka, `spring.default` pro panely, `ease.enter`/`ease.exit` pro entrance/exit. Žádný playful bounce v core UI — rezervováno pro accent momenty (např. success confirmation po odeslání formuláře).

## Do's

- **Monochromatická konzistence.** Když váháš mezi dalším akcentem a další variantou primary, vyber primary.
- **Bílé karty na šedém canvasu.** `bg-[var(--color-surface-1)]` karta na `bg-[var(--color-bg)]` stránce.
- **Specifický text na každé pozici.** Hero = primary-900. Subhead = grey-700. Muted = grey-600. Nikdy víc než 3 úrovně text-color v jedné sekci.
- **CTA = primary, vše ostatní = ghost/link.** Pouze jeden primary button na obrazovku.
- **Screenshoty aplikace v bílém kontejneru s subtle `shadow-large-2` a `rounded-lg`.** Konzistentní frame napříč webem.

## Don'ts

- **Žádný jiný akcentní barevný tón.** Žádné zelené CTA, žádné fialové badges. Modrá nebo semantic barvy, konec.
- **Žádné gradientové tlačítka.** BC4 není web3.
- **Žádný pure black nebo pure white v dark mode reversu.** Dark theme (jakmile bude relevantní) musí jít přes semantic tokens, ne hardcoded.
- **Žádné colored borders.** Borders jsou grey-200/300, ne modré a ne colored.
- **Manrope ExtraLight / Light / Thin.** Začínáme na weight 400 (regular). Hubený font čte v Manrope špatně na malých velikostech.

## Personality Test

Pokud váháš, jestli design decision sedí na BC4Cloud, zeptej se:

> "Nechalo by ředitelství českého e-shopu nebo střední banky nasadit tento web na svou LinkedIn stránku jako případovou studii?"

Pokud ano — jsme v tónu. Pokud to působí "startup-y", "web3-y", nebo "demo-y" — krok zpět.
