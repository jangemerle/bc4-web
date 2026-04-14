/**
 * FoundationsGalleryPage — interactive canvas with draggable cards + sticky notes
 *
 * Evolved from the scattered gallery layout. Now fullscreen with:
 * - Dot grid background
 * - Draggable foundation cards with ASCII orchid art
 * - Editable sticky notes (pastel post-its, JetBrains Mono)
 * - + button to add notes
 */

import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { spring } from '../../tokens/motion';
import { GlassSurface } from '../../components/GlassSurface';
import { usePress } from '../../hooks/usePress';

// ─── ASCII Orchid Variations ────────────────────────────────────────────────

const orchids: Record<string, string> = {
  colors: `
        ╭──╮  ╭──╮
       ╱ ·  ╲╱  · ╲
      │  ◠    ◠    │
       ╲  ╭──╮   ╱
        ╰╱ ·· ╲─╯
         │  ◡  │
          ╲  ╱
      ─────╲╱─────
     ╱              ╲
    ╱                ╲`,

  typography: `
           ╭─╮
          ╱   ╲
         ╱  ·  ╲  ╭─╮
        │   ◠   │╱   ╲
         ╲    ╱╱  ·   │
          ╰──╯╲  ◠  ╱
               ╰──╯
           │
      ─────┼──────
          ╱│╲
         ╱ │ ╲
        ╱  ╵  ╲`,

  shadows: `
    ░░░░╭──╮░╭──╮░░░░
    ░░░╱ ·  ╲╱  · ╲░░
    ░░│  ◠    ◠    │░
    ░░░╲  ╭──╮   ╱░░░
    ░░░░╰╱    ╲─╯░░░░
    ░░░░░│  ◡  │░░░░░
    ░░░░░░╲  ╱░░░░░░░
    ░░─────╲╱─────░░░
    ░░╱░░░░░░░░░░░╲░░
    ░╱░░░░░░░░░░░░░╲░`,

  radius: `
          ╭───────╮
         ╱ ╭─╮╭─╮ ╲
        │ ╱ · ╲╲ · ╲│
        │ │ ◠ ││ ◠ ││
        │  ╲ ╱╱  ╱ │
         ╲  ╰╯╰─╯ ╱
          ╰───┬───╯
              │
         ╭────┴────╮
        ╱           ╲
       (             )
        ╲           ╱`,

  icons: `
      ✦         ✦
        ╭─╮ ╭─╮
       ╱ · ╳ · ╲
      │  ◠  ▽  ◠ │
       ╲   ╱╲   ╱
        ╰─╯  ╰─╯
      ✦    │    ✦
      ────╱╲────
         ╱  ╲
        ╱  ✦ ╲
       ╱      ╲`,

  illustrations: `
       ╭──╮    ╭──╮   ╭──╮
      ╱ ·  ╲  ╱ ·  ╲ ╱ ·  ╲
     │  ◠   ││  ◠   ││  ◠   │
      ╲   ╱╱  ╲   ╱╱  ╲   ╱
       ╰─╯╱    ╰─╯╱    ╰─╯
          │      │
     ─────┴──────┴──────
    ╱                     ╲
   ╱                       ╲
  ╱═════════════════════════╲`,
};

// ─── Foundation card data ───────────────────────────────────────────────────

interface FoundationCard {
  id: string;
  pageId: string;
  title: string;
  subtitle: string;
  orchid: string;
  initialX: number;
  initialY: number;
  rotate: number;
}

