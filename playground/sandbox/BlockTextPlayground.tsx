import { useState } from 'react';
import { BlockText } from '../../src/components/BlockText';

const PRESETS = [
  'KVALT',
  'THE QUICK...',
  'DESIGN SYSTEM',
  'ABCDEFGHIJ',
  'KLMNOPQRST',
  'UVWXYZ',
];

export default function BlockTextPlayground() {
  const [text, setText] = useState('KVALT');
  const [size, setSize] = useState(64);
  const [color, setColor] = useState('#1a1a1a');
  const [bg, setBg] = useState('#ffffff');
  const [gap, setGap] = useState(0.15);

  return (
    <div style={{ padding: 32, fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: bg }}>
      <h2 style={{ fontSize: 14, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 24 }}>
        BlockText Playground
      </h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 32, alignItems: 'flex-end' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#666' }}>
          Text
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, width: 240, fontFamily: "'JetBrains Mono', monospace" }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#666' }}>
          Size ({size}px)
          <input
            type="range"
            min={16}
            max={128}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            style={{ width: 160 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#666' }}>
          Letter Gap ({gap.toFixed(2)})
          <input
            type="range"
            min={0}
            max={0.5}
            step={0.01}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
            style={{ width: 120 }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#666' }}>
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: 40, height: 32, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: '#666' }}>
          BG
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
            style={{ width: 40, height: 32, border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
          />
        </label>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => setText(preset)}
            style={{
              padding: '4px 12px',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              border: text === preset ? '1px solid #333' : '1px solid #ddd',
              borderRadius: 4,
              background: text === preset ? '#333' : '#fff',
              color: text === preset ? '#fff' : '#666',
              cursor: 'pointer',
            }}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Render */}
      <div style={{ padding: 40, borderRadius: 12, border: '1px solid #eee', background: bg, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <BlockText text={text} size={size} color={color} letterGap={gap} />
      </div>

      {/* JetBrains Mono comparison */}
      <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #eee' }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
          JetBrains Mono Comparison
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[400, 500, 700, 800].map((weight) => (
            <div key={weight} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 11, color: '#999', width: 40, fontFamily: "'JetBrains Mono', monospace" }}>{weight}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: weight, fontSize: size * 0.6, color, letterSpacing: '-0.02em' }}>
                {text || 'KVALT'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
