# Kvalt — Component Index

Complete reference of all components in the Kvalt Design System, with their variants, sizes, states, and key features.

## Components Overview

| Component | Figma Source | Variants | Sizes | States | Description |
|-----------|--------------|----------|-------|--------|-------------|
| **Badge** | node 1928:9521 | neutral, accent | sm, md | default | Displays a small count or label badge with optional variants |
| **Button** | node 8848:48381 | primary, secondary, link, danger, danger-subtle, success, success-subtle | sm, md, lg | default, hover, active, disabled | Interactive button with multiple variants and content options (icon, text, multichoice) |
| **Checkbox** | node 1928:9605 | unchecked, checked, indeterminate | sm, md, lg | default, hover, active, disabled, invalid | Animated checkbox with check or minus icon states |
| **Chip** | node 5240:31339 | default, icon, user | sm, md | default, hover | Tag component with optional icon, avatar, or removal action |
| **DatePicker** | Topic Board New / Date Picker | — | — | — | Calendar with range/single selection, presets, and month navigation |
| **DropdownMenu** | node 7944:36720 | single-select, multi-select | sm, md | default, hover, active, selected, disabled | Floating panel with action items, search, and dividers |
| **Icon** | — | — | sm, md, lg, xl | — | Wrapper around lucide-react icons with enforced sizing and stroke |
| **Input** | nodes 1937:7489, 1935:0 | — | sm, md, lg | default, hover, focus, disabled, readonly, invalid | Text input with label, caption, and optional icons/buttons |
| **Modal** | node 8851:27724 | — | — | — | Centered overlay panel with header, scrollable content, and footer |
| **NumberInput** | node 1935:3232 | — | sm, md, lg | default, hover, focus, disabled, readonly, invalid | Numeric input with increment/decrement buttons |
| **RadioButton** | node 1928:9703 | unchecked, checked | sm, md, lg | default, hover, active, disabled, invalid | Fully round radio button with dot animation |
| **SearchInput** | — | — | sm, md, lg | — | Wrapper around Input with search icon and clear button |
| **Select** | node 1945:8305 | — | sm, md, lg | default, hover, focus, disabled, readonly, invalid | Dropdown select field using DropdownMenu for options |
| **Skeleton** | — | text, circular, rectangular | sm, md, lg | — | Animated loading placeholder with multiple variants |
| **Tabs** | node 1928:9794 | — | sm, md, lg | default, hover, selected | Tab navigation with optional icons and badges |
| **TextArea** | node 1935:2175 | — | sm, md, lg | default, hover, focus, disabled, readonly, invalid | Multi-line text input with label and caption |
| **Toggle** | — | off, on | sm, md, lg | default, hover, active, disabled, invalid | Switch component with animated track and thumb |
| **UserAvatar** | node 5240:30710 | initials, icon, photo | xs, sm, md, lg | — | Profile avatar with initials, icon, or image; includes UserAvatarLabel compound |

---

## Component Details

### Badge
**Figma:** node 1928:9521

- **Variants:** neutral (surface-3 bg), accent (danger-1 bg, white text)
- **Sizes:** sm (16px min-w, 10px text), md (20px min-w, 12px text)
- **Usage:**
  ```tsx
  <Badge>3</Badge>
  <Badge variant="accent">5</Badge>
  <Badge size="sm">2</Badge>
  ```

### Button
**Figma:** node 8848:48381

- **Variants:** primary, secondary, elevated, link, danger, danger-subtle, success, success-subtle
- **Sizes:** sm (32px), md (40px), lg (48px)
- **States:** default, hover, active, disabled
- **Content Options:** text, iconLeft, iconRight, iconOnly, multichoice (appends ChevronDown)
- **Variant selection by background:**
  - `secondary` — use on `surface-1` (white) backgrounds
  - `elevated` — use on any tinted surface (`surface-2` and above, `bg`, grey cards). The shadow lifts it off the coloured background.
