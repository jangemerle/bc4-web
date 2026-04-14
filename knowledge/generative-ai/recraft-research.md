# Recraft AI — Comprehensive Research for Skill Building

> Research compiled April 2026. Covers Recraft V3 (current MCP integration) and V4 (latest model).

---

## 1. API Capabilities — Full Tool Inventory

### Available Operations (via MCP)

| Operation | What it does | Key parameters |
|-----------|-------------|----------------|
| **generate_image** | Text-to-image generation | prompt, style, substyle, styleID, model, size, numberOfImages (1-6) |
| **image_to_image** | Transform existing image with prompt | imageURI, prompt, strength (0-1), style/substyle/styleID |
| **create_style** | Extract custom style from reference images | style category, imageURIs (1-5 images) |
| **creative_upscale** | Upscale with detail regeneration (faces, textures) | imageURI |
| **crisp_upscale** | Upscale with sharpening only | imageURI |
| **vectorize_image** | Convert raster to SVG | imageURI |
| **remove_background** | Strip background, return transparent PNG | imageURI |
| **replace_background** | Generate new background via prompt | imageURI, prompt, style/substyle |
| **get_user** | Check email, name, credit balance | (none) |

### Additional API Endpoints (not in MCP but available via REST)

- **Inpainting** — regenerate masked regions
- **Generate Background** — fill background from mask
- **Variate Image** — remix in different aspect ratios
- **Erase Region** — remove regions via grayscale mask

### Models Available

| Model | Notes |
|-------|-------|
| **recraftv3** | Default. Best balance of quality and cost. Use for most tasks. |
| **recraftv2** | Cheaper. Has `icon` style (V3 does not). Fewer substyles. |
| **recraftv4** | Latest (Feb 2026). Better composition, lighting, materials. Not yet in MCP enum but may work via API. |
| **recraftv4_pro** | Higher-res variant of V4 (2048x2048). Premium pricing. |

### Image Size Options

All sizes are width x height in pixels:
`1024x1024` (default square), `1365x1024`, `1024x1365`, `1536x1024`, `1024x1536`, `1820x1024`, `1024x1820`, `1024x2048`, `2048x1024`, `1434x1024`, `1024x1434`, `1024x1280`, `1280x1024`, `1024x1707`, `1707x1024`

### Input Image Constraints

- Maximum 5 MB file size
- Maximum 16 megapixels resolution
- Maximum 4096 px on any dimension
- Crisp upscale: input must be < 4 MP
- Creative upscale: input must be > 256 px and < 16 MP

---

## 2. Prompting Techniques

### Prompt Structure Formula

```
A <image style> of <main content>. <detailed description of main content>. <description of background>. <detailed style description>.
```

### What Makes a Good Prompt

