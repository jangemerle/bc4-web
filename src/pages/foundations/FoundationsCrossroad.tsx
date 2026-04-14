import { motion } from 'motion/react';
import { spring } from '../../tokens/motion';
import { usePress } from '../../hooks/usePress';

const variations = [
  {
    id: 'foundations',
    title: 'Standalone',
    description: 'Fullscreen dark editorial layout. Giant title, generative ASCII texture cards, no sidebar.',
    inspiration: 'Fumilife',
    standalone: true,
  },
  {
    id: 'foundations-showcase',
    title: 'Showcase',
    description: 'Inside the docs sidebar. PageHero + 3×2 ASCII texture card grid with 3D tilt.',
    inspiration: 'Jack Johnson Cover Flow',
    standalone: false,
  },
  {
    id: 'foundations-gallery',
    title: 'Gallery',
    description: 'Interactive canvas. Draggable orchid cards + sticky notes on a dot grid. Write, rearrange, explore.',
    inspiration: 'Stories of US / Figma',
    standalone: true,
  },
  {
    id: 'foundations-canvas',
    title: 'Canvas',
    description: 'Interactive whiteboard. Draggable foundation cards + sticky notes on a dot grid. Write, rearrange, explore.',
    inspiration: 'Figma / Miro',
    standalone: true,
  },
];

// ─── Crossroad Card Component ───────────────────────────────────────────────

function CrossroadCard({ v, i, navigate }: { v: typeof variations[0]; i: number; navigate: (id: string, standalone: boolean) => void }) {
  const { isPressed, pressHandlers } = usePress({});

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0, scale: isPressed ? 0.98 : 1 }}
      transition={{ ...spring.default, delay: 0.15 + i * 0.08 }}
      whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.2)' }}
      onClick={() => navigate(v.id, v.standalone)}
      className="flex-1 text-left p-8 cursor-pointer"
      style={{
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'border-color 0.2s',
      }}
      {...pressHandlers}
    >
      {/* Number */}
      <div className="font-mono text-[11px] text-white/20 tracking-[0.3em] mb-6">
        0{i + 1}
      </div>

      {/* Title */}
      <h2 className="font-display font-bold text-white text-[22px] leading-tight">
        {v.title}
      </h2>

      {/* Description */}
      <p className="font-mono text-[11px] text-white/40 mt-3 leading-relaxed">
        {v.description}
      </p>

      {/* Inspiration tag */}
      <div className="mt-8 font-mono text-[9px] tracking-[0.2em] uppercase text-white/15">
        ref: {v.inspiration}
      </div>
    </motion.button>
  );
}

export default function FoundationsCrossroad() {
  const navigate = (id: string, standalone: boolean) => {
    const url = new URL(window.location.href);
    url.search = '';
    if (standalone) {
      url.searchParams.set('standalone', id);
    } else {
      url.searchParams.set('page', id);
    }
    window.location.href = url.toString();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#050505' }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.default}
        className="font-display font-bold tracking-tight text-center"
        style={{ fontSize: 'clamp(36px, 6vw, 72px)', color: '#fff', lineHeight: 0.95 }}
      >
        Foundations
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring.default, delay: 0.1 }}
        className="font-mono text-[13px] text-white/30 mt-4 mb-16 tracking-wide"
      >
        Choose a layout variation
      </motion.p>

      {/* Cards */}
      <div className="flex gap-6 px-8 max-w-[1100px] w-full">
        {variations.map((v, i) => (
          <CrossroadCard key={v.id} v={v} i={i} navigate={navigate} />
        ))}
      </div>

      {/* Footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...spring.default, delay: 0.5 }}
        className="font-mono text-[10px] text-white/15 mt-16 tracking-[0.2em] uppercase"
      >
        Click to enter · Esc to return
      </motion.div>
    </div>
  );
}
