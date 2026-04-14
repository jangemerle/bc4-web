/**
 * Exercise 01: State & Rendering
 *
 * Read brief.md first, then fill in the TODOs below.
 * Run with: npm run playground (or visit /playground/ when dev server is running)
 */

// TODO 1: Import what you need from React (useState, useRef)


export default function Exercise() {
  // TODO 2: Create a state variable called `count`, starting at 0


  // TODO 3: Create a ref to track how many times this component has rendered
  //         (increment it every render — but where exactly should that happen?)


  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>01 — State & Rendering</h2>

      {/* TODO 4: Display the current count */}
      <p style={{ fontSize: '2rem', fontWeight: 700 }}>
        {/* count goes here */}
      </p>

      {/* TODO 5: Three buttons — decrement (min 0), reset, increment */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {/* buttons go here */}
      </div>

      {/* TODO 6: Display the render count from your ref */}
      <p style={{ color: '#666', fontSize: '0.875rem' }}>
        {/* render count goes here */}
      </p>

      {/* STRETCH: Add a text input + "Set" button to jump to a specific number */}

    </div>
  );
}
