import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UserAvatar, UserAvatarLabel } from './UserAvatar';
import { User } from 'lucide-react';

describe('UserAvatar', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders with initials', () => {
    render(<UserAvatar initials="TV" />);
    expect(screen.getByText('TV')).toBeInTheDocument();
  });

  it('renders with photo', () => {
    render(<UserAvatar src="/photo.jpg" alt="Test User" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/photo.jpg');
    expect(img).toHaveAttribute('alt', 'Test User');
  });

  it('renders with custom icon', () => {
    const { container } = render(<UserAvatar icon={User} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders default icon when no initials or src provided', () => {
    const { container } = render(<UserAvatar />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders group icon when group prop is true', () => {
    const { container } = render(<UserAvatar group />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────

  it('applies xs size class', () => {
    const { container: c } = render(<UserAvatar initials="AB" size="xs" />);
    const div = c.firstChild as HTMLElement;
    expect(div.className).toContain('size-5');
  });

  it('applies sm size class', () => {
    const { container: c } = render(<UserAvatar initials="AB" size="sm" />);
    const div = c.firstChild as HTMLElement;
    expect(div.className).toContain('size-6');
  });

  it('applies md size class', () => {
    const { container: c } = render(<UserAvatar initials="AB" size="md" />);
    const div = c.firstChild as HTMLElement;
    expect(div.className).toContain('size-8');
  });

  it('applies lg size class', () => {
    const { container: c } = render(<UserAvatar initials="AB" size="lg" />);
    const div = c.firstChild as HTMLElement;
    expect(div.className).toContain('size-10');
  });

  // ── Custom className and style ─────────────────────────────────────────

  it('accepts custom className', () => {
    const { container } = render(<UserAvatar initials="TV" className="custom-class" />);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('custom-class');
  });

  it('accepts custom style', () => {
    const { container } = render(<UserAvatar initials="TV" style={{ opacity: 0.5 }} />);
    const div = container.firstChild as HTMLElement;
    expect(div.style.opacity).toBe('0.5');
  });

  // ── Photo rendering ───────────────────────────────────────────────────

  it('renders photo with absolute positioning', () => {
    render(<UserAvatar src="/photo.jpg" alt="User" />);
    const img = screen.getByRole('img');
    expect(img.className).toContain('absolute');
    expect(img.className).toContain('inset-0');
  });

  it('photo takes priority over initials', () => {
    render(<UserAvatar src="/photo.jpg" alt="User" initials="AB" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(screen.queryByText('AB')).not.toBeInTheDocument();
  });

  it('uses provided alt text for photo', () => {
    render(<UserAvatar src="/photo.jpg" alt="Jane Doe" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Jane Doe');
  });

  it('uses empty alt when not provided', () => {
    const { container } = render(<UserAvatar src="/photo.jpg" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '');
  });

  // ── Initials rendering ────────────────────────────────────────────────

  it('displays initials text', () => {
    render(<UserAvatar initials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies initials styling', () => {
    const { container } = render(<UserAvatar initials="TV" />);
    const initialsDiv = container.querySelector('[style*="--color-on-surface"]') as HTMLElement | null;
    expect(initialsDiv).toBeInTheDocument();
    if (initialsDiv) {
      expect(initialsDiv.className).toContain('inset-0');
      expect(initialsDiv.className).toContain('flex');
    }
  });

  // ── Icon rendering ────────────────────────────────────────────────────

  it('renders icon in default variant', () => {
    const { container } = render(<UserAvatar />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('icon takes fallback position when no initials or src', () => {
    const { container } = render(<UserAvatar />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});

describe('UserAvatarLabel', () => {
  // ── Rendering ─────────────────────────────────────────────────────────

  it('renders avatar with name', () => {
    render(<UserAvatarLabel initials="TV" name="Thomas Vybert" />);
    expect(screen.getByText('Thomas Vybert')).toBeInTheDocument();
  });

  it('renders avatar, name, and caption', () => {
    render(
      <UserAvatarLabel
        initials="TV"
        name="Thomas Vybert"
        caption="donda@grouweapps.com"
      />
    );
    expect(screen.getByText('Thomas Vybert')).toBeInTheDocument();
    expect(screen.getByText('donda@grouweapps.com')).toBeInTheDocument();
  });

  it('does not render caption when not provided', () => {
    render(<UserAvatarLabel initials="TV" name="Thomas Vybert" />);
    expect(screen.queryByText('donda@grouweapps.com')).not.toBeInTheDocument();
  });

  // ── Sizes ──────────────────────────────────────────────────────────────

  it('applies xs gap size', () => {
    const { container } = render(
      <UserAvatarLabel initials="AB" size="xs" name="Test" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('gap-[6px]');
  });

  it('applies sm gap size', () => {
    const { container } = render(
      <UserAvatarLabel initials="AB" size="sm" name="Test" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('gap-2');
  });

  it('applies md gap size', () => {
    const { container } = render(
      <UserAvatarLabel initials="AB" size="md" name="Test" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('gap-2');
  });

  it('applies lg gap size', () => {
    const { container } = render(
      <UserAvatarLabel initials="AB" size="lg" name="Test" />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('gap-3');
  });

  // ── Custom className ──────────────────────────────────────────────────

  it('accepts custom className', () => {
    const { container } = render(
      <UserAvatarLabel
        initials="TV"
        name="Test"
        className="custom-class"
      />
    );
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('custom-class');
  });

  // ── Variants with different avatar types ───────────────────────────────

  it('renders with photo src', () => {
    const { container } = render(
      <UserAvatarLabel
        src="/photo.jpg"
        name="Photo User"
      />
    );
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(screen.getByText('Photo User')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const { container } = render(
      <UserAvatarLabel
        icon={User}
        name="Icon User"
      />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText('Icon User')).toBeInTheDocument();
  });

  // ── Text styling ───────────────────────────────────────────────────────

  it('applies name styling', () => {
    render(<UserAvatarLabel initials="TV" name="Test User" />);
    const nameElement = screen.getByText('Test User');
    expect(nameElement.className).toContain('font-bold');
  });

  it('applies caption styling when present', () => {
    render(
      <UserAvatarLabel
        initials="TV"
        name="Test User"
        caption="test@example.com"
      />
    );
    const captionElement = screen.getByText('test@example.com');
    expect(captionElement.className).toContain('font-medium');
  });
});
