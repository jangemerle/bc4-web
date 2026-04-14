/**
 * StickyNote — per-page annotation that lives in the top-right corner
 *
 * Collapsed: small note icon (shows dot if note exists)
 * Expanded: textarea for writing notes, auto-saves to localStorage
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StickyNote as StickyNoteIcon } from 'lucide-react';
import { spring } from '../../tokens/motion';
import { useNotes } from '../../stores/workspace';
import { Button } from '../Button';

interface StickyNoteProps {
  pageId: string;
}

export function StickyNote({ pageId }: StickyNoteProps) {
  const { getNote, setNote, hasNote } = useNotes();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync text when pageId changes or when opening
  useEffect(() => {
    setText(getNote(pageId));
  }, [pageId, getNote]);

  // Focus textarea when opening
  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [open]);

  // Auto-save on blur or close
  const save = () => {
    setNote(pageId, text);
  };

  const noteExists = hasNote(pageId);

  return (
    <div className="relative">
      {/* Trigger button */}
      <div className="relative">
        <Button
          variant="elevated"
          size="md"
          iconOnly={StickyNoteIcon}
          className="!rounded-xl"
          aria-label={open ? 'Close note' : 'Add note to this page'}
          onClick={() => {
            if (open) save();
            setOpen(!open);
          }}
          style={open ? { background: 'var(--color-primary-1)', color: 'var(--color-on-primary)' } : undefined}
        />
        {/* Dot indicator when note exists */}
        {noteExists && !open && (
          <span
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 7,
              height: 7,
              top: -2,
              right: -2,
              background: 'var(--color-primary-1)',
            }}
          />
        )}
      </div>

      {/* Note panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={spring.snappy}
            className="absolute right-0 z-50 rounded-lg overflow-hidden"
            style={{
              bottom: 48,
              width: 300,
              background: 'var(--color-surface-1)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-l)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: 11, color: 'var(--color-on-surface)', opacity: 0.5 }}
              >
                📝 Note · {pageId}
              </span>
              {text.trim() && (
                <button
                  onClick={() => {
                    setText('');
                    setNote(pageId, '');
                  }}
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: 'var(--color-danger-1)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={save}
              placeholder="Write a note about this page..."
              className="font-sans"
              style={{
                width: '100%',
                minHeight: 120,
                padding: '12px 16px',
                fontSize: 13,
                lineHeight: 1.6,
                color: 'var(--color-on-surface)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
              }}
            />

            {/* Footer */}
            <div
              className="px-4 py-2"
              style={{
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: 10, color: 'var(--color-on-surface)', opacity: 0.3 }}
              >
                Auto-saved to localStorage
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
