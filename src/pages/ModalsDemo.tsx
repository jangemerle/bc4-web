/**
 * Modals Demo Page
 * Source: Figma / Topic Board New / nodes 8858:43690, 8858:43852, 8858:43973
 *
 * Three modal examples:
 *   1. Topic Settings — tabs, name input, members list
 *   2. Delete Confirmation — simple destructive confirmation
 *   3. New Topic — creation form with recent member chips
 */

import { useState } from 'react';
import { Plus, X, Trash2, AlertTriangle, Layers, Bell } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Tabs, Tab } from '../components/Tabs';
import { Chip } from '../components/Chip';
import { UserAvatarLabel } from '../components/UserAvatar';
import { Icon } from '../components/Icon';

// ─── Data ────────────────────────────────────────────────────────────────────

const members = [
  { name: 'Jeffrey Lebowski (me)', email: 'jeff@grouweapps.com', initials: 'JL', owner: true },
  { name: 'Donda Dyson', email: 'donda@grouweapps.com', initials: 'DD' },
  { name: 'Frank Salamander', email: 'frank@grouweapps.com', initials: 'FS' },
  { name: 'John Peterson', email: 'john@grouweapps.com', initials: 'JP' },
];

const recentMembers = [
  { initials: 'CL', name: 'Carl Lambertson' },
  { initials: 'DT', name: 'Dean Thomas' },
  { initials: 'DK', name: 'Donnie Kabranos' },
  { initials: 'RD', name: 'Ron Don' },
  { initials: 'CC', name: 'Carl Chest' },
  { initials: 'SS', name: 'Sony Satrava' },
  { initials: 'DD', name: 'Donda Dyson' },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ModalsDemo() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('name-members');

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="flex flex-col items-center gap-6">
        <h1
          className="font-display text-headline-l font-bold mb-2"
          style={{ color: 'var(--color-on-surface)' }}
        >
          Modal Examples
        </h1>

        <div className="flex gap-4">
          <Button variant="secondary" onClick={() => setSettingsOpen(true)}>
            Topic Settings
          </Button>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete Topic
          </Button>
          <Button onClick={() => setNewTopicOpen(true)} iconLeft={Plus}>
            New Topic
          </Button>
        </div>
      </div>

      {/* ── Modal 1: Topic Settings ──────────────────────────────────── */}
      <Modal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Topic settings"
        width="679px"
        footer={<Button onClick={() => setSettingsOpen(false)}>Save</Button>}
      >
        <div className="flex flex-col gap-8">
          {/* Tabs */}
          <Tabs value={settingsTab} onChange={setSettingsTab}>
            <Tab value="name-members" icon={Layers}>Name &amp; Members</Tab>
            <Tab value="notifications" icon={Bell}>Notifications</Tab>
          </Tabs>

          {settingsTab === 'name-members' && (
            <>
              {/* Topic name */}
              <div className="flex flex-col gap-3">
                <h3
                  className="font-display text-headline-s font-bold"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  Topic name
                </h3>
                <Input defaultValue="Payment gateway API" />
              </div>

              {/* Members */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <h3
                    className="font-display text-headline-s font-bold"
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    Members
                  </h3>
                  <div className="flex gap-3 items-center">
                    <Input
                      size="sm"
                      placeholder="Search existing or invite new members by email"
                      className="flex-1"
                    />
                    <Button size="sm" iconLeft={Plus} disabled>
                      Invite
                    </Button>
                  </div>
                </div>

                {/* Members list */}
                <div className="flex flex-col">
                  {members.map((member, i, arr) => (
                    <div key={member.email}>
                      <div className="flex items-center gap-2 py-3">
                        <UserAvatarLabel
                          size="sm"
                          initials={member.initials}
                          name={member.name}
                          caption={member.email}
                        />
                        {'owner' in member && member.owner && (
                          <Chip size="sm">Owner</Chip>
                        )}
                        <div className="flex-1" />
                        <button
                          type="button"
                          className="flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-[var(--color-surface-3)] transition-colors"
                          aria-label="Remove member"
                        >
                          <Icon
                            icon={X}
                            size="sm"
                            style={{ color: 'var(--color-on-surface-subtle-1)' }}
                          />
                        </button>
                      </div>
                      {i < arr.length - 1 && <div className="divider" />}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {settingsTab === 'notifications' && (
            <div className="flex flex-col gap-4">
              <p
                className="font-sans text-base font-medium"
                style={{ color: 'var(--color-on-surface-subtle-1)' }}
              >
                Notification preferences for this topic will appear here.
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* ── Modal 2: Delete Confirmation ─────────────────────────────── */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete topic"
        width="480px"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" iconLeft={Trash2} onClick={() => setDeleteOpen(false)}>
              Delete
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center gap-3 p-4 rounded-m"
            style={{ backgroundColor: 'var(--color-danger-secondary-1)' }}
          >
            <Icon
              icon={AlertTriangle}
              size="md"
              style={{ color: 'var(--color-danger-1)' }}
            />
            <p
              className="font-sans text-base font-medium"
              style={{ color: 'var(--color-danger-1)' }}
            >
              This action cannot be undone.
            </p>
          </div>
          <p
            className="font-sans text-base font-medium"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Are you sure you want to delete{' '}
            <strong>Payment gateway API</strong>? All messages, files, and
            member associations will be permanently removed.
          </p>
        </div>
      </Modal>

      {/* ── Modal 3: New Topic ───────────────────────────────────────── */}
      <Modal
        open={newTopicOpen}
        onClose={() => setNewTopicOpen(false)}
        title="New topic"
        width="600px"
        footer={
          <Button onClick={() => setNewTopicOpen(false)}>Create topic</Button>
        }
      >
        <div className="flex flex-col gap-8">
          {/* Topic name */}
          <div className="flex flex-col gap-3">
            <h3
              className="font-display text-headline-s font-bold"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Topic name
            </h3>
            <Input placeholder="Enter topic name" />
          </div>

          {/* Members */}
          <div className="flex flex-col gap-3">
            <h3
              className="font-display text-headline-s font-bold"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Members
            </h3>
            <div className="flex gap-3 items-center">
              <Input
                size="sm"
                placeholder="Search existing or invite new members by email"
                className="flex-1"
              />
              <Button size="sm" iconLeft={Plus} disabled>
                Invite
              </Button>
            </div>

            {/* Recent members chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-sans text-md font-medium"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Recent:
              </span>
              {recentMembers.map((m) => (
                <Chip key={m.initials + m.name} size="md" user={{ initials: m.initials }}>
                  {m.name}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
