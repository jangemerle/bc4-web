/**
 * QuickTodos — slide-out panel with a checkbox todo list
 *
 * Accessible from a button in the sidebar. Todos auto-tag with
 * the current page when created. Stored in localStorage.
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { spring, duration } from '../../tokens/motion';
import { useTodos } from '../../stores/workspace';

interface QuickTodosProps {
  /** Current page ID for auto-tagging new todos */
  currentPageId: string;
  open: boolean;
  onClose: () => void;
}

export function QuickTodos({ currentPageId, open, onClose }: QuickTodosProps) {
  const { pending, completed, addTodo, toggleTodo, removeTodo } = useTodos();
  const [input, setInput] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      addTodo(input.trim(), currentPageId === 'hello' ? undefined : currentPageId);
      setInput('');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.fast }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.1)' }} // backdrop scrim — no token exists yet
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            transition={spring.default}
            className="fixed left-[320px] top-0 h-screen z-50 flex flex-col"
            style={{
              width: 340,
              background: 'var(--color-surface-1)',
              borderRight: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 shrink-0"
              style={{ borderBottom: '1px solid var(--color-border)' }}
            >
              <span className="font-display font-bold" style={{ fontSize: 16, color: 'var(--color-on-surface)' }}>
                Quick Todos
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono" style={{ fontSize: 11, color: 'var(--color-on-surface)', opacity: 0.4 }}>
                  {pending.length} left
                </span>
                <button
                  onClick={onClose}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-on-surface)', opacity: 0.5, fontSize: 18,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-5 py-3 shrink-0" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Add a todo..."
                  className="font-sans flex-1"
                  style={{
                    fontSize: 13,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-2)',
                    color: 'var(--color-on-surface)',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  className="font-sans font-semibold rounded-lg px-3"
                  style={{
                    fontSize: 12,
                    background: 'var(--color-primary-1)',
                    color: 'var(--color-on-primary)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
              {currentPageId !== 'hello' && (
                <span className="font-mono mt-1.5 block" style={{ fontSize: 10, color: 'var(--color-on-surface)', opacity: 0.3 }}>
                  Auto-tagged: {currentPageId}
                </span>
              )}
            </form>

            {/* Todo list */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {pending.length === 0 && completed.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-40">
                  <span style={{ fontSize: 32 }}>✓</span>
                  <span className="font-sans mt-2" style={{ fontSize: 13, color: 'var(--color-on-surface)' }}>
                    All clear
                  </span>
                </div>
              )}

              {/* Pending items */}
              <AnimatePresence>
                {pending.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={spring.snappy}
                    className="flex items-start gap-3 py-2 group"
                    style={{ borderBottom: '1px solid var(--color-border)' }}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="shrink-0 mt-0.5 rounded flex items-center justify-center"
                      style={{
                        width: 18, height: 18,
                        border: '2px solid var(--color-border)',
                        background: 'none', cursor: 'pointer',
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-sans block" style={{ fontSize: 13, color: 'var(--color-on-surface)', lineHeight: 1.5 }}>
                        {todo.text}
                      </span>
                      {todo.pageTag && (
                        <span
                          className="font-mono inline-block mt-1 px-1.5 rounded"
                          style={{
                            fontSize: 9,
                            background: 'var(--color-surface-2)',
                            color: 'var(--color-on-surface)',
                            opacity: 0.5,
                          }}
                        >
                          {todo.pageTag}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeTodo(todo.id)}
                      className="shrink-0 opacity-0 group-hover:opacity-50 transition-opacity"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--color-danger-1)', fontSize: 14, marginTop: 1,
                      }}
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Completed toggle */}
              {completed.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="font-sans flex items-center gap-1.5"
                    style={{
                      fontSize: 11, color: 'var(--color-on-surface)', opacity: 0.4,
                      background: 'none', border: 'none', cursor: 'pointer',
                    }}
                  >
                    <span style={{ transform: showCompleted ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>
                      ▸
                    </span>
                    {completed.length} completed
                  </button>

                  {showCompleted && (
                    <div className="mt-2">
                      {completed.map((todo) => (
                        <div key={todo.id} className="flex items-start gap-3 py-2 group" style={{ opacity: 0.4 }}>
                          <button
                            onClick={() => toggleTodo(todo.id)}
                            className="shrink-0 mt-0.5 rounded flex items-center justify-center"
                            style={{
                              width: 18, height: 18,
                              border: '2px solid var(--color-primary-1)',
                              background: 'var(--color-primary-1)',
                              cursor: 'pointer',
                              color: 'var(--color-on-primary)',
                              fontSize: 10,
                            }}
                          >
                            ✓
                          </button>
                          <span className="font-sans line-through" style={{ fontSize: 13, color: 'var(--color-on-surface)', lineHeight: 1.5 }}>
                            {todo.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
