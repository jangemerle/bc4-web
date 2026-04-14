import { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Layers, Bell, X } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Tabs, Tab } from '../../components/Tabs';
import { Chip } from '../../components/Chip';
import { UserAvatarLabel } from '../../components/UserAvatar';
import { Icon } from '../../components/Icon';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec } from '../../layouts/DocHelpers';

export default function ModalExamplesPage() {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newTopicModalOpen, setNewTopicModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState('name-members');

  return (
    <>
      <PageHero
        title="Modal Examples"
        subtitle="Dialogs in context"
        description="Three real-world modal compositions using the Modal, Input, Tabs, Chip, and UserAvatarLabel components."
      />

      <SectionTitle>Topic Settings</SectionTitle>
      <Card>
        <Spec>679px wide · Tabs (Name &amp; Members / Notifications) · filled input · members list with avatars, Owner chip, remove buttons</Spec>
        <Button variant="secondary" onClick={() => setSettingsModalOpen(true)}>Open Topic Settings</Button>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Delete Confirmation</SectionTitle>
      <Card>
        <Spec>480px wide · warning banner · destructive action · Cancel + Delete buttons</Spec>
        <Button variant="danger" onClick={() => setDeleteModalOpen(true)}>Open Delete Confirmation</Button>
      </Card>

      <div className="mt-12" />
      <SectionTitle>New Topic</SectionTitle>
      <Card>
        <Spec>600px wide · empty name input · members search · recent member chips with user avatars</Spec>
        <Button iconLeft={Plus} onClick={() => setNewTopicModalOpen(true)}>Open New Topic</Button>
      </Card>

      {/* ── Modal 1: Topic Settings ──────────────────────────────── */}
      <Modal
        open={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        title="Topic settings"
        width="679px"
        footer={<Button onClick={() => setSettingsModalOpen(false)}>Save</Button>}
      >
        <div className="flex flex-col gap-8">
          <Tabs value={settingsTab} onChange={setSettingsTab}>
            <Tab value="name-members" icon={Layers}>Name &amp; Members</Tab>
            <Tab value="notifications" icon={Bell}>Notifications</Tab>
          </Tabs>

          {settingsTab === 'name-members' && (
            <>
              <div className="flex flex-col gap-3">
                <h3 className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>Topic name</h3>
                <Input defaultValue="Payment gateway API" />
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <h3 className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>Members</h3>
                  <div className="flex gap-3 items-center">
                    <Input size="sm" placeholder="Search existing or invite new members by email" className="flex-1" />
                    <Button size="sm" iconLeft={Plus} disabled>Invite</Button>
                  </div>
                </div>

                <div className="flex flex-col">
                  {[
                    { name: 'Jeffrey Lebowski (me)', email: 'jeff@grouweapps.com', initials: 'JL', owner: true },
                    { name: 'Donda Dyson', email: 'donda@grouweapps.com', initials: 'DD' },
                    { name: 'Frank Salamander', email: 'frank@grouweapps.com', initials: 'FS' },
                    { name: 'John Peterson', email: 'john@grouweapps.com', initials: 'JP' },
                  ].map((member, i, arr) => (
                    <div key={member.email}>
                      <div className="flex items-center gap-2 py-3">
                        <UserAvatarLabel size="sm" initials={member.initials} name={member.name} caption={member.email} />
                        {'owner' in member && member.owner && <Chip size="sm">Owner</Chip>}
                        <div className="flex-1" />
                        <button
                          type="button"
                          className="flex items-center justify-center p-2 rounded-xl cursor-pointer hover:bg-[var(--color-surface-3)] transition-colors"
                          aria-label="Remove member"
                        >
                          <Icon icon={X} size="sm" style={{ color: 'var(--color-on-surface-subtle-1)' }} />
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
            <p className="font-sans text-base font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
              Notification preferences for this topic will appear here.
            </p>
          )}
        </div>
      </Modal>

      {/* ── Modal 2: Delete Confirmation ─────────────────────────── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete topic"
        width="480px"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button variant="danger" iconLeft={Trash2} onClick={() => setDeleteModalOpen(false)}>Delete</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div
            className="flex items-center gap-3 p-4 rounded-m"
            style={{ backgroundColor: 'var(--color-danger-secondary-1)' }}
          >
            <Icon icon={AlertTriangle} size="md" style={{ color: 'var(--color-danger-1)' }} />
            <p className="font-sans text-base font-medium" style={{ color: 'var(--color-danger-1)' }}>
              This action cannot be undone.
            </p>
          </div>
          <p className="font-sans text-base font-medium" style={{ color: 'var(--color-on-surface)' }}>
            Are you sure you want to delete <strong>Payment gateway API</strong>? All messages, files, and member associations will be permanently removed.
          </p>
        </div>
      </Modal>

      {/* ── Modal 3: New Topic ───────────────────────────────────── */}
      <Modal
        open={newTopicModalOpen}
        onClose={() => setNewTopicModalOpen(false)}
        title="New topic"
        width="600px"
        footer={<Button onClick={() => setNewTopicModalOpen(false)}>Create topic</Button>}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>Topic name</h3>
            <Input placeholder="Enter topic name" />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>Members</h3>
            <div className="flex gap-3 items-center">
              <Input size="sm" placeholder="Search existing or invite new members by email" className="flex-1" />
              <Button size="sm" iconLeft={Plus} disabled>Invite</Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-md font-medium" style={{ color: 'var(--color-on-surface)' }}>Recent:</span>
              {[
                { initials: 'CL', name: 'Carl Lambertson' },
                { initials: 'DT', name: 'Dean Thomas' },
                { initials: 'DK', name: 'Donnie Kabranos' },
                { initials: 'RD', name: 'Ron Don' },
                { initials: 'CC', name: 'Carl Chest' },
                { initials: 'SS', name: 'Sony Satrava' },
                { initials: 'DD', name: 'Donda Dyson' },
              ].map((m) => (
                <Chip key={m.initials + m.name} size="md" user={{ initials: m.initials }}>{m.name}</Chip>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
