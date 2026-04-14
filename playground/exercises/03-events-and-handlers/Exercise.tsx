/**
 * Exercise 03: Events & Handlers
 *
 * Read brief.md first, then fill in the TODOs below.
 */

// TODO 1: Import what you need from React
import { useState } from 'react';

// Some colors to work with
const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

export default function Exercise() {
  // TODO 2: State for the selected color index (null = nothing selected)

  // TODO 3: State for the hovered color (for the preview area)


  // TODO 4: Create a named handler for clicking a swatch
  //         Type it properly: (index: number) => void
  //         or as a React.MouseEvent handler if you prefer


  // TODO 5: Create a named handler for hovering a swatch
  //         It should update the preview area with the hex code


  // TODO 6: Create a named handler for keyboard events
  //         - Escape: deselect
  //         - ArrowRight: move selection forward
  //         - ArrowLeft: move selection backward
  //         - Wrap around at the edges
  //
  //  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
  //    ...
  //  }


  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>03 — Events & Handlers</h2>

      {/* TODO 7: The preview area — show the hovered color's hex code */}
      <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
        {/* hovered hex or "Hover over a swatch" */}
      </p>

      {/* TODO 8: The swatch grid
          - Make this div focusable (why do you need this for keyboard events?)
          - Attach your keyboard handler here
          - Map over COLORS to render swatch divs
          - Each swatch needs: click handler, hover handler, visual selected state
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          maxWidth: 280,
          outline: 'none',
        }}
        // keyboard handler and tabIndex go here
      >
        {/* map over COLORS here */}
      </div>

      {/* TODO 9: Show which color is selected below the grid */}
      <p style={{ marginTop: '1rem', fontWeight: 600 }}>
        {/* selected color or "None selected" */}
      </p>

      {/* STRETCH: "Copy hex" button using navigator.clipboard */}
    </div>
  );
}
