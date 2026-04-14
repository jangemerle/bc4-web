# Exercise 03: Events & Handlers

## Why this matters
Every interactive component in Kvalt responds to events — clicks, key presses, focus, hover, pointer down/up. Your `usePress` hook is entirely built on event handling. Understanding how events flow through React (and the DOM) means understanding *why* things like `stopPropagation`, `preventDefault`, and event delegation exist.

## The concept
React wraps native DOM events in **SyntheticEvents** — they have the same interface but React manages them for you. Event handlers are passed as props: `onClick`, `onKeyDown`, `onMouseEnter`, etc.

**Important distinction:** `onClick={() => doSomething()}` creates a new function every render. `onClick={doSomething}` passes a stable reference. This matters for performance later (memoization), but for now just be aware of the difference.

Events **bubble up** through the component tree, just like in the DOM. If you click a button inside a card inside a page, the click event hits the button first, then the card, then the page — unless someone calls `stopPropagation()`.

## Your task
Build an interactive color swatch picker.

**Requirements:**
1. Display a grid of 8 color swatches (simple colored divs)
2. Clicking a swatch selects it (highlight with a border)
3. Hovering a swatch shows its hex code in a preview area
4. Pressing `Escape` deselects the current selection
5. Pressing arrow keys (←→) moves the selection through the swatches

**Rules:**
- Define your event handlers as named functions, not inline arrows (for readability)
- Type your event handler parameters properly: `(e: React.MouseEvent<HTMLDivElement>)` not just `(e: any)`
- The keyboard navigation requires attaching a `onKeyDown` handler — think about *which element* needs to receive keyboard events and why (hint: `tabIndex`)

## Stretch goals
- Add a "Copy hex" button that copies the selected color to clipboard using `navigator.clipboard.writeText()`
- Make the grid wrap responsively — 4 columns on wide, 2 on narrow (CSS only, no JS)
- What happens if you click a swatch that's *inside* a parent div that also has an `onClick`? Try it. Then fix it with `stopPropagation`.

## Connection to your DS
Open `src/hooks/usePress.ts`. That hook is fundamentally about event handling — `onPointerDown`, `onPointerUp`, `onPointerLeave`. It manages state transitions triggered by events, which is exactly what your swatch picker does (hover → show preview, click → select). Also look at `DropdownMenu.tsx` — its keyboard navigation (ArrowDown/Up/Home/End) is the same concept you're implementing here with arrow keys.

## Key questions to answer after completing
1. Why do you need `tabIndex` for a div to receive keyboard events?
2. What's the difference between `e.target` and `e.currentTarget`?
3. When would you use `preventDefault()` vs `stopPropagation()`?