const foundations: FoundationCard[] = [
  { id: 'colors',        pageId: 'colors',        title: 'Colors',         subtitle: 'Palette & semantics',  orchid: orchids.colors,        initialX: 60,  initialY: 80,  rotate: -2 },
  { id: 'typography',    pageId: 'typography',     title: 'Typography',     subtitle: 'Scales & families',    orchid: orchids.typography,    initialX: 440, initialY: 60,  rotate: 1 },
  { id: 'shadows',       pageId: 'shadows',        title: 'Shadows',        subtitle: 'Depth & elevation',    orchid: orchids.shadows,      initialX: 820, initialY: 100, rotate: -1 },
  { id: 'radius',        pageId: 'border-radius',  title: 'Border Radius',  subtitle: 'Curves & corners',     orchid: orchids.radius,       initialX: 160, initialY: 440, rotate: 2 },
  { id: 'icons',         pageId: 'icons',           title: 'Icons',          subtitle: 'System & symbols',     orchid: orchids.icons,        initialX: 540, initialY: 420, rotate: -1.5 },
  { id: 'illustrations', pageId: 'illustrations',   title: 'Illustrations',  subtitle: 'Watercolor & ink',     orchid: orchids.illustrations, initialX: 880, initialY: 460, rotate: 1.5 },
];

// ─── Pastel colors for sticky notes ─────────────────────────────────────────

const PASTEL_COLORS = [
  '#FFE4E1', '#E8F5E9', '#E3F2FD', '#FFF9C4',
  '#F3E5F5', '#FFF3E0', '#E0F7FA', '#FCE4EC',
];

const pickRandom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

// ─── Sticky Note ────────────────────────────────────────────────────────────

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
      onDragEnd={(_, info) => onDragEnd(note.id, note.x + info.offset.x, note.y + info.offset.y)}
      onPointerDown={() => onFocus(note.id)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, x: note.x, y: note.y }}
      transition={spring.playful}
      whileHover={{ scale: 1.02 }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ zIndex: note.zIndex, width: 200, touchAction: 'none' }}
    >
      <div
        className="p-4"
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
            color: 'rgba(0,0,0,0.65)',
            minHeight: 88,
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </div>
    </motion.div>
  );
}

// ─── Draggable Foundation Card ──────────────────────────────────────────────

