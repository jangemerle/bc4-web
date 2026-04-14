import { UserAvatar, UserAvatarLabel } from '../../components/UserAvatar';
import { avatarList } from '../../assets/avatars';
import { PageHero } from '../../layouts/PageHero';
import { Card, SectionTitle, Spec, TokenChips } from '../../layouts/DocHelpers';

export default function UserAvatarPage() {
  return (
    <>
      <PageHero
        title="User Avatar"
        subtitle="Pill shape (radius-xl) · shadow-small-1 · Inter Bold initials · 4 sizes"
        description="Circular avatar for user identity, supporting initials, single-user icon, group icon, and photo variants. Pairs with UserAvatarLabel for name + caption layouts across four sizes."
      />

      <TokenChips tokens={{ Sizes: ['sm', 'md', 'lg', 'xl'], Variants: ['initials', 'image'], Props: ['label', 'caption'] }} />

      <SectionTitle>Sizes</SectionTitle>
      <Card>
        <Spec>Initials — xs (20px · 8px text) · sm (24px · 10px) · md (32px · 12px) · lg (40px · 16px)</Spec>
        <div className="flex items-end gap-6">
          {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <UserAvatar size={s} initials="TV" />
              <span className="font-sans text-sm font-medium" style={{ color: 'var(--color-on-surface-subtle-1)' }}>{s}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Types</SectionTitle>
      <Card>
        <Spec>Initials</Spec>
        <div className="flex items-center gap-4 flex-wrap mb-8">
          <UserAvatar size="lg" initials="TV" />
          <UserAvatar size="lg" initials="DT" />
          <UserAvatar size="lg" initials="JK" />
          <UserAvatar size="lg" initials="AB" />
        </div>
        <Spec>Icon (single user)</Spec>
        <div className="flex items-center gap-4 flex-wrap mb-8">
          <UserAvatar size="xs" />
          <UserAvatar size="sm" />
          <UserAvatar size="md" />
          <UserAvatar size="lg" />
        </div>
        <Spec>Icon (group)</Spec>
        <div className="flex items-center gap-4 flex-wrap">
          <UserAvatar size="xs" group />
          <UserAvatar size="sm" group />
          <UserAvatar size="md" group />
          <UserAvatar size="lg" group />
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Photo avatars</SectionTitle>
      <Card>
        <Spec>20 demo portraits (10 women, 10 men) · each with a unique background color from Figma</Spec>
        <div className="flex flex-wrap gap-3">
          {avatarList.map((a) => (
            <UserAvatar key={a.label} size="lg" src={a.src} alt={a.label} style={{ backgroundColor: a.bg }} />
          ))}
        </div>
        <div className="divider my-6" />
        <Spec>All sizes — same photo</Spec>
        <div className="flex items-end gap-4">
          {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
            <UserAvatar key={s} size={s} src={avatarList[0].src} style={{ backgroundColor: avatarList[0].bg }} />
          ))}
        </div>
      </Card>

      <div className="mt-12" />
      <SectionTitle>Avatar + Label</SectionTitle>
      <Card>
        <Spec>Name only — xs (6px gap) · sm/md (8px gap) · lg (12px gap)</Spec>
        <div className="flex flex-col gap-5 mb-8">
          {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
            <UserAvatarLabel key={s} size={s} initials="TV" name="Thomas Vybert" />
          ))}
        </div>
        <div className="divider my-6" />
        <Spec>With caption (email) — 12px medium · on-surface-subtle-1</Spec>
        <div className="flex flex-col gap-5">
          {(['xs', 'sm', 'md', 'lg'] as const).map((s) => (
            <UserAvatarLabel key={s} size={s} initials="TV" name="Thomas Vybert" caption="donda@grouweapps.com" />
          ))}
        </div>
      </Card>
    </>
  );
}
