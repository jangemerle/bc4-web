# English content — placeholder

Tato složka je připravená pro budoucí anglickou mutaci. Až bude čas, vytvořit:

- `common.ts` (mirroring `../cs/common.ts`)
- `home.ts`
- `product-cc.ts`
- `product-calling.ts`
- `pricing.ts`
- `contact.ts`
- `lead-form.ts`
- `lead-form-submitted.ts`

Každý soubor implementuje stejné TypeScript interface jako CS verze (viz `../types.ts`). TypeScript při buildu vynutí, že žádný field nechybí — kompletnost překladu je garantovaná typovým systémem.

Workflow překladu doporučený:
1. Zkopírovat soubor z `cs/` do `en/`
2. Přeložit hodnoty (klíče zachovat)
3. Při překladu CTA labels držet zákaznický jazyk EN trhu, nikoliv literal překlad CZ
4. SEO meta — zvlášť pro EN, ne přeložené CZ (jiné keywords)
5. URL paths v CTA href přepnout na EN ekvivalent (`/poptavka` → `/en/request-demo` atd.)
