/**
 * Exercise 02: Props & Composition
 *
 * Read brief.md first, then fill in the TODOs below.
 */

// TODO 1: Import React (you'll need ReactNode for typing)


// TODO 2: Define a TypeScript interface for Card's props
//         Look at Button.tsx for how they define prop interfaces.
//
// interface CardProps {
//   ...
// }


// TODO 3: Build the Card component
//         - Show the title as a heading
//         - Render children as the body
//         - Conditionally render the footer if provided
//         - Apply different styles based on variant
//
// function Card({ ... }: CardProps) {
//   ...
// }


// --- Main exercise component ---
export default function Exercise() {
  return (
    <div>
      <h2 style={{ marginBottom: '1rem' }}>02 — Props & Composition</h2>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>

        {/* TODO 4: A stats card — pass a number + label as children */}


        {/* TODO 5: A card with a list — the <ul> goes inside as children */}


        {/* TODO 6: A card with a footer — pass a <button> via the footer prop */}

      </div>

      {/* STRETCH: Wrap the cards in a <CardGroup columns={3}> component */}

    </div>
  );
}
