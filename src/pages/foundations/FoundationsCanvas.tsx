import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { spring } from '../../tokens/motion';
import { AsciiTexture, type AsciiPattern } from '../../components/AsciiTexture';
import { GlassSurface } from '../../components/GlassSurface';
import { usePress } from '../../hooks/usePress';

// ─── Pastel colors for sticky notes ─────────────────────────────────────────

const PASTEL_COLORS = [
  '#FFE4E1', // misty rose
  '#E8F5E9', // mint cream
  '#E3F2FD', // alice blue
  '#FFF9C4', // lemon chiffon
  '#F3E5F5', // lavender
  '#FFF3E0', // papaya whip
  '#E0F7FA', // light cyan
  '#FCE4EC', // pink lace
];

const pickRandomColor = () =>
  PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

const pickRandomPosition = () => ({
  x: 100 + Math.random() * (window.innerWidth - 350),
  y: 100 + Math.random() * (window.innerHeight - 300),
});

// ─── Foundation card data ───────────────────────────────────────────────────

interface FoundationCard {
  id: string;
  label: string;
  subtitle: string;
  pattern: AsciiPattern;
  seed: number;
}

const FOUNDATIONS: FoundationCard[] = [
  { id: 'colors',        label: 'Colors',        subtitle: 'Palette & semantics',  pattern: 'organic', seed: 42 },
  { id: 'typography',    label: 'Typography',    subtitle: 'Scales & families',    pattern: 'wave',    seed: 137 },
  { id: 'shadows',       label: 'Shadows',       subtitle: 'Depth & elevation',    pattern: 'terrain', seed: 256 },
  { id: 'border-radius', label: 'Border Radius', subtitle: 'Curves & corners',     pattern: 'crystal', seed: 89 },
  { id: 'icons',         label: 'Icons',         subtitle: 'System & symbols',     pattern: 'static',  seed: 512 },
  { id: 'illustrations', label: 'Illustrations', subtitle: 'Watercolor & ink',     pattern: 'ember',   seed: 333 },
];

// Initial scattered positions for foundation cards
const INITIAL_CARD_POSITIONS = [
  { x: 60,  y: 100 },
  { x: 480, y: 80 },
  { x: 920, y: 120 },
  { x: 140, y: 480 },
  { x: 560, y: 440 },
  { x: 940, y: 460 },
];

// ─── Sticky note ────────────────────────────────────────────────────────────

interface StickyNote {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
  zIndex: number;
}

function StickyNoteCard({
  note,
  onDragEnd,
  onTextChange,
  onFocus,
}: {
  note: StickyNote;
  onDragEnd: (id: string, x: number, y: number) => void;
  onTextChange: (id: string, text: string) => void;
  onFocus: (id: string) => void;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onDragEnd(note.id, note.x + info.offset.x, note.y + info.offset.y);
      }}
      onPointerDown={() => onFocus(note.id)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, x: note.x, y: note.y }}
      transition={spring.playful}
      whileHover={{ scale: 1.02 }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        zIndex: note.zIndex,
        width: 200,
        touchAction: 'none',
      }}
    >
      <div
        className="p-4 shadow-md"
        style={{
          background: note.color,
          minHeight: 120,
          boxShadow: 'var(--shadow-small-2)',
        }}
      >
        <textarea
          value={note.text}
          onChange={(e) => onTextChange(note.id, e.target.value)}
          placeholder="Write something..."
          className="w-full bg-transparent border-none outline-none resize-none"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            lineHeight: 1.6,
            color: 'rgba(0,0,0,0.7)',
            minHeight: 88,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </div>
    </motion.div>
  );
}

// ─── Foundation draggable card ──────────────────────────────────────────────

