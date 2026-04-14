import { useState } from 'react';

/**
 * Playground shell — shows exercise list, loads the active one.
 *
 * Each exercise exports a default component from its folder.
 * To add a new exercise, just add it to the `exercises` array below.
 */

// --- Register exercises here ---
// Lazy-load so you only pay for the one you're working on.
const exercises = [
  {
    id: '01',
    title: 'State & Rendering',
    module: () => import('./exercises/01-state-and-rendering/Exercise'),
  },
  {
    id: '02',
    title: 'Props & Composition',
    module: () => import('./exercises/02-props-and-composition/Exercise'),
  },
  {
    id: '03',
    title: 'Events & Handlers',
    module: () => import('./exercises/03-events-and-handlers/Exercise'),
  },
  {
    id: '04',
    title: 'Conditional & Lists',
    module: () => import('./exercises/04-conditional-and-lists/Exercise'),
  },
];

export function PlaygroundApp() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ActiveComponent, setActiveComponent] = useState<React.FC | null>(null);
  const [loading, setLoading] = useState(false);

  const loadExercise = async (id: string, loader: () => Promise<{ default: React.FC }>) => {
    setLoading(true);
    setActiveId(id);
    try {
      const mod = await loader();
      setActiveComponent(() => mod.default);
    } catch {
      setActiveComponent(() => () => (
        <p style={{ color: '#e55' }}>
          No <code>Exercise.tsx</code> found yet — time to create it!
        </p>
      ));
    }
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: 960, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
        Kvalt — React Playground
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Pick an exercise. Write the code. Learn by doing.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {exercises.map((ex) => (
          <button
            key={ex.id}
            onClick={() => loadExercise(ex.id, ex.module)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 8,
              border: activeId === ex.id ? '2px solid #2563eb' : '2px solid #e2e8f0',
              background: activeId === ex.id ? '#eff6ff' : '#fff',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeId === ex.id ? 600 : 400,
            }}
          >
            {ex.id}. {ex.title}
          </button>
        ))}
      </div>

      <div style={{
        border: '2px solid #e2e8f0',
        borderRadius: 12,
        padding: '2rem',
        minHeight: 300,
        background: '#fafafa',
      }}>
        {loading && <p>Loading...</p>}
        {!loading && !ActiveComponent && (
          <p style={{ color: '#999' }}>Select an exercise to begin.</p>
        )}
        {!loading && ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}
