# React Playground

A hands-on learning space inside Kvalt. Each exercise is a small, focused challenge that teaches one React concept — connected to patterns you're already using in the design system.

## How to run

```bash
# Option 1: dedicated command (opens playground directly)
npm run playground

# Option 2: use the normal dev server, visit /playground/
npm run dev
# then go to http://localhost:5173/playground/
```

## How it works

1. Pick an exercise from the list in the browser
2. Read the `brief.md` in that exercise folder — it explains the concept, the task, and connects it to your DS code
3. Open the `Exercise.tsx` file and fill in the TODOs
4. The browser hot-reloads as you save — instant feedback
5. When you think you're done, bring it to Cowork for review and discussion

## Exercise progression

| #  | Topic                  | You'll learn                                   | DS connection             |
|----|------------------------|-------------------------------------------------|---------------------------|
| 01 | State & Rendering      | useState, useRef, render cycle                  | Toggle, Modal             |
| 02 | Props & Composition    | Props, children, slots, TypeScript interfaces   | Button, Modal             |
| 03 | Events & Handlers      | Click, hover, keyboard, event typing, bubbling  | usePress, DropdownMenu    |
| 04 | Conditional & Lists    | *coming soon*                                   | DropdownMenu, Select      |
| 05 | Effects & Lifecycle    | *coming soon*                                   | DatePicker, Modal         |
| 06 | Refs & DOM Access      | *coming soon*                                   | Input, SearchInput        |
| 07 | Custom Hooks           | *coming soon*                                   | usePress, useReducedMotion|
| 08 | Context & Providers    | *coming soon*                                   | Toast (upcoming)          |
| 09 | Generics & TypeScript  | *coming soon*                                   | Table (upcoming)          |
| 10 | Performance            | *coming soon*                                   | Table, large lists        |

## Rules

- **Write the code yourself.** Don't ask Claude Code to solve it. The whole point is building muscle memory.
- **It's fine to look at your DS components** for reference — that's the bridge between what you've shipped and what you're learning.
- **Get stuck? Ask Cowork.** But try for at least 10 minutes first. The struggle is where learning happens.
- **Do the stretch goals.** They push you past "it works" into "I understand why."

## Adding new exercises

Create a folder in `exercises/` with a `brief.md` and `Exercise.tsx`, then register it in `PlaygroundApp.tsx`:

```ts
{
  id: '04',
  title: 'Conditional & Lists',
  module: () => import('./exercises/04-conditional-and-lists/Exercise'),
},
```
