/**
 * LiveEditor — in-page copy editor for the BC4 marketing site.
 *
 * Opens when the URL carries `?edit`. A reviewer unlocks it with the shared
 * password, edits copy in the drawer, and watches the real page update live
 * (the drawer writes to the marketing content store). "Publikovat" commits the
 * changes to the repo via /api/save-content; Vercel redeploys and the edits
 * land in code.
 *
 * Security model: editing/preview is local and ephemeral, so the drawer itself
 * is only lightly gated. The protected action is publishing — both unlock and
 * publish verify the password server-side against EDIT_PASSWORD. The drawer is
 * never bundled into the page for normal visitors who don't pass `?edit`.
 *
 * This is an internal tool, intentionally self-contained (no DS coupling) so it
 * can't be broken by design-system changes and never ships styling into the
 * marketing pages themselves.
 */

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import {
  NAMESPACE_FILES,
  NAMESPACE_LABELS,
  enumerateFields,
  getByPath,
  getChanges,
  getEditPayload,
  getNamespace,
  getVersion,
  resetAll,
  setValueByPath,
  subscribe,
  commitBaseline,
  type EditableField,
  type NamespaceKey,
} from './contentStore';

const SESSION_KEY = 'bc4_edit_pw';

const namespaceKeys = Object.keys(NAMESPACE_FILES) as NamespaceKey[];

// Subscribe the editor UI to store edits via a stable version snapshot.
function useStoreVersion(): number {
  return useSyncExternalStore(subscribe, getVersion, getVersion);
}

function humanize(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[._]/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function LiveEditor() {
  const { search } = useLocation();
  const editParam = new URLSearchParams(search).has('edit');

  const [password, setPassword] = useState<string | null>(() =>
    sessionStorage.getItem(SESSION_KEY),
  );

  // Don't mount or run any editor logic unless ?edit is present.
  if (!editParam) return null;

  if (!password) {
    return <PasswordGate onUnlock={setPassword} />;
  }

  return <EditorShell password={password} onLock={() => setPassword(null)} />;
}

// ─── Password gate ───────────────────────────────────────────────────────────

function PasswordGate({ onUnlock }: { onUnlock: (pw: string) => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/edit-auth', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password: value }),
      });
      if (res.ok) {
        sessionStorage.setItem(SESSION_KEY, value);
        onUnlock(value);
      } else if (res.status === 401) {
        setError('Špatné heslo.');
      } else {
        setError(`Chyba ověření (${res.status}).`);
      }
    } catch {
      setError('Server neodpovídá. Běží editor jen na nasazené verzi?');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={overlayStyle}>
      <form onSubmit={submit} style={gateCardStyle}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Editace textů</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 12 }}>
          Zadej heslo pro úpravu obsahu webu.
        </div>
        <input
          autoFocus
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Heslo"
          style={inputStyle}
        />
        {error && <div style={{ color: '#e5484d', fontSize: 13, marginTop: 8 }}>{error}</div>}
        <button type="submit" disabled={busy || !value} style={{ ...primaryBtnStyle, marginTop: 12 }}>
          {busy ? 'Ověřuji…' : 'Odemknout'}
        </button>
      </form>
    </div>
  );
}

// ─── Editor shell (toggle button + drawer) ───────────────────────────────────

function EditorShell({ password, onLock }: { password: string; onLock: () => void }) {
  const [open, setOpen] = useState(true);
  useStoreVersion(); // re-render on every edit

  const changes = getChanges();
  const changedPaths = useMemo(() => {
    const map = new Map<NamespaceKey, Set<string>>();
    for (const c of changes) {
      if (!map.has(c.ns)) map.set(c.ns, new Set());
      map.get(c.ns)!.add(c.path);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changes.length, getVersion()]);

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} style={fabStyle} title="Otevřít editor textů">
          ✎ Editace{changes.length > 0 ? ` · ${changes.length}` : ''}
        </button>
      )}

      {open && (
        <aside style={drawerStyle}>
          <DrawerHeader
            changeCount={changes.length}
            onClose={() => setOpen(false)}
            onLock={() => {
              sessionStorage.removeItem(SESSION_KEY);
              onLock();
            }}
          />

          <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 120px' }}>
            {namespaceKeys.map((ns) => (
              <NamespaceBlock key={ns} ns={ns} changedPaths={changedPaths.get(ns)} />
            ))}
          </div>

          <PublishBar password={password} changeCount={changes.length} />
        </aside>
      )}
    </>
  );
}

