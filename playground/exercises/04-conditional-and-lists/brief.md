# Exercise 04: Conditional Rendering & Lists

## Why this matters
Almost every component in Kvalt conditionally shows or hides something. Your Select shows a placeholder *or* the selected value. Your DropdownMenu renders a search field *only* when `search && size === 'md'`. Your DropdownMenuItem changes its entire layout depending on whether it's a `user` variant, has a `checkbox`, or is `selected`. And both components render lists of items from arrays. These two patterns — "show this *or* that" and "render one of these *for each* item" — are the backbone of every UI you'll build in React.

## The concept

### Conditional rendering
React doesn't have a template language with `v-if` or `{{#if}}`. You use plain JavaScript:

- **Ternary** — `{isOpen ? <Panel /> : null}` — render one thing or another
- **Logical AND** — `{isOpen && <Panel />}` — render something or nothing
- **Early return** — `if (!data) return <Loading />` — bail out of the whole component
- **Variable assignment** — assign JSX to a variable based on conditions, then render the variable

Each has a place. Ternary is for "A or B". AND is for "A or nothing". Early return is for guard clauses. Variable assignment is for complex multi-branch logic where inline ternaries would be unreadable.

**Gotcha:** `{count && <Tag />}` renders `0` on screen when count is `0`, because `0` is falsy but it's still a valid React child. Use `{count > 0 && <Tag />}` instead.

### Rendering lists
Use `.map()` to turn an array of data into an array of JSX elements. Every item needs a `key` — a stable, unique identifier that helps React track which items changed, were added, or removed.

```tsx
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

**Why keys matter:** Without them (or with index-as-key), React can't tell items apart. If you reorder or filter a list, React will re-render everything instead of just moving DOM nodes. Worse, it can mix up component state between items.

## Your task
Build a **filterable contact list** with a detail panel.

**Requirements:**
1. Start with a hardcoded array of 6–8 contacts, each with: `id`, `name`, `email`, `role` (e.g. "Designer", "Engineer", "PM"), and `active` (boolean)
2. Render the contacts as a list — each item shows the name, role, and an active/inactive indicator
3. Add a text input that filters contacts by name (case-insensitive). When the filter is empty, show all contacts
4. Clicking a contact selects it and shows a **detail panel** beside/below the list with all their info
5. If no contact is selected, show an empty state message instead of the detail panel
6. Add a "Show active only" toggle (a checkbox) that filters to only `active: true` contacts
7. When the filtered list is empty (no matches), show a "No contacts found" message instead of the list

**Rules:**
- Use `.map()` with proper `key` props for the list (not array index)
- Use at least one ternary, one `&&` pattern, and one early return in your solution
- Type your contact data with a TypeScript `interface`

## Stretch goals
- Add a role filter: a row of buttons ("All", "Designer", "Engineer", "PM") that filters by role. The active filter should be visually highlighted.
- Allow multiple filters simultaneously — text search + role filter + active-only should all compose together
- Add a count badge: "Showing 3 of 8 contacts" that updates as filters change
- Sort the list alphabetically, with active contacts first

## Connection to your DS
Open `src/components/Select.tsx` — look at lines 262–263:
```tsx
{selectedOption?.label ?? placeholder}
```
That's a conditional render: show the selected option's label, or fall back to placeholder text. Exactly what your detail panel does (show contact info or empty state).

Now look at `Select.tsx` lines 287–295 — the `options.map()` call. That's list rendering with keys, filtering through to DropdownMenuItem components. Your contact list does the same thing.

Then open `src/components/DropdownMenu.tsx` and look at the DropdownMenuItem component (line 298 onward). The entire render is a conditional tree: if `user` prop exists, render the user layout; otherwise render the standard layout with optional `checkbox`, optional `icon`, and optional `selected` checkmark. Count the conditionals — there are at least 6 in that one component. That's real-world conditional rendering.

## Key questions to answer after completing
1. When should you use a ternary vs. `&&` vs. early return for conditional rendering?
2. Why is using array index as a key problematic when the list can be filtered or reordered?
3. What happens when you chain `.filter().filter().map()` — is there a performance concern, and at what scale would it matter?
