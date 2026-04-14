# Pixel Art Generation — Tools, Algorithms & Frameworks Research

**Source:** Multi-source research (GitHub, npm, itch.io, Red Blob Games, academic refs)
**Added:** 2026-03-28
**Context:** Planning four new generative modes for PixelForge: Cellular Automata, Noise Landscapes, Wave Function Collapse, and Particle Painter.

---

## 1. Cellular Automata

**What it is:** A grid of cells with binary states (alive/dead) evolving through neighbor-based rules. Perfect for caves, organic blobs, dungeon terrain.

**Core algorithm:**
- Initialize grid randomly (~45% alive gives best cave results)
- Apply rules per tick: B678/S345678 (birth if 6-8 neighbors, survive if 3-8)
- Run 4-6 iterations to smooth into natural cave shapes
- Smoothing pass: B5678/S5678
- Flood-fill to find connected regions (critical for playable maps)

**Key parameters:** initial fill %, birth threshold, survival threshold, iteration count, grid size.

**Variants beyond caves:**
- Game of Life rules → crystalline/geometric patterns
- Brian's Brain (3-state) → pulsing, animated textures
- Custom rulesets → coral, moss, lichen patterns
- Multi-state automata → terrain with elevation layers

**JS implementations:**
- Pure canvas — no library needed, just a 2D array + neighbor counting
- [cnidario/ca-pixi](https://github.com/cnidario/ca-pixi) — PixiJS renderer
- [Excalibur.js blog post](https://excaliburjs.com/blog/Cellular%20Automata/) — clean tutorial

**Relevance to PixelForge:** Maps directly to existing `PixelGrid` type. Rules become a config object. Output is a grid of palette indices (alive=terrain color, dead=transparent). Can reuse `Int8Array` pixel storage.

---

## 2. Noise-Based Landscapes

**What it is:** Continuous noise functions (Perlin, Simplex, OpenSimplex) mapped to color thresholds to produce terrain, clouds, lava, water.

**Best library for PixelForge:**
- **[simplex-noise](https://www.npmjs.com/package/simplex-noise)** (jwagner) — TypeScript, zero deps, ~2KB gzipped, 70M calls/sec, seedable via custom PRNG. `npm install simplex-noise`
- Supports 2D, 3D, 4D noise via `createNoise2D()`, `createNoise3D()`, etc.
- Accepts custom PRNG function → compatible with PixelForge's existing `createRng()` seeded randomizer

**Terrain generation technique (Red Blob Games method):**
1. Sample noise at each (x, y) → value in [-1, 1]
2. Normalize to [0, 1]
3. Apply elevation thresholds: <0.3 = water, 0.3-0.5 = sand, 0.5-0.7 = grass, 0.7-0.85 = forest, >0.85 = mountain
4. Map each threshold to a palette color index
5. Optional: layer multiple octaves (fractal Brownian motion) for detail

**Key parameters:** frequency, octaves (layers of detail), lacunarity (frequency multiplier per octave), persistence (amplitude decay per octave), threshold array + palette mapping, seed.

**Advanced techniques:**
- Domain warping: feed noise output back as input coordinates → organic distortion
- Ridged noise: `abs(noise)` creates mountain ridges
- Turbulence: sum of `abs(noise)` at multiple frequencies → marble/cloud
- Multi-channel: separate noise for temperature + moisture → biome blending

**Relevance to PixelForge:** Each pixel gets a palette index based on threshold. Output is a standard `PixelGrid`. The palette picker already supports enough colors for biome mapping. Frequency and octave sliders are natural UI controls.

---

## 3. Wave Function Collapse (WFC)

**What it is:** Constraint-solving algorithm that generates globally consistent patterns from local examples. Feed it a few tile patterns → it fills an entire grid where every NxN region matches something from the input.

**Two flavors:**
- **Simple Tiled Model:** define tiles + adjacency rules manually. Each tile declares which other tiles can be its neighbor on each side.
- **Overlapping Model:** extract NxN patterns from a sample image automatically. More magical, less control.

**Algorithm steps:**
1. Create "wave" grid — each cell is a superposition of all possible tiles
2. Find cell with lowest entropy (fewest remaining possibilities)
3. Collapse it to one tile (weighted random)
4. Propagate constraints to neighbors (remove now-impossible tiles)
5. Repeat until fully collapsed or contradiction (then backtrack/restart)

**Key parameters:** tile set, adjacency rules, tile weights/frequencies, grid size, seed, backtrack limit.

**JS implementations:**
- [mxgmn/WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) — reference implementation (C#), but algorithm is well-documented for porting
- [The Coding Train tutorial](https://thecodingtrain.com/challenges/171-wave-function-collapse/) — p5.js implementation, excellent walkthrough
- [Excalibur.js WFC](https://excaliburjs.com/blog/Wave%20Function%20Collapse/) — clean JS implementation
- [Boris the Brave's tips](https://www.boristhebrave.com/2020/02/08/wave-function-collapse-tips-and-tricks/) — practical implementation advice

**Used in:** Bad North, Caves of Qud, Townscaper, Dead Static Drive.

**Relevance to PixelForge:** The Simple Tiled Model fits perfectly — tiles ARE pixel art. Users define small tile sprites using the existing editor, set adjacency rules, and WFC generates entire tilemaps. Output maps to `TilesetConfig` type already defined in types. Most complex to implement but highest "wow factor."

---

## 4. Particle Painter

**What it is:** Particles with physics (position, velocity, acceleration, forces) that deposit color onto a pixel grid as they move. Creates organic, flowing patterns.

**Core mechanics:**
- Each particle: `{ x, y, vx, vy, color, life, size }`
- Forces: gravity, noise-driven flow fields, attraction/repulsion to points, friction/damping
- On each tick: update velocity from forces → update position → deposit color at current pixel
- Color deposition: blend with existing pixel or overwrite, optionally fade over time

**Flow field variant (highest quality):**
- Generate a 2D noise field (reuse simplex-noise library)
- At each grid cell, noise value → angle → vector
- Particles follow vectors, leaving color trails
- Vary noise seed per frame for animated evolution

**Flocking/boids variant:**
- Separation (avoid crowding neighbors)
- Alignment (steer toward average heading)
- Cohesion (steer toward average position)
- Produces swarm patterns that deposit color along paths

**Key parameters:** particle count, spawn position/pattern, force strengths, friction, lifetime, trail length, color mode (palette cycling, fixed, noise-based), flow field resolution.

**No library needed** — vanilla Canvas 2D or direct pixel buffer manipulation. The physics is straightforward vector math. For performance with 10K+ particles, use typed arrays or offscreen canvas.

**Libraries if desired:**
- p5.js — for rapid prototyping, but adds weight
- c2.js — computational geometry + physics
- tsParticles — config-driven, but opinionated

**Relevance to PixelForge:** Particles write to the same `PixelGrid` via `setPixel()`. The palette system constrains output to the chosen color set (snap particle color to nearest palette entry). This mode bridges generative art and pixel art — the pixel constraint is what makes it distinctive.

---

## 5. Additional Techniques Worth Considering

### Reaction-Diffusion (Gray-Scott model)
Two chemicals (A, B) react and diffuse across a grid. Produces Turing patterns (spots, stripes, labyrinthine). Parameters: feed rate, kill rate, diffusion rates. Stunning but slow without WebGL shaders. Could be a future "advanced" mode.

### L-Systems (Lindenmayer Systems)
String-rewriting grammars that produce fractal structures. Perfect for procedurally generated pixel art trees, plants, vines, coral. Rules like `F → F[+F]F[-F]F` expand into branching structures rendered onto a pixel grid.

### Marching Squares
Converts a scalar field (noise values) into contour lines/regions. Useful as a post-processing step on noise landscapes to create clean biome boundaries instead of hard threshold steps.

### Voronoi Diagrams
Partition space by nearest seed point. Each Voronoi cell gets a palette color. Produces stained-glass / crystal / territory-map patterns. Fortune's algorithm or brute-force (fine for small grids).

---

## 6. Recommended Implementation Stack for PixelForge

| Layer | Tool | Why |
|-------|------|-----|
| Noise | `simplex-noise` (npm) | TypeScript, seedable, tiny, blazing fast |
| RNG | Existing `createRng()` in PixelForge | Already seeded, consistent with current architecture |
| Rendering | Existing `PixelCanvas` component | Canvas 2D with pixelated rendering, already works |
| Grid storage | Existing `PixelGrid` / `Int8Array` | All four modes output to the same type |
| WFC solver | Custom implementation (~200-300 lines) | Simple Tiled Model only, no heavy library needed |
| Particle physics | Vanilla typed arrays | No library — just Vec2 math, deposit to grid |
| UI controls | Existing sidebar pattern in App.tsx | Add mode tabs, each mode gets its own control panel |

**Key architectural decision:** All four modes should output a standard `PixelGrid` + `Palette` pair. This means export, preview, spritesheet — everything works for free.

---

## 7. Implementation Priority

1. **Noise Landscapes** — easiest, one npm install, immediate visual payoff, builds foundation (noise library) reused by Particle Painter
2. **Cellular Automata** — no dependencies, pure algorithm, teaches the pattern for rule-based generation
3. **Particle Painter** — uses noise from step 1, highest creative potential, most "generative art" feeling
4. **Wave Function Collapse** — most complex, but highest "magic" factor. Needs tile editor UI additions.

---

## Sources

- [simplex-noise.js](https://github.com/jwagner/simplex-noise.js) — Primary noise library
- [Red Blob Games: Terrain from Noise](https://www.redblobgames.com/maps/terrain-from-noise/) — Noise-to-terrain mapping reference
- [mxgmn/WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse) — WFC reference implementation
- [The Coding Train WFC](https://thecodingtrain.com/challenges/171-wave-function-collapse/) — JS tutorial
- [Boris the Brave WFC Tips](https://www.boristhebrave.com/2020/02/08/wave-function-collapse-tips-and-tricks/) — Practical advice
- [Jeremy Kun: Cellular Automaton Caves](https://www.jeremykun.com/2012/07/29/the-cellular-automaton-method-for-cave-generation/) — Algorithm deep-dive
- [Excalibur.js Cellular Automata](https://excaliburjs.com/blog/Cellular%20Automata/) — Clean JS implementation
- [Reaction-Diffusion Playground](https://jasonwebb.github.io/reaction-diffusion-playground/) — Interactive Gray-Scott demo
- [Lospec Procedural Generator](https://lospec.com/procedural-pixel-art-generator/) — Mask-based generator (similar to current PixelForge approach)
- [zfedoran/pixel-sprite-generator](https://github.com/zfedoran/pixel-sprite-generator) — Original JS sprite gen that inspired many clones
- [Morphogenesis Resources](https://github.com/jasonwebb/morphogenesis-resources) — Comprehensive list of generative algorithms
