import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mosaic,
  MosaicWindow,
  getLeaves,
  createBalancedTreeFromLeaves,
} from 'react-mosaic-component';
import type { MosaicNode } from 'react-mosaic-component';
import { Plus, X, RotateCcw, GripHorizontal, ExternalLink } from 'lucide-react';
import { shadows } from '../../tokens/shadows';
import { Button } from '../../components/Button';
import { PageHero } from '../../layouts/PageHero';
import '../../styles/mosaic.css';

/* ─── Types ─────────────────────────────────────────────────────────────── */

type PanelId = string;
interface PanelMeta { name: string }

/* ─── Springs ───────────────────────────────────────────────────────────── */

const slapSpring   = { type: 'spring' as const, visualDuration: 0.55, bounce: 0.5 };
const removeSpring = { type: 'spring' as const, visualDuration: 0.22, bounce: 0 };
const subtleBounce = { type: 'spring' as const, visualDuration: 0.3,  bounce: 0.15 };

/* ─── Panel name editor ─────────────────────────────────────────────────── */

function PanelNameEditor({ name, onChange }: { name: string; onChange: (n: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(name);

  const commit = () => {
    const t = draft.trim();
    if (t) onChange(t); else setDraft(name);
    setEditing(false);
  };

  if (editing) {
    return (
      <motion.input
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={subtleBounce}
        className="font-mono font-medium bg-transparent text-center outline-none border-b flex-1 min-w-0"
        style={{ color: 'var(--color-on-surface)', borderColor: 'var(--color-primary-1)', fontSize: '14px' }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') { setDraft(name); setEditing(false); }
        }}
        // Prevent drag events from firing while typing
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        autoFocus
      />
    );
  }

  return (
    <button
      className="font-mono font-medium cursor-grab hover:opacity-70 transition-opacity select-none truncate flex-1 min-w-0"
      style={{ color: 'var(--color-on-surface-subtle-1)', fontSize: '14px' }}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={() => { setDraft(name); setEditing(true); }}
      title="Click to rename"
    >
      {name}
    </button>
  );
}


/* ─── Counter ───────────────────────────────────────────────────────────── */

let panelCounter = 0;
const nextId = () => `panel-${++panelCounter}`;

/* ─── Initial state ─────────────────────────────────────────────────────── */

const INITIAL_IDS = [nextId(), nextId(), nextId()];

const INITIAL_TREE: MosaicNode<PanelId> = {
  type: 'split', direction: 'row',
  children: [
    INITIAL_IDS[0],
    { type: 'split', direction: 'column', children: [INITIAL_IDS[1], INITIAL_IDS[2]] },
  ],
};

const INITIAL_META: Record<PanelId, PanelMeta> = {
  [INITIAL_IDS[0]]: { name: 'Navigator' },
  [INITIAL_IDS[1]]: { name: 'Editor' },
  [INITIAL_IDS[2]]: { name: 'Terminal' },
};

const REMOVE_MS = 200;

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function MosaicWorkspacePage({ standalone }: { standalone?: boolean } = {}) {
  const [tree, setTree]               = useState<MosaicNode<PanelId> | null>(INITIAL_TREE);
  const [meta, setMeta]               = useState<Record<PanelId, PanelMeta>>(INITIAL_META);
  const [newPanels, setNewPanels]     = useState<Set<PanelId>>(new Set());
  const [removing, setRemoving]       = useState<Set<PanelId>>(new Set());

  const onChange = useCallback((t: MosaicNode<PanelId> | null) => setTree(t), []);

  const commitRemove = useCallback((id: PanelId) => {
    setTree((cur) => {
      if (!cur) return null;
      const leaves = getLeaves(cur).filter((l) => l !== id);
      if (!leaves.length) return null;
      if (leaves.length === 1) return leaves[0];
      return createBalancedTreeFromLeaves(leaves);
    });
    setMeta((p) => { const n = { ...p }; delete n[id]; return n; });
    setRemoving((p) => { const n = new Set(p); n.delete(id); return n; });
  }, []);

  const handleRemove = useCallback((id: PanelId) => {
    setRemoving((p) => new Set(p).add(id));
    setTimeout(() => commitRemove(id), REMOVE_MS);
  }, [commitRemove]);

  const addPanel = useCallback(() => {
    const id  = nextId();
    const num = Object.keys(meta).length + 1;
    setMeta((p) => ({ ...p, [id]: { name: `Panel ${num}` } }));
    setNewPanels((p) => new Set(p).add(id));
    setTree((cur) => {
      if (!cur) return id;
      const leaves = getLeaves(cur); leaves.push(id);
      return createBalancedTreeFromLeaves(leaves);
    });
  }, [meta]);

  const renamePanel = useCallback((id: PanelId, name: string) =>
    setMeta((p) => ({ ...p, [id]: { ...p[id], name } })), []);

  const resetLayout = useCallback(() => {
    panelCounter = 0;
    const ids = [nextId(), nextId(), nextId()];
    setTree({ type: 'split', direction: 'row', children: [ids[0], { type: 'split', direction: 'column', children: [ids[1], ids[2]] }] });
    setMeta({ [ids[0]]: { name: 'Navigator' }, [ids[1]]: { name: 'Editor' }, [ids[2]]: { name: 'Terminal' } });
    setNewPanels(new Set()); setRemoving(new Set());
  }, []);

  const panelCount = tree ? getLeaves(tree).length : 0;

  const renderTile = useCallback(
    (id: PanelId, path: number[]) => {
      const isNew      = newPanels.has(id);
      const isRemoving = removing.has(id);
      const name       = meta[id]?.name ?? id;

      return (
        /* Animate the whole tile (scale from center, fade) */
        <motion.div
          className="h-full w-full"
          initial={isNew ? { opacity: 0, scale: 0.35 } : false}
          animate={
            isRemoving
              ? { opacity: 0, scale: 0, boxShadow: shadows['small-1'], transition: removeSpring }
              : { opacity: 1, scale: 1, boxShadow: shadows['small-1'], transition: slapSpring }
          }
          whileHover={{ boxShadow: shadows['medium-1'] }}
          transition={{ boxShadow: { type: 'spring', visualDuration: 0.3, bounce: 0.1 } }}
          style={{ borderRadius: '12px' }}
        >
          <MosaicWindow<PanelId>
            title={name}
            path={path}
            draggable
            renderToolbar={() => (
              <div
                className="flex items-center gap-2 pl-3 pr-1.5 w-full shrink-0"
                style={{ height: '36px', cursor: 'grab', backgroundColor: 'var(--color-surface-3)', borderRadius: '12px 12px 0 0' }}
              >
                <GripHorizontal size={13} style={{ color: 'var(--color-on-surface-subtle-1)', opacity: 0.4, flexShrink: 0 }} />
                <PanelNameEditor name={name} onChange={(n) => renamePanel(id, n)} />
                <div
                  style={{ cursor: 'default' }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Button iconOnly={X} size="xs" variant="elevated" aria-label="Remove panel" onClick={() => handleRemove(id)} />
                </div>
              </div>
            )}
          >
            {/* Body — panel ID hint */}
            <div className="h-full flex items-center justify-center">
              <span
                className="font-mono text-[11px] opacity-30 select-none"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                {id}
              </span>
            </div>
          </MosaicWindow>
        </motion.div>
      );
    },
    [meta, newPanels, removing, renamePanel, handleRemove],
  );

  const gridHeight = standalone
    ? 'calc(100vh - 64px)'
    : 'calc(100vh - 380px)';

  return (
    <div className={standalone ? 'flex flex-col h-screen p-4 gap-3' : ''} style={standalone ? { backgroundColor: 'var(--color-bg)' } : undefined}>
      {!standalone && (
        <PageHero
          title="Workspace"
          subtitle="Drag. Split. Rename. Your layout, your rules."
          description="A resizable mosaic grid. Drag panels by their handle, resize splits, rename inline."
        />
      )}

      <div className={`flex items-center gap-3 ${standalone ? '' : 'mb-6'}`}>
        <Button iconLeft={Plus} variant="secondary" size="sm" onClick={addPanel}>Add panel</Button>
        <Button iconLeft={RotateCcw} variant="link" size="sm" onClick={resetLayout}>Reset</Button>
        <span className="font-mono text-xs ml-auto select-none" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          {panelCount} panel{panelCount !== 1 ? 's' : ''}
        </span>
        {!standalone && (
          <Button
            iconOnly={ExternalLink}
            variant="elevated"
            size="sm"
            aria-label="Open standalone"
            onClick={() => window.open('?standalone=workshop-workspace', '_blank')}
          />
        )}
      </div>

      <div
        className={standalone ? 'flex-1 min-h-0' : 'rounded-lg overflow-hidden'}
        style={standalone ? undefined : { height: gridHeight, minHeight: '400px', backgroundColor: 'var(--color-bg)' }}
      >
        <AnimatePresence mode="wait">
          {tree ? (
            <div key="mosaic" className="h-full mosaic-workspace">
              <Mosaic<PanelId>
                renderTile={renderTile}
                value={tree}
                onChange={onChange}
                className=""
                blueprintNamespace="bp5"
              />
            </div>
          ) : (
            <motion.div
              key="empty"
              className="h-full flex flex-col items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={subtleBounce}
            >
              <span className="font-mono text-sm" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
                No panels. Add one to get started.
              </span>
              <Button iconLeft={Plus} variant="primary" size="sm" onClick={addPanel}>Add first panel</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