- **Usage:**
  ```tsx
  <Button>Save</Button>
  <Button variant="secondary" size="sm">Cancel</Button>   {/* on white bg */}
  <Button variant="elevated" size="sm">Play</Button>       {/* on grey/tinted bg */}
  <Button variant="danger" iconLeft={Trash2}>Delete</Button>
  <Button variant="primary" iconOnly={Plus} aria-label="Add item" />
  <Button variant="secondary" multichoice>Options</Button>
  ```

### ContentSwitcher
**Figma:** Whatever Design System / node 2814:14291

- **Sizes:** sm (32px), md (40px), lg (48px)
- **Variants:** default (white active bg) | accent (dark active bg)
- **Props:** `fill` (equal-width items fill container), `accent` (dark active indicator)
- **Item props:** `value`, `icon` (optional leading icon), `disabled`
- **Animation:** Sliding active indicator via `layoutId` + `spring.snappy`
- **Usage:**
  ```tsx
  <ContentSwitcher value={view} onChange={setView} size="sm">
    <ContentSwitcherItem value="list">List</ContentSwitcherItem>
    <ContentSwitcherItem value="grid" icon={Grid}>Grid</ContentSwitcherItem>
  </ContentSwitcher>

  <ContentSwitcher value={view} onChange={setView} accent fill>
    <ContentSwitcherItem value="a">Option A</ContentSwitcherItem>
    <ContentSwitcherItem value="b">Option B</ContentSwitcherItem>
  </ContentSwitcher>
  ```

### Checkbox
**Figma:** node 1928:9605

- **Sizes:** sm (16px), md (20px), lg (24px)
- **Types:** unchecked, checked (check icon), indeterminate (minus icon)
- **States:** default, hover, active, disabled, invalid
- **Animations:** Check/minus stroke draw with pathLength, box fill with background color transition
- **Hover behavior:** Ghost icon at 50% opacity (unchecked); bg shifts to on-secondary-2 (checked)
- **Usage:**
  ```tsx
  <Checkbox />
  <Checkbox size="lg" disabled />
  ```

### Chip
**Figma:** node 5240:31339

- **Sizes:** sm, md
- **Variants:** default (text only), icon (with leading icon), user (with avatar)
- **States:** default, hover (CSS :hover) — only when clickable
- **Optional:** Removable X button to dismiss
- **Usage:**
  ```tsx
  <Chip>Design</Chip>
  <Chip clickable={false}>Read-only tag</Chip>
  <Chip icon={Sparkles}>AI Generated</Chip>
  <Chip user={{ initials: 'DT' }}>David T.</Chip>
  <Chip removable onRemove={() => {}}>Tag</Chip>
  ```

### DatePicker
**Figma:** Topic Board New / Date Picker

- **Features:**
  - Range selection (click start, click end)
  - Single date selection (click same day twice)
  - Preset ranges (Today, Yesterday, Last 7/14/30 days, etc.)
  - Month/year navigation
  - Optional time inputs
  - Keyboard accessible
- **Usage:**
  ```tsx
  <DatePicker
    value={{ start: new Date(), end: new Date() }}
    onChange={(range) => console.log(range)}
  />
  ```

### DropdownMenu
**Figma:** node 7944:36720

- **Structure:** Floating panel with action items, optional search, dividers
- **Sizes:** sm (32px items, 2px gap), md (40px items, 1px gap, optional search)
- **Styling:** radius-lg (12px), shadow large-3, 8px padding
- **Action item states:** default (transparent), hover (surface-3), active (surface-4), selected (inverted-surface), disabled (opacity-30)
- **Selection:** Single-select with checkmark, multi-select with checkbox
- **Usage:**
  ```tsx
  <DropdownMenu open={open} onClose={close}>
    <DropdownMenuItem>Option 1</DropdownMenuItem>
    <DropdownMenuItem selected>Option 2</DropdownMenuItem>
  </DropdownMenu>
  ```

### Icon
**Wrapper around lucide-react icons**

