# Exercise 01: State & Rendering

## Why this matters
Every Kvalt component uses `useState`. Your Button tracks hover, your Modal tracks open/closed, your Toggle tracks on/off. But do you know *why* calling `setState` makes the screen update? Understanding the render cycle is the single most important React concept — everything else builds on it.

## The concept
React components are **functions that return JSX**. Every time React calls your function, it produces a new description of what the UI should look like. React then compares the new description with the previous one and updates only what changed in the DOM.

`useState` gives you a value that **persists between renders** and a setter that **triggers a new render**. That's it. The setter doesn't change the variable immediately — it schedules a re-render, and on the *next* render, `useState` returns the new value.

## Your task
Build a simple counter with three buttons: decrement, reset, increment.

**Requirements:**
1. Display the current count
2. Three buttons: `-`, `Reset`, `+`
3. The count should never go below 0
4. Add a "render counter" that shows how many times the component has rendered (hint: you'll need `useRef` for this — think about *why* useState wouldn't work here)

## Stretch goals
- Add a text input where the user types a number, and a "Set" button that jumps to that number
- What happens if you call `setCount(count + 1)` three times in a row? What about `setCount(prev => prev + 1)` three times? Try both and explain why they behave differently.

## Connection to your DS
Open `src/components/Toggle.tsx`. Find where it uses `useState`. That's the same pattern — a boolean instead of a number, but the mechanism is identical. The Toggle's `onChange` callback is just passing the new state up to the parent, the same way your counter buttons will call the setter.

## Key questions to answer after completing
1. What triggers a re-render?
2. Why does `useRef` not cause a re-render when you update `.current`?
3. If you set state to the *same value* it already has, does React re-render?