function DrawerHeader({
  changeCount,
  onClose,
  onLock,
}: {
  changeCount: number;
  onClose: () => void;
  onLock: () => void;
}) {
  return (
    <div style={drawerHeaderStyle}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>Editace textů</div>
        <div style={{ fontSize: 12, opacity: 0.65 }}>
          {changeCount === 0 ? 'Žádné změny' : `${changeCount} neuložených změn`}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onLock} style={ghostBtnStyle} title="Zamknout editor">
          Zamknout
        </button>
        <button onClick={onClose} style={ghostBtnStyle} title="Skrýt panel">
          ✕
        </button>
      </div>
    </div>
  );
}

// ─── Namespace block ─────────────────────────────────────────────────────────

function NamespaceBlock({
  ns,
  changedPaths,
}: {
  ns: NamespaceKey;
  changedPaths: Set<string> | undefined;
}) {
  const [open, setOpen] = useState(ns === 'home');
  const [showTechnical, setShowTechnical] = useState(false);

  const fields = enumerateFields(ns);
  const visible = showTechnical ? fields : fields.filter((f) => !f.technical);

  // Group by top-level section.
  const grouped = useMemo(() => {
    const groups = new Map<string, EditableField[]>();
    for (const f of visible) {
      if (!groups.has(f.section)) groups.set(f.section, []);
      groups.get(f.section)!.push(f);
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ns, showTechnical, getVersion()]);

  const nsChangeCount = changedPaths?.size ?? 0;

  return (
    <section style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', padding: '12px 0' }}>
      <button onClick={() => setOpen((o) => !o)} style={nsHeaderStyle}>
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          {NAMESPACE_LABELS[ns]}
          {nsChangeCount > 0 && <span style={badgeStyle}>{nsChangeCount}</span>}
        </span>
        <span style={{ opacity: 0.5 }}>{open ? '▾' : '▸'}</span>
      </button>

      {open && (
        <div style={{ marginTop: 8 }}>
          {[...grouped.entries()].map(([section, sectionFields]) => (
            <div key={section} style={{ marginBottom: 14 }}>
              <div style={sectionLabelStyle}>{humanize(section)}</div>
              {sectionFields.map((f) => (
                <Field key={f.path} ns={ns} field={f} changed={changedPaths?.has(f.path) ?? false} />
              ))}
            </div>
          ))}

          <label style={techToggleStyle}>
            <input
              type="checkbox"
              checked={showTechnical}
              onChange={(e) => setShowTechnical(e.target.checked)}
            />
            Zobrazit technická pole (odkazy, ID, obrázky)
          </label>
        </div>
      )}
    </section>
  );
}

// ─── Single field ────────────────────────────────────────────────────────────

function Field({
  ns,
  field,
  changed,
}: {
  ns: NamespaceKey;
  field: EditableField;
  changed: boolean;
}) {
  // Read live value from the store so the input stays in sync after edits/reset.
  const live = getByPath(getNamespace(ns), field.path);
  const value = (live ?? field.value) as string | number;

  const localLabel = field.path
    .slice(field.section.length + 1)
    .replace(/^\d+\./, (m) => `[${m.replace('.', '')}] `);

  const multiline =
    field.type === 'string' && (String(value).length > 56 || String(value).includes('\n'));

  function onChange(next: string) {
    if (field.type === 'number') {
      const n = next.trim() === '' ? 0 : Number(next);
      setValueByPath(ns, field.path, Number.isNaN(n) ? value : n);
    } else {
      setValueByPath(ns, field.path, next);
    }
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={fieldLabelRowStyle}>
        <span style={{ fontSize: 11, opacity: 0.7 }} title={field.path}>
          {humanize(localLabel || field.key)}
        </span>
        {changed && <span style={changedDotStyle} title="Změněno" />}
      </div>
      {multiline ? (
        <textarea
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          rows={Math.min(6, Math.ceil(String(value).length / 44) + 1)}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
        />
      ) : (
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, borderColor: changed ? '#3b82f6' : inputStyle.borderColor }}
        />
      )}
    </div>
  );
}