- **Enforces:** Standard size scale (sm / md / lg / xl)
- **Stroke width:** Locked to 2
- **Color:** Via `currentColor` (inherits from CSS)
- **Usage:**
  ```tsx
  import { Search } from 'lucide-react';
  <Icon icon={Search} />
  <Icon icon={Search} size="sm" />
  <Icon icon={Search} size="xl" className="text-color-primary-1" />
  ```

### Input
**Figma:** nodes 1937:7489, 1935:0

- **Sizes:** sm (32px), md (40px), lg (48px)
- **States:** default, hover, focus, disabled, readonly, invalid
- **Slots:** label, caption, iconLeft, icon (right), buttonRight
- **Usage:**
  ```tsx
  <Input label="Email" placeholder="you@example.com" />
  <Input label="Name" placeholder="Enter name" caption="Required" />
  <Input label="Password" icon={Eye} placeholder="••••••••" />
  <Input label="Search" iconLeft={Search} placeholder="Search…" />
  <Input label="Email" invalid errorMessage="Nope nope nope" />
  ```

### Modal
**Figma:** node 8851:27724

- **Structure:** Overlay + centered panel with header, scrollable content, footer
- **Width:** 600px (default, customizable)
- **Styling:** radius-l (12px), shadow large-2
- **Animations:** Enter (overlay fade-in + panel spring), Exit (overlay fade-out + panel shrink)
- **Usage:**
  ```tsx
  <Modal open={open} onClose={() => setOpen(false)} title="Topic settings">
    <p>Content here</p>
  </Modal>
  <Modal open={open} onClose={close} title="Confirm" footer={<Button>Save</Button>}>
    ...
  </Modal>
  ```

### NumberInput
**Figma:** node 1935:3232

- **Sizes:** sm (32px), md (40px), lg (48px)
- **States:** default, hover, focus, disabled, readonly, invalid
- **Features:** Increment/decrement buttons, min/max/step controls
- **Slots:** label, caption
- **Usage:**
  ```tsx
  <NumberInput label="Quantity" />
  <NumberInput label="Amount" value={42} min={0} max={100} step={1} />
  <NumberInput label="Count" size="sm" caption="Min 0" />
  <NumberInput label="Age" invalid errorMessage="Nope nope nope" />
  ```

### RadioButton
**Figma:** node 1928:9703

- **Sizes:** sm (16px), md (20px), lg (24px)
- **Shape:** Fully round (border-radius: 100px)
- **States:** default, hover, active, disabled, invalid
- **Checked state:** inverted-surface fill + white inner dot (50% of box)
- **Hover state:** Ghost dot appears inside (~62% inset)
- **Animations:** Dot scale spring, ring color spring, ring pulse on select
- **Colors:**
  - Hover/Active: #4571ab (secondary-700)
  - Disabled: #c0c8c8
  - Invalid: #d23031

### SearchInput
**Wrapper around Input**

- **Features:** Search icon (left) + clear button (right)
- **Sizes:** sm, md, lg (inherited from Input)
- **Usage:**
  ```tsx
  <SearchInput placeholder="Search" />
  <SearchInput placeholder="Search" size="sm" />
  <SearchInput value={query} onChange={e => setQuery(e.target.value)} onClear={() => setQuery('')} />
  ```

### Select
**Figma:** node 1945:8305

- **Sizes:** sm (32px), md (40px), lg (48px)
- **States:** default, hover, focus, disabled, readonly, invalid
- **Features:** Uses DropdownMenu for options panel
- **Slots:** label, caption, options
- **Usage:**
  ```tsx
  <Select label="Country" placeholder="Select..." options={[{ value: 'us', label: 'USA' }]} />
  <Select label="Size" placeholder="Pick one" size="sm" options={options} />
  <Select label="Role" invalid errorMessage="Nope nope nope" options={options} />
  ```

### Skeleton
**Animated loading placeholder**

