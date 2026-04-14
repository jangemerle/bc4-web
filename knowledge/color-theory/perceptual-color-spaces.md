# Perceptual Color Spaces: Why HSL Fails and What Replaces It

**Sources:**
- Alexei Boronine — "Color Spaces for Human Beings" (boronine.com, 2012)
- Jiří Chlebuš — "Jak tvořit systematické barvy pro digitální produkty" (blog.jirichlebus.cz)
- Stripe — "Accessible Color Systems" (stripe.com/blog)

**Added:** 2026-03-17

---

## The Core Problem

Human eyes have three cone types (S, M, L) that don't map linearly to RGB. Standard HSL was built in the 1970s for computational simplicity, not perceptual accuracy. Its three fatal flaws:

1. **Lightness is meaningless across hues.** HSL L=50% yellow looks dramatically brighter than HSL L=50% blue. You cannot compare lightness values between different hues.
2. **Saturation is unreliable.** Same S value means different things at different hues/lightnesses. "Do not try to extract any meaning from comparing the saturation values of two different colors using HSL." — Boronine
3. **Hue spacing is non-uniform.** Equal angular differences don't produce equally perceptible hue shifts.

**Consequence:** Building a systematic palette in HSL requires manual fudging at every step. Contrast guarantees are impossible without per-color testing.

## The Color Space Landscape

| Space | Origin | Strengths | Weaknesses |
|-------|--------|-----------|------------|
| **RGB** | Monitor output | Universal, computationally native | Zero perceptual meaning |
| **HSL** | 1970s simplification of RGB | Intuitive H/S/L model | All three channels lie about perception |
| **CIE Lab** | CIE 1976 | Perceptually uniform L*, good for print | A/B axes unintuitive, hard to build palettes |
| **CIE LUV** | CIE 1976 | Perceptually uniform, suited for displays | Less common tooling |
| **CIE LChuv** | Polar coords of LUV | L/C/h maps to lightness/chroma/hue — intuitive | Irregular gamut boundary |
| **HSLuv** | Boronine (extends LChuv) | Intuitive H/S/L + perceptual uniformity | S=100 means different chroma per hue (by design) |
| **OKLCH** | Björn Ottosson 2020 | Modern, CSS-native (`oklch()`), very uniform | Newer, less battle-tested in DS contexts |

## HSLuv Specifically

Created by Alexei Boronine as a human-friendly wrapper around CIE LChuv. Key properties:

- **L channel is perceptually uniform.** L=60 looks equally bright regardless of hue. This is the killer feature for systematic palettes.
- **S=100 fills the sRGB gamut.** At any given L, S=100 is the most saturated color possible. This means max saturation varies by hue — yellow can be more chromatic than blue at the same lightness.
- **H is 0–360 degrees**, matching designer mental models.
- **The grayscale proof:** Convert an HSLuv palette to grayscale → all swatches at the same L value become the same gray. Do this with HSL → chaos.

## Stripe's Approach

Stripe rejected trial-and-error and HSL tint/shade generators. They built a custom tool using CIE Lab color space that visualized which color combinations were physically possible (showing "impossible color" regions). Key outcomes:

- Any two colors separated by **5 levels** pass WCAG AA for small text
- **4 levels** spacing passes for large text/icons
- Built-in contrast compliance without per-combination testing
- "Accessible doesn't mean not vibrant" — WCAG measures contrast ratios, not perceived colorfulness

## Chlebuš's Practical Method

1. Start with 10 gray gradations (don't use linear interpolation — concentrate steps in lighter range)
2. Use HSLuv to select 8+ hues at consistent L values
3. Normalize brand color's hue/lightness to align with the grid
4. Generate all lightness levels per hue
5. **Verify with grayscale conversion** — if all hues at same L produce same gray, the palette is correct
6. Minimum 5 lightness steps between text/bg pairs for WCAG AA (4.5:1)
7. Minimum 4 steps for icons/large text (3:1)

---

## Relevance to Kvalt

Kvalt already uses HSLuv for its palette generation — this research validates that choice. Specific applications:

- **The grayscale proof on the Colors page** directly implements Chlebuš's verification method
- **Contrast guarantees by level distance** (Stripe's "5 levels = AA") could be documented as a rule in Kvalt's color guidelines
- **The S=100 trap:** At high lightness, HSLuv S=100 produces neon/garish colors. Kvalt already learned this — our palette uses modulated saturation per lightness step, which is the right approach.
- **OKLCH as future path:** CSS `oklch()` is gaining adoption. Kvalt could offer OKLCH values alongside HSLuv as browser support matures.