function DraggableFoundationCard({
  card,
  position,
  zIndex,
  onDragEnd,
  onFocus,
  onNavigate,
}: {
  card: FoundationCard;
  position: { x: number; y: number };
  zIndex: number;
  onDragEnd: (id: string, x: number, y: number) => void;
  onFocus: (id: string) => void;
  onNavigate: (id: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onDragEnd(card.id, position.x + info.offset.x, position.y + info.offset.y);
      }}
      onPointerDown={() => onFocus(card.id)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, x: position.x, y: position.y }}
      transition={spring.default}
      whileHover={{ scale: 1.02 }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        zIndex,
        width: 320,
        touchAction: 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="overflow-hidden"
        style={{
          background: '#0a0a0a',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: isHovered
            ? 'var(--shadow-large-2)'
            : 'var(--shadow-medium-1)',
          transition: 'box-shadow 0.3s',
        }}
      >
        {/* ASCII texture area */}
        <div style={{ height: 180, position: 'relative' }}>
          <AsciiTexture
            pattern={card.pattern}
            cols={44}
            rows={16}
            seed={card.seed}
            isHovered={isHovered}
          />
        </div>

        {/* Label bar */}
        <div
          className="px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <button
            className="w-full text-left cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(card.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            <div className="font-mono text-[12px] font-semibold tracking-[0.2em] uppercase text-white/80">
              {card.label}
            </div>
            <div className="font-mono text-[10px] text-white/30 mt-0.5">
              {card.subtitle}
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Canvas ────────────────────────────────────────────────────────────

export default function FoundationsCanvas() {
  // Z-index counter
  const zCounterRef = useRef(100);
  const nextZ = () => ++zCounterRef.current;

  // Foundation card positions & z-indices
  const [cardPositions, setCardPositions] = useState<Record<string, { x: number; y: number }>>(
    () => {
      const pos: Record<string, { x: number; y: number }> = {};
      FOUNDATIONS.forEach((c, i) => {
        pos[c.id] = INITIAL_CARD_POSITIONS[i] || { x: 100 + i * 340, y: 120 };
      });
      return pos;
    }
  );
  const [cardZIndices, setCardZIndices] = useState<Record<string, number>>(
    () => {
      const z: Record<string, number> = {};
      FOUNDATIONS.forEach((c, i) => { z[c.id] = 10 + i; });
      return z;
    }
  );

  // Sticky notes
  const [notes, setNotes] = useState<StickyNote[]>([]);

  const handleCardDragEnd = useCallback((id: string, x: number, y: number) => {
    setCardPositions((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const handleCardFocus = useCallback((id: string) => {
    setCardZIndices((prev) => ({ ...prev, [id]: nextZ() }));
  }, []);

  const handleNoteDragEnd = useCallback((id: string, x: number, y: number) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }, []);

  const handleNoteTextChange = useCallback((id: string, text: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text } : n)));
  }, []);

  const handleNoteFocus = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, zIndex: nextZ() } : n))
    );
  }, []);

  const addNote = useCallback(() => {
    const pos = pickRandomPosition();
    setNotes((prev) => [
      ...prev,
      {
        id: `note-${Date.now()}`,
        text: '',
        color: pickRandomColor(),
        x: pos.x,
        y: pos.y,
        zIndex: nextZ(),
      },
    ]);
  }, []);

  const handleNavigate = (pageId: string) => {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('page', pageId);
    window.location.href = url.toString();
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background: '#f8f8f8',
        // Subtle dot grid pattern
        backgroundImage: `radial-gradient(circle, #d0d0d0 0.8px, transparent 0.8px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* ── Header ── */}
      <GlassSurface
        variant="strong"
        tint="#f8f8f8"
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-[9999]"
      >
        <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-black/40">
          Kvalt DS · Foundations
        </div>
        <div className="font-mono text-[10px] text-black/25">
          Drag cards & notes · Click label to navigate
        </div>
      </GlassSurface>

      {/* ── Foundation cards ── */}
      {FOUNDATIONS.map((card) => (
        <DraggableFoundationCard
          key={card.id}
          card={card}
          position={cardPositions[card.id]}
          zIndex={cardZIndices[card.id]}
          onDragEnd={handleCardDragEnd}
          onFocus={handleCardFocus}
          onNavigate={handleNavigate}
        />
      ))}

      {/* ── Sticky notes ── */}
      {notes.map((note) => (
        <StickyNoteCard
          key={note.id}
          note={note}
          onDragEnd={handleNoteDragEnd}
          onTextChange={handleNoteTextChange}
          onFocus={handleNoteFocus}
        />
      ))}

      {/* ── Add note button ── */}
      <CanvasAddNoteButton onClick={addNote} />
    </div>
  );
}

function CanvasAddNoteButton({ onClick }: { onClick: () => void }) {
  const { isPressed, pressHandlers } = usePress({});

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      animate={{ scale: isPressed ? 0.95 : 1 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9999] cursor-pointer flex items-center justify-center"
      style={{
        width: 48,
        height: 48,
        background: '#1a1a1a',
        color: '#fff',
        border: 'none',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 24,
        lineHeight: 1,
        boxShadow: 'var(--shadow-medium-2)',
      }}
      transition={spring.snappy}
      {...pressHandlers}
    >
      +
    </motion.button>
  );
}