- **Variants:** text, circular, rectangular
- **Sizes:** sm, md, lg (affects height for text, diameter for circular)
- **Animation:** spring.playful (bounce: 0.25) for lively shimmer pulse
- **Pre-composed variants:** Skeleton.Card, Skeleton.List
- **Usage:**
  ```tsx
  <Skeleton />
  <Skeleton variant="circular" size="lg" />
  <Skeleton variant="rectangular" height={120} />
  <Skeleton width="60%" />
  <Skeleton lines={3} />
  <Skeleton.Card />
  <Skeleton.List rows={5} />
  ```

### Tabs
**Figma:** node 1928:9794

- **Sizes:** sm (32px, Inter Bold 14px), md (40px, Inter SemiBold 16px), lg (50px, Borna Bold 18px)
- **Gap:** 28px between tab items
- **Styling:** Full-width 1px bottom border, animated 2px selected indicator
- **Colors:** Selected (on-secondary-1), Default (on-surface-subtle-1), Hover (on-surface)
- **Optional:** Icon (left, 4px gap), badge (pill, surface-3 bg)
- **Usage:**
  ```tsx
  <Tabs value={tab} onChange={setTab}>
    <Tab value="overview">Overview</Tab>
    <Tab value="files" icon={FileText}>Files</Tab>
    <Tab value="messages" badge={3}>Messages</Tab>
  </Tabs>
  ```

### TextArea
**Figma:** node 1935:2175

- **Sizes:** sm (32px row-height), md (40px), lg (48px)
- **States:** default, hover, focus, disabled, readonly, invalid
- **Slots:** label, caption
- **Usage:**
  ```tsx
  <TextArea label="Description" placeholder="Placeholder" />
  <TextArea label="Notes" placeholder="Placeholder" caption="Optional" />
  <TextArea label="Bio" invalid errorMessage="Nope nope nope" />
  <TextArea label="Small" size="sm" placeholder="Placeholder" />
  ```

### Toggle
**Switch component**

- **Sizes:** sm (28×16px), md (36×20px), lg (44×24px)
- **States:** default, hover, active, disabled, invalid
- **Colors:**
  - Off: neutral track (#c8d1d1) + white thumb (left)
  - On: inverted-surface track + white thumb (right)
  - Hover off: #b0bcbc (darker neutral) + thumb scale 1.18
  - Hover on: #4571ab (secondary-700) + thumb scale 1.18
- **Animations:** Thumb slide (spring.default), track color (duration.instant), press feedback (spring.snappy)
- **Usage:**
  ```tsx
  <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} label="Dark mode" />
  <Toggle checked={on} onChange={(e) => setOn(e.target.checked)} size="lg" />
  ```

### UserAvatar
**Figma:** node 5240:30710

- **Sizes:** xs (20px), sm (24px), md (32px), lg (40px)
- **Types:** initials, icon, photo
- **Compound:** UserAvatarLabel — avatar + name + optional caption
- **Usage:**
  ```tsx
  <UserAvatar initials="TV" />
  <UserAvatar initials="DT" size="lg" />
  <UserAvatar src="/photos/jane.jpg" alt="Jane" size="md" />
  <UserAvatar icon={User} size="sm" />

  <UserAvatarLabel initials="TV" name="Thomas Vybert" />
  <UserAvatarLabel initials="TV" name="Thomas Vybert" caption="donda@grouweapps.com" size="lg" />
  ```

---

## Animation Standards

All components follow the Kvalt motion guidelines:
- **Press animations:** Use the `usePress` hook (not `whileTap`)
- **Timing tokens:** Import from `src/tokens/motion.ts` — never hardcode durations
- **Spring configs:** spring.snappy, spring.default, spring.playful
- **Durations:** duration.instant (100ms), duration.fast (160ms), duration.base (240ms), duration.moderate (340ms), duration.slow (480ms)

See `/CLAUDE.md` for detailed animation implementation guidelines.

---

## Quick Links

- **All component files:** `/src/components/`
- **Animation tokens:** `/src/tokens/motion.ts`
- **Icon sizes:** `/src/tokens/icons.ts`
- **usePress hook:** `/src/hooks/usePress.ts`
- **Design guidelines:** `/CLAUDE.md`
