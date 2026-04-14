import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { Chip } from '../../components/Chip';
import { UserAvatarLabel } from '../../components/UserAvatar';
import { PageHero } from '../../layouts/PageHero';
import { Section } from '../../layouts/Section';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function ModalPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <PageHero
        title="Modal"
        subtitle="A surface that demands a decision"
        description="Full keyboard support. Focus trapped. Escape always works. The modal's job is to get a clear yes/no — or settings saved — without confusion about what's being confirmed. The title should be the question. The primary button should be the answer."
      />

      <TokenChips tokens={{ Slots: ['title', 'content', 'footer'], Props: ['open', 'onClose', 'width'], Keyboard: ['Escape', 'Tab trap'] }} />

      <SectionTitle>Structure</SectionTitle>
      <Card>
        <Spec>Header: Borna Bold 24px + close button (X icon, 20px) · Content: scrollable, 24px padding · Footer: sticky, right-aligned actions</Spec>
        <div className="flex flex-col gap-4">
          <p className="font-sans text-base font-medium" style={{ color: 'var(--color-on-surface)' }}>
            Click the button below to see the modal in action:
          </p>
          <div>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
          </div>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Topic settings"
        footer={<Button onClick={() => setModalOpen(false)}>Save</Button>}
      >
        <div className="flex flex-col gap-8">
          {/* Topic name */}
          <div className="flex flex-col gap-3">
            <h3 className="font-display text-headline-s font-bold" style={{ color: 'var(--color-on-surface)' }}>Topic name</h3>
            <Input defaultValue="Payment gateway API" />
          </div>

          {/* Members */}
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
        </div>
      </Modal>

      <Section title="What modals say" level="minor">
        <div className="flex flex-col gap-3" style={{ color: 'var(--color-on-surface-subtle-1)' }}>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Title: question or statement, not both.</strong> "Delete project?" or "Project settings". Never "Are you sure you want to delete this project?"</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Destructive title = the action.</strong> "Remove Sandra from team?" not "Confirm member removal".</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Body: consequence, not restatement.</strong> Don't restate the title. Tell the user what the impact is.</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Primary button = the action.</strong> "Delete project" not "Yes". "Remove member" not "Confirm".</p>
          <p className="font-sans text-md"><strong style={{ color: 'var(--color-on-surface)' }}>Always label the escape hatch.</strong> "Cancel" or "Keep [thing]". "Keep Sandra" is always better than "No".</p>
        </div>
      </Section>
    </>
  );
}