function DraggableCard({
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
  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => onDragEnd(card.id, position.x + info.offset.x, position.y + info.offset.y)}
      onPointerDown={() => onFocus(card.id)}
      initial={{ opacity: 0, y: 30, scale: 0.9, rotate: card.rotate }}
      animate={{ opacity: 1, scale: 1, x: position.x, y: position.y, rotate: card.rotate }}
      transition={{ ...spring.default }}
      whileHover={{ scale: 1.03, rotate: 0 }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{
        zIndex,
        width: 'clamp(260px, 26vw, 340px)',
        touchAction: 'none',
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-medium-1)',
        }}
      >
        {/* ASCII orchid area */}
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{
            background: 'var(--color-surface-2)',
            height: 'clamp(140px, 14vw, 200px)',
            padding: 16,
          }}
        >
          <pre
            className="font-mono text-center leading-none select-none"
            style={{
              fontSize: 'clamp(6px, 0.65vw, 9px)',
              color: 'var(--color-on-surface)',
              opacity: 0.5,
              whiteSpace: 'pre',
              lineHeight: 1.2,
            }}
          >
            {card.orchid}
          </pre>
        </div>

        {/* Label */}
        <button
          className="w-full text-left px-5 py-4 cursor-pointer"
          style={{ background: 'none', border: 'none' }}
          onClick={(e) => { e.stopPropagation(); onNavigate(card.pageId); }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <h3
            className="font-display font-bold"
            style={{
              fontSize: 'clamp(16px, 1.4vw, 22px)',
              color: 'var(--color-on-surface)',
              lineHeight: 1.2,
            }}
          >
            {card.title}
          </h3>
          <p
            className="font-sans mt-1"
            style={{
              fontSize: 'clamp(11px, 0.9vw, 14px)',
              color: 'var(--color-on-surface)',
              opacity: 0.5,
            }}
          >
            {card.subtitle}
          </p>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function FoundationsGalleryPage() {
  const zRef = useRef(100);
  const nextZ = () => ++zRef.current;

  // Card positions
  const [cardPos, setCardPos] = useState<Record<string, { x: number; y: number }>>(
    () => {
      const m: Record<string, { x: number; y: number }> = {};
      foundations.forEach((c) => { m[c.id] = { x: c.initialX, y: c.initialY }; });
      return m;
    }
  );
  const [cardZ, setCardZ] = useState<Record<string, number>>(
    () => {
      const m: Record<string, number> = {};
      foundations.forEach((c, i) => { m[c.id] = 10 + i; });
      return m;
    }
  );

  // Notes
  const [notes, setNotes] = useState<StickyNote[]>([]);

  const focusCard = useCallback((id: string) => setCardZ((p) => ({ ...p, [id]: nextZ() })), []);
  const dragCard = useCallback((id: string, x: number, y: number) => setCardPos((p) => ({ ...p, [id]: { x, y } })), []);

  const focusNote = useCallback((id: string) => setNotes((p) => p.map((n) => n.id === id ? { ...n, zIndex: nextZ() } : n)), []);
  const dragNote = useCallback((id: string, x: number, y: number) => setNotes((p) => p.map((n) => n.id === id ? { ...n, x, y } : n)), []);
  const editNote = useCallback((id: string, text: string) => setNotes((p) => p.map((n) => n.id === id ? { ...n, text } : n)), []);

  const addNote = useCallback(() => {
    setNotes((p) => [...p, {
      id: `note-${Date.now()}`,
      text: '',
      color: pickRandom(PASTEL_COLORS),
      x: 100 + Math.random() * (window.innerWidth - 350),
      y: 100 + Math.random() * (window.innerHeight - 300),
      zIndex: nextZ(),
    }]);
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
        background: 'var(--color-surface-2)',
        backgroundImage: `radial-gradient(circle, var(--color-border) 0.8px, transparent 0.8px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Header */}
      <GlassSurface
        variant="strong"
        tint="var(--color-surface-2)"
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-[9999]"
        style={{ borderBottom: '1px solid var(--color-border)' }}
      >
        <span className="font-display font-bold" style={{ fontSize: 16, color: 'var(--color-on-surface)' }}>
          Kvalt Foundations
        </span>
        <span className="font-mono text-[10px]" style={{ color: 'var(--color-on-surface-subtle-2)' }}>
          Drag cards & notes · Click label to navigate
        </span>
      </GlassSurface>

      {/* Foundation cards */}
      {foundations.map((card) => (
        <DraggableCard
          key={card.id}
          card={card}
          position={cardPos[card.id]}
          zIndex={cardZ[card.id]}
          onDragEnd={dragCard}
          onFocus={focusCard}
          onNavigate={handleNavigate}
        />
      ))}

      {/* Sticky notes */}
      {notes.map((note) => (
        <StickyNoteCard
          key={note.id}
          note={note}
          onDragEnd={dragNote}
          onTextChange={editNote}
          onFocus={focusNote}
        />
      ))}

      {/* Decorative background orchid petals */}
      {[
        { top: '25%', left: '45%', size: 7, opacity: 0.06, rotate: 15 },
        { top: '75%', left: '35%', size: 8, opacity: 0.04, rotate: -20 },
        { top: '12%', left: '82%', size: 6, opacity: 0.05, rotate: 8 },
      ].map((p, i) => (
        <pre
          key={i}
          className="absolute font-mono select-none pointer-events-none"
          style={{
            top: p.top, left: p.left, fontSize: p.size, opacity: p.opacity,
            color: 'var(--color-on-surface)', transform: `rotate(${p.rotate}deg)`,
          }}
        >{`  ╭─╮\n ╱ · ╲\n│  ◠  │\n ╲  ╱\n  ╰╯`}</pre>
      ))}

      {/* Add note button */}
      <AddNoteButton onClick={addNote} />
    </div>
  );
}

function AddNoteButton({ onClick }: { onClick: () => void }) {
  const { isPressed, pressHandlers } = usePress({});

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      animate={{ scale: isPressed ? 0.95 : 1 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9999] cursor-pointer flex items-center justify-center"
      style={{
        width: 44,
        height: 44,
        background: 'var(--color-on-surface)',
        color: 'var(--color-surface-1)',
        border: 'none',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 22,
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