1. **Be specific, not vague** — "Three orange tabby cats sitting on a red velvet couch" beats "some cats on furniture"
2. **Use exact numbers** — "Three cats" not "cats" or "some cats"
3. **Use collective nouns** — "a flock of birds" rather than "birds"
4. **Order logically** — big picture first, then details (chaos to order)
5. **Include these elements when relevant:**
   - Subject (person, animal, object)
   - Medium (photo, painting, illustration, doodle)
   - Environment (indoors, outdoors, underwater, city)
   - Lighting (soft, ambient, neon, studio, overcast)
   - Color (vibrant, muted, monochromatic, pastel)
   - Mood (calm, energetic, melancholic)
   - Composition (portrait, closeup, bird's-eye view, wide shot)

### What to Avoid

- **Never use negatives** — "no cake" or "without penguins" often causes the AI to generate the unwanted element. Just omit it entirely.
- **Avoid ambiguity** — "flying bat in night sky" vs "wooden baseball bat on field" — use synonyms to disambiguate
- **Don't over-prompt with custom styles** — if you have a style set, shorter prompts like "cute panda" work better since the style carries the visual language

### Recraft-Specific Strengths in Prompting

- **Long text rendering** — Recraft V3 is the only model that can generate images with long text passages (not just a word or two)
- **Text positioning** — V3 supports specifying exact positions and sizes of text on a design (via API `text_layout` parameter)
- **Color control** — supports HEX code color preferences in generation
- **Negative prompts** — supported on V2/V3 to exclude unwanted elements

### Artistic Level Parameter

Available in Recraft Studio (not directly in MCP):
- **Lower artistic level** = less creative variance, better prompt adherence
- **Higher artistic level** = more creative interpretation, more artistic output
- When prompts aren't being followed: lower the artistic level

### Troubleshooting Prompts

- If the model misinterprets your prompt, switch to a more general style (realistic_image or digital_illustration) rather than a specialized substyle
- If prompt comprehension is poor, lower the artistic level
- For text-heavy designs, enable "Avoid text in prompt" in negative settings for inventive text arrangements (may occasionally produce spelling errors)

---

## 3. Style System — Styles, Substyles, and Custom Styles

### Built-in Styles (5 categories)

| Style | Output | Available in | Use for |
|-------|--------|-------------|---------|
| `realistic_image` | Raster | V2, V3 | Photos, portraits, landscapes, product shots |
| `digital_illustration` | Raster | V2, V3 | Concept art, fantasy, editorial illustration |
| `vector_illustration` | **Vector SVG** | V2, V3 | Icons, logos, flat illustrations |
| `icon` | **Vector SVG** | V2 only | Small icons, pictograms |
| `logo_raster` | Raster | V3 only | Graphic design, raster logos, posters, badges |

### Substyles — Complete Reference

**realistic_image (V3):** b_and_w, enterprise, evening_light, faded_nostalgia, forest_life, hard_flash, hdr, motion_blur, mystic_naturalism, natural_light, natural_tones, organic_calm, real_life_glow, retro_realism, retro_snapshot, studio_portrait, urban_drama, village_realism, warm_folk

**realistic_image (V2):** b_and_w, enterprise, hard_flash, hdr, motion_blur, natural_light, studio_portrait

**digital_illustration (V3):** 2d_art_poster, 2d_art_poster_2, antiquarian, bold_fantasy, child_book, cover, crosshatch, digital_engraving, engraving_color, expressionism, freehand_details, grain, grain_20, graphic_intensity, hand_drawn, hand_drawn_outline, handmade_3d, hard_comics, infantile_sketch, long_shadow, modern_folk, multicolor, neon_calm, noir, nostalgic_pastel, outline_details, pastel_gradient, pastel_sketch, pixel_art, plastic, pop_art, pop_renaissance, seamless, street_art, tablet_sketch, urban_glow, urban_sketching, young_adult_book, young_adult_book_2

**digital_illustration (V2):** 2d_art_poster, 2d_art_poster_2, 3d, 80s, engraving_color, glow, grain, hand_drawn, hand_drawn_outline, handmade_3d, infantile_sketch, kawaii, pixel_art, plastic, psychedelic, seamless, voxel, watercolor

**vector_illustration (V3):** bold_stroke, chemistry, colored_stencil, cosmics, cutout, depressive, editorial, emotional_flat, engraving, line_art, line_circuit, linocut, marker_outline, mosaic, naivector, roundish_flat, seamless, segmented_colors, sharp_contrast, thin, vector_photo, vivid_shapes

**vector_illustration (V2):** cartoon, doodle_line_art, engraving, flat_2, kawaii, line_art, line_circuit, linocut, seamless

**icon (V2 only):** broken_line, colored_outline, colored_shapes, colored_shapes_gradient, doodle_fill, doodle_offset_fill, offset_fill, outline, outline_gradient, pictogram

**logo_raster (V3 only):** emblem_graffiti, emblem_pop_art, emblem_punk, emblem_stamp, emblem_vintage

### Custom Styles

**What they are:** Extract a visual style from 1-5 reference images, get a `styleID` back, use it in all subsequent generations for consistency.

**How to create (via MCP):**
```
create_style(style: "digital_illustration", imageURIs: ["file:///path/to/ref1.png", "file:///path/to/ref2.png"])
```

**Settings available (Studio has more, API has basics):**
- **Reference images:** 1-5 images, minimum 256px resolution
- **Style category:** realistic_image, digital_illustration, vector_illustration, icon
- **Weight sliders:** Control influence of each reference image (Studio only)
- **Style prompt:** Optional text describing the visual qualities (Studio only)
- **Reference interpretation mode:**
  - *Style essentials* (default) — emphasizes color, texture, detail
  - *Style and composition* — also captures layout, object placement, perspective

**Best practices for custom styles:**
- Use high-resolution reference images for better fidelity
- Use similar reference images for a coherent style (don't mix wildly different aesthetics)
- Use AI to describe an illustration's style, then paste that as the style prompt
- Test with short prompts first ("cute panda") before complex scenes
- Save and reuse styles for brand consistency across projects

**Consistency across a set:**
- Apply the same custom styleID across all generations
- Maintain consistent color palettes using HEX codes
- Use the Set tool (Studio) for batch generation of 6 images with unified style
- Regenerate individual images within a set without breaking consistency

---

## 4. Image-to-Image

### Strength Parameter

| Strength | Effect | Use case |
|----------|--------|----------|
| 0.0 | Almost identical to input | Minor prompt-guided tweaks |
| 0.1-0.3 | Subtle changes, preserves composition | Seasonal variations, color shifts, adding details |
| 0.4-0.6 | Moderate transformation | Style transfer, significant edits while keeping structure |
| 0.7-0.9 | Major changes, loose reference | Using image as rough composition guide |
| 1.0 | Almost no reference to input | Essentially text-to-image with a hint |

### When to Use Image-to-Image

- **Create variations** of an existing image
- **Style transfer** — apply a different visual style to existing content
- **Seasonal/mood changes** — "winter" with low strength on a summer scene
- **Iterate on composition** — use a rough sketch or previous generation as starting point
- **Maintain consistency** — transform while keeping similar layout

### Important Notes

- Use the **same style/substyle/styleID** as the original image unless intentionally changing style
- Only available with V3 and V3 Vector models
- Costs the same as text-to-image generation ($0.04 raster, $0.08 vector)
- Input can be a URL or local file path (file:// prefix)

---

## 5. Vectorization

### What It Does

Converts raster images (PNG, JPG) to SVG vector format using AI tracing.

### Quality — What Vectorizes Well

- **Logos and icons** — high contrast, geometric shapes, minimal colors = excellent results
- **Flat illustrations** — clean outlines, uniform fills, cartoon/comic style
- **Technical drawings** — schematics, blueprints, diagrams
- **Patterns** — repeating geometric or decorative patterns
- **Text/typography** — clean letterforms trace well

### Quality — What Vectorizes Poorly

- **Photographs** — continuous tones become blocky, lose realism
- **Complex gradients** — smooth color transitions produce banding or complex paths
- **Highly detailed images** — overlapping elements create convoluted SVG paths
- **Soft edges and shadows** — don't translate to clean vector paths
- **Noisy/textured images** — require extensive manual cleanup

### Best Practice Workflow

1. Generate image using `vector_illustration` style (gets native SVG output) OR
2. Generate raster image, then vectorize with `vectorize_image`
3. Option 1 is always better — native vector generation produces cleaner output

### Recraft's Unique Advantage

Recraft is the **only major AI model that generates native SVG vector graphics**. Others (Midjourney, DALL-E, Flux) only generate rasters that must be converted.

### Cost

$0.01 per vectorization request (very cheap).

---

## 6. Upscaling

### Crisp Upscale

- **What:** Increases resolution and sharpness without altering content
- **Best for:** Icons, vector-style illustrations, UI assets, anything needing pixel-perfect scaling
- **Speed:** Fast
- **Cost:** $0.004 (extremely cheap — 250x cheaper than creative upscale)
- **Input limit:** Must be < 4 megapixels
- **Output:** Deterministic — same input always produces same output

### Creative Upscale

- **What:** Enhances resolution while regenerating/improving details (faces, hands, textures, materials)
- **Best for:** Photos, portraits, group scenes, images with small faces or intricate details
- **Speed:** Slow (resource-intensive)
- **Cost:** $0.25 per image (expensive — use judiciously)
- **Input limit:** > 256px, < 16 megapixels
- **Output:** Non-deterministic — each run produces slightly different results, some iterations better than others

### Decision Guide

| Scenario | Use |
|----------|-----|
| Icon or UI asset needs to be larger | Crisp |
| Vector-style illustration for print | Crisp |
| Photo with small/distorted faces | Creative |
| Portrait enhancement | Creative |
| Group photo detail improvement | Creative |
| Hands/fingers look wrong | Creative |
| Just need higher resolution, content is fine | Crisp |
| Budget-conscious batch processing | Crisp |

---

## 7. Comparison to Other Tools

### Leaderboard Rankings (Hugging Face ELO, as of early 2026)

1. **Recraft V3** — 1172 ELO, 72% win rate
2. **FLUX 1.1 Pro** — 1143 ELO, 68% win rate
3. **Ideogram v2** — 1102 ELO, 63% win rate
4. **Midjourney v6.1** — 1093 ELO, 64% win rate
5. **Stable Diffusion 3 Large** — 1084 ELO, 61% win rate
6. **DALL-E 3 HD** — 984 ELO, 51% win rate

*Note: Recraft V4 has since climbed to #1 on the arena, surpassing Midjourney V8.*

### Head-to-Head Strengths

| Capability | Best tool | Recraft's position |
|------------|-----------|-------------------|
| **Text rendering** | Recraft V3/V4 | Best in class (long text, positioning) |
| **Vector generation** | Recraft (only option) | Unique — no competitor does native SVG |
| **Pure aesthetics** | Midjourney | Recraft is close, more "designed" less "artistic" |
| **Photorealism** | FLUX 1.1 Pro | Recraft strong, FLUX slightly better skin textures |
| **Complex instructions** | GPT Image (DALL-E successor) | Recraft good, GPT better at understanding intent |
| **Typography accuracy** | Ideogram 3.0 (~90% accuracy) | Recraft very good, Ideogram slightly better on spelling |
| **Open source/customization** | Stable Diffusion | Recraft is closed-source |
| **API availability** | Recraft, Stable Diffusion | Full REST API + MCP integration |
| **Design tool suite** | Recraft | Most comprehensive (inpaint, outpaint, mockups, bg removal, upscale) |
| **Consistency across sets** | Recraft | Best via custom styles + Set tool |

### Recraft's Unique Differentiators

1. **Only model generating real SVG vectors** — competitors produce raster only
2. **Best text-in-image generation** — long passages, positioning, sizing
3. **Most complete design toolchain** — generation + editing + processing in one API
4. **Style consistency system** — custom styles from references, reusable across projects
5. **Professional design taste** — V4 explicitly optimized for "design taste" over "internet aesthetic"

### Where Recraft Loses

- **Pure artistic beauty** — Midjourney still produces more stunning artistic images
- **Open source flexibility** — can't fine-tune, can't self-host
- **Complex scene understanding** — GPT Image better at interpreting nuanced instructions
- **Spelling perfection** — Ideogram 3.0 slightly more accurate on typography

---

## 8. Known Limitations

### Text Rendering
- Generally best in class, but still not 100% accurate on spelling
- Occasional errors on very long text passages
- "Avoid text in prompt" setting can help with creative typography but introduces spelling risk

### Consistency Issues
- Dimension controls sometimes fail to maintain consistent output sizes
- Custom style creation can fail (infrastructure issues)
- Each creative upscale produces slightly different results

### Infrastructure / Reliability
- Historical server capacity issues (Sep 2024 - Jan 2025) with credit deductions on failed generations
- Export/download failures reported (Feb - Apr 2025)
- Platform is improving but reliability lags behind feature development

### Content Warping
- Systematic warping problems above human figures (especially female), where graphics curve unnaturally
- Renders overlaid text illegible in affected areas
- Problematic for apparel design and merchandise mockups

### Style System
- Custom style creation sometimes fails
- "Style and composition" mode can be unpredictable with minimalist designs
- Mixing wildly different reference images produces poor styles

### General AI Limitations
- Abstract concepts need very explicit prompting
- Negative phrasing often backfires (generates what you told it to avoid)
- Complex multi-subject scenes can confuse element placement
- Hands and fingers can be problematic (mitigated by creative upscale)

---

## 9. Pricing / Credits

### Subscription Plans

| Plan | Price | Credits | Notes |
|------|-------|---------|-------|
| Free | $0 | 50/day | Daily reset, no rollover |
| Basic | $10/mo | 1,000/mo | No rollover |
| Advanced | $27/mo | 4,000/mo | No rollover |
| Pro | $48/mo | 8,400/mo | No rollover |
| Teams | $22-176/mo | 2,000-16,000/mo | Per-seat pricing |

Annual billing gives up to 20% discount. Top-up credits never expire.

### API Pricing (per operation)

| Operation | Cost | API Units |
|-----------|------|-----------|
| **Raster generation (V3)** | $0.04 | 40 |
| **Raster generation (V4)** | $0.04 | 40 |
| **Raster generation (V4 Pro)** | $0.25 | 250 |
| **Vector generation (V3)** | $0.08 | 80 |
| **Vector generation (V4)** | $0.08 | 80 |
| **Vector generation (V4 Pro)** | $0.30 | 300 |
| **Image-to-image (raster)** | $0.04 | 40 |
| **Image-to-image (vector)** | $0.08 | 80 |
| **Inpainting (raster)** | $0.04 | 40 |
| **Replace background (raster)** | $0.04 | 40 |
| **Style creation** | $0.04 | 40 |
| **Vectorization** | $0.01 | 10 |
| **Background removal** | $0.01 | 10 |
| **Crisp upscale** | $0.004 | 4 |
| **Creative upscale** | $0.25 | 250 |
| **Erase region** | $0.002 | 2 |
| **Variate** | $0.04 | 40 |

**Rule of thumb:** Vector = 2x raster price. V4 Pro = ~6x standard price. Processing ops (vectorize, bg remove, crisp upscale, erase) are very cheap.

### Cost-Efficient Workflows

- Generate raster at standard resolution, then crisp upscale ($0.044 total) instead of using V4 Pro ($0.25)
- Use crisp upscale for batch processing over creative upscale (62x cheaper)
- Vectorize rasters ($0.01) instead of generating vectors ($0.08) when quality is acceptable — but native vector is better quality
- Generate 1 image and iterate rather than generating 6 at once

---

## 10. Relevance to Kvalt Design System

### Immediate Use Cases

1. **Illustration generation** — Generate hand-drawn watercolor illustrations matching Kvalt's Icons8 Ouch style using custom styles from existing illustrations
2. **Vector icon generation** — Native SVG output for DS icon sets
3. **Component mockups** — Generate realistic UI screenshots for documentation
4. **Background/texture generation** — Create unique backgrounds for hero sections

### Custom Style Workflow for Kvalt

1. Upload 3-5 existing Kvalt illustrations as reference images
2. Create a custom style with `digital_illustration` base + style prompt describing "hand-drawn watercolor with loose brushwork, warm salmon and sage-green accents, organic shapes"
3. Save the styleID for all future generations
4. Use short prompts for consistency: "person reading a book", "team collaborating", etc.

### Substyles Worth Exploring for Kvalt

- `hand_drawn` — matches Kvalt's organic aesthetic
- `watercolor` (V2) — directly aligns with illustration style
- `freehand_details` — loose, artisanal quality
- `pastel_sketch` — soft, approachable feel
- `nostalgic_pastel` — warm, inviting palette

### Integration Architecture

The Recraft MCP tools are already connected. A skill file would orchestrate:
1. Style creation from Kvalt references (one-time setup)
2. Image generation with consistent style
3. Background removal for transparency
4. Vectorization for icon work
5. Crisp upscale for production assets
6. Optimization via existing Sharp pipeline

---

## Sources

- [Recraft Prompting Best Practices](https://www.recraft.ai/docs/best-practices/prompting-and-image-generation)
- [How to Craft Prompts for AI Images](https://www.recraft.ai/blog/how-to-craft-prompts-for-accurate-ai-generated-images)
- [Recraft API Endpoints](https://www.recraft.ai/docs/api-reference/endpoints)
- [Recraft API Pricing](https://www.recraft.ai/docs/api-reference/pricing)
- [Recraft Model Comparison](https://www.recraft.ai/blog/comparing-popular-and-high-performing-text-to-image-models-and-providers)
- [Creating Custom Styles](https://www.recraft.ai/docs/recraft-studio/styles/custom-styles/how-to-create-a-custom-style)
- [Unique AI Art Styles](https://www.recraft.ai/blog/unique-ai-art-styles)
- [Consistent Image Sets](https://www.recraft.ai/blog/how-to-create-image-sets)
- [Vectorization Tips](https://www.recraft.ai/blog/vectorization-tips-every-designer-should-know)
- [Upscaling Documentation](https://www.recraft.ai/docs/recraft-studio/format-conversions-and-scaling/upscaling)
- [Introducing Recraft V4](https://www.recraft.ai/blog/introducing-recraft-v4-design-taste-meets-image-generation)
- [Recraft V4 on Replicate](https://replicate.com/blog/recraft-v4)
- [Recraft Delivers Predictable Results](https://www.recraft.ai/blog/recraft-delivers-predictable-results-unlike-the-unruly-child-midjourney-s)
- [Best AI Image Models 2026](https://www.teamday.ai/blog/best-ai-image-models-2026)
- [Recraft AI Pricing Guide](https://www.eesel.ai/blog/recraft-ai-pricing)
- [Recraft AI Review - DesignWhine](https://www.designwhine.com/recraft-ai-review/)
- [Recraft V4 - WaveSpeedAI](https://wavespeed.ai/blog/posts/recraft-v4-small-company-tops-ai-image-generation-2026/)
- [Recraft Pricing Update](https://www.recraft.ai/blog/pricing-update)
- [Recraft AI on X - API Pricing](https://x.com/recraftai/status/1902768444325384468)