// ─── Publish bar ─────────────────────────────────────────────────────────────

type PublishState =
  | { kind: 'idle' }
  | { kind: 'publishing' }
  | { kind: 'done'; url?: string }
  | { kind: 'error'; message: string };

function PublishBar({ password, changeCount }: { password: string; changeCount: number }) {
  const [state, setState] = useState<PublishState>({ kind: 'idle' });

  async function publish() {
    const edits = getEditPayload();
    if (Object.keys(edits).length === 0) return;
    setState({ kind: 'publishing' });
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password, edits }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; commitUrl?: string };
      if (res.ok) {
        commitBaseline();
        setState({ kind: 'done', url: data.commitUrl });
      } else {
        setState({ kind: 'error', message: data.error ?? `Chyba ${res.status}` });
      }
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : 'Síťová chyba' });
    }
  }

  return (
    <div style={publishBarStyle}>
      {state.kind === 'done' ? (
        <div style={{ fontSize: 13 }}>
          ✓ Publikováno. Web se aktualizuje za ~1 min.
          {state.url && (
            <>
              {' '}
              <a href={state.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>
                commit
              </a>
            </>
          )}
        </div>
      ) : (
        <>
          <button
            onClick={() => resetAll()}
            disabled={changeCount === 0 || state.kind === 'publishing'}
            style={ghostBtnStyle}
          >
            Zahodit
          </button>
          <button
            onClick={publish}
            disabled={changeCount === 0 || state.kind === 'publishing'}
            style={primaryBtnStyle}
          >
            {state.kind === 'publishing' ? 'Publikuji…' : `Publikovat${changeCount ? ` (${changeCount})` : ''}`}
          </button>
        </>
      )}
      {state.kind === 'error' && (
        <div style={{ color: '#e5484d', fontSize: 12, marginTop: 6, flexBasis: '100%' }}>
          {state.message}
        </div>
      )}
    </div>
  );
}

// ─── Inline styles (isolated so the editor never depends on site CSS) ─────────

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(2px)',
};

const gateCardStyle: React.CSSProperties = {
  background: '#fff',
  color: '#111',
  borderRadius: 12,
  padding: 24,
  width: 320,
  boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
  fontFamily: 'system-ui, sans-serif',
};

const drawerStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: 380,
  maxWidth: '100vw',
  background: '#fbfbfa',
  color: '#111',
  boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
  zIndex: 9998,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'system-ui, sans-serif',
};

const drawerHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  background: '#fff',
};

const fabStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 9998,
  padding: '10px 16px',
  borderRadius: 999,
  border: 'none',
  background: '#111',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
  fontFamily: 'system-ui, sans-serif',
};

const nsHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  background: 'none',
  border: 'none',
  padding: '4px 0',
  cursor: 'pointer',
  textAlign: 'left',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  opacity: 0.5,
  margin: '4px 0 6px',
  fontWeight: 700,
};

const fieldLabelRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 3,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '7px 9px',
  borderRadius: 7,
  border: '1px solid #d4d4d4',
  fontSize: 13,
  background: '#fff',
  color: '#111',
  outline: 'none',
};

const primaryBtnStyle: React.CSSProperties = {
  padding: '9px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#111',
  color: '#fff',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

const ghostBtnStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #d4d4d4',
  background: '#fff',
  color: '#111',
  fontSize: 13,
  cursor: 'pointer',
};

const publishBarStyle: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '12px 16px',
  borderTop: '1px solid rgba(0,0,0,0.1)',
  background: '#fff',
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
};

const badgeStyle: React.CSSProperties = {
  marginLeft: 8,
  fontSize: 11,
  background: '#3b82f6',
  color: '#fff',
  borderRadius: 999,
  padding: '1px 7px',
  fontWeight: 700,
};

const changedDotStyle: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: 999,
  background: '#3b82f6',
  display: 'inline-block',
};

const techToggleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  opacity: 0.7,
  marginTop: 6,
  cursor: 'pointer',
};
