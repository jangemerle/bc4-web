# Exercise 02: Props & Composition

## Why this matters
Props are how React components talk to each other. Every component in Kvalt receives props — your Button has `variant`, `size`, `disabled`. Your Modal has `isOpen`, `onClose`, `children`. Understanding props deeply means understanding component API design — and as a designer, you already think about this in Figma. Component properties in Figma *are* props.

## The concept
Props flow **one direction: parent → child**. A child can never modify its own props. If a child needs to communicate back up, the parent passes a *callback function* as a prop (like `onClick` or `onChange`).

`children` is a special prop — it's whatever you put *between* the opening and closing tags of a component. This is how composition works: instead of passing everything as props, you pass entire chunks of UI as children.

## Your task
Build a reusable `Card` component and use it to create a small dashboard.

**Requirements:**
1. Create a `Card` component that accepts:
   - `title` (string) — shown as a heading
   - `children` (ReactNode) — the card body content
   - `variant` (optional: `'default' | 'outlined'`) — controls the visual style
   - `footer` (optional: ReactNode) — content rendered at the bottom
2. Create 3 different cards using your component:
   - A stats card showing a number and label
   - A card with a list of items inside
   - A card with a footer containing a button

**Rules:**
- Define a TypeScript `interface` for your Card props (look at how Button.tsx does it)
- Use `children` for the body — don't pass body content as a string prop
- The `footer` prop is an example of the **"slot" pattern** — passing JSX as a prop for a specific position

## Stretch goals
- Add a `CardGroup` component that renders its children (Cards) in a flex row
- Make `CardGroup` accept a `columns` prop (2 | 3 | 4) that controls the grid

## Connection to your DS
Open `src/components/Modal.tsx`. Look at how it uses `children` for the modal body and has separate props for different "slots" (title, footer area). That's the same composition pattern you're building here. Also look at `Button.tsx` — notice how it uses a TypeScript interface to define exactly what props it accepts, with optional ones marked with `?`.

## Key questions to answer after completing
1. What's the difference between passing content as a prop vs. as children?
2. Why can't a child component modify its own props?
3. What does `React.ReactNode` mean, and how is it different from `string`?
