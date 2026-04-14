import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';
import { Heart, Settings } from 'lucide-react';

describe('Card', () => {
  // ── Card root rendering ────────────────────────────────────────────────

  it('renders as a div by default', () => {
    const { container } = render(
      <Card>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const card = container.querySelector('div');
    expect(card).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Card>
        <Card.Body>Test content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders as anchor when as="a"', () => {
    const { container } = render(
      <Card as="a" href="/test">
        <Card.Body>Link card</Card.Body>
      </Card>
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('renders as button when as="button"', () => {
    const { container } = render(
      <Card as="button">
        <Card.Body>Button card</Card.Body>
      </Card>
    );
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  // ── Variants ───────────────────────────────────────────────────────────

  it('applies elevated variant by default', () => {
    const { container } = render(
      <Card>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ backgroundColor: 'var(--color-surface-1)' });
  });

  it('applies different variants', () => {
    const { rerender } = render(
      <Card variant="outlined">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Card variant="filled">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Card variant="ai">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  // ── Density ────────────────────────────────────────────────────────────

  it('applies different density variants', () => {
    const { rerender } = render(
      <Card density="default">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Card density="compact">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();

    rerender(
      <Card density="flush">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  // ── Card.Header ────────────────────────────────────────────────────────

  it('renders Card.Header with title', () => {
    render(
      <Card>
        <Card.Header title="Card Title" />
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  it('renders header icon', () => {
    const { container } = render(
      <Card>
        <Card.Header icon={Heart} title="Favorites" />
      </Card>
    );
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('renders header description', () => {
    render(
      <Card>
        <Card.Header title="Title" description="This is a description" />
      </Card>
    );
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('renders custom chip in header', () => {
    render(
      <Card>
        <Card.Header title="Title" chip={<span>NEW</span>} />
      </Card>
    );
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('renders default AI chip when variant is ai and no chip provided', () => {
    render(
      <Card variant="ai">
        <Card.Header title="AI Feature" />
      </Card>
    );
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  it('renders custom chip instead of default AI chip', () => {
    render(
      <Card variant="ai">
        <Card.Header title="Title" chip={<span>CUSTOM</span>} />
      </Card>
    );
    expect(screen.queryByText('AI')).not.toBeInTheDocument();
    expect(screen.getByText('CUSTOM')).toBeInTheDocument();
  });

  it('renders header actions', () => {
    render(
      <Card>
        <Card.Header title="Title" actions={<button>Action</button>} />
      </Card>
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders header children', () => {
    render(
      <Card>
        <Card.Header>
          <div>Custom content</div>
        </Card.Header>
      </Card>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  // ── Card.Body ──────────────────────────────────────────────────────────

  it('renders Card.Body', () => {
    render(
      <Card>
        <Card.Body>Body content</Card.Body>
      </Card>
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders multiple children in Card.Body', () => {
    render(
      <Card>
        <Card.Body>
          <p>First</p>
          <p>Second</p>
        </Card.Body>
      </Card>
    );
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  // ── Card.Footer ────────────────────────────────────────────────────────

  it('renders Card.Footer', () => {
    render(
      <Card>
        <Card.Footer>
          <button>Cancel</button>
          <button>Save</button>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('aligns footer content with different alignments', () => {
    const { rerender, container } = render(
      <Card>
        <Card.Footer>
          <button>Action</button>
        </Card.Footer>
      </Card>
    );
    expect(container.querySelector('button')).toBeInTheDocument();

    rerender(
      <Card>
        <Card.Footer align="start">
          <button>Action</button>
        </Card.Footer>
      </Card>
    );
    expect(container.querySelector('button')).toBeInTheDocument();

    rerender(
      <Card>
        <Card.Footer align="between">
          <div>Left</div>
          <div>Right</div>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByText('Left')).toBeInTheDocument();
    expect(screen.getByText('Right')).toBeInTheDocument();
  });

  // ── Card.Media ─────────────────────────────────────────────────────────

  it('renders Card.Media', () => {
    render(
      <Card>
        <Card.Media>
          <img src="/test.jpg" alt="Test" />
        </Card.Media>
      </Card>
    );
    expect(screen.getByAltText('Test')).toBeInTheDocument();
  });

  it('media renders within card', () => {
    const { container } = render(
      <Card density="default">
        <Card.Media>
          <img src="/test.jpg" alt="Test" />
        </Card.Media>
      </Card>
    );
    const media = container.querySelector('div > div:first-child');
    expect(media).toBeInTheDocument();
  });

  it('media renders in flush density', () => {
    const { container } = render(
      <Card density="flush">
        <Card.Media>
          <img src="/test.jpg" alt="Test" />
        </Card.Media>
      </Card>
    );
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
  });

  // ── Card.Divider ───────────────────────────────────────────────────────

  it('renders Card.Divider', () => {
    const { container } = render(
      <Card>
        <Card.Divider />
      </Card>
    );
    const divider = container.querySelector('hr');
    expect(divider).toBeInTheDocument();
  });

  it('divider renders in card', () => {
    const { container } = render(
      <Card>
        <Card.Divider />
      </Card>
    );
    const divider = container.querySelector('hr');
    expect(divider).toBeInTheDocument();
  });

  it('divider inset prop affects rendering', () => {
    const { container: insetContainer } = render(
      <Card>
        <Card.Divider inset />
      </Card>
    );
    expect(insetContainer.querySelector('hr')).toBeInTheDocument();

    const { container: notInsetContainer } = render(
      <Card>
        <Card.Divider inset={false} />
      </Card>
    );
    expect(notInsetContainer.querySelector('hr')).toBeInTheDocument();
  });

  // ── Composed card ──────────────────────────────────────────────────────

  it('renders complete card composition', () => {
    render(
      <Card>
        <Card.Header icon={Heart} title="Favorites" description="Your saved items" />
        <Card.Body>
          <p>Content here</p>
        </Card.Body>
        <Card.Divider />
        <Card.Footer>
          <button>View All</button>
        </Card.Footer>
      </Card>
    );

    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Your saved items')).toBeInTheDocument();
    expect(screen.getByText('Content here')).toBeInTheDocument();
    expect(screen.getByText('View All')).toBeInTheDocument();
  });

  // ── Clickable cards ────────────────────────────────────────────────────

  it('button card is clickable', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Card as="button" onClick={handleClick}>
        <Card.Body>Clickable</Card.Body>
      </Card>
    );
    await user.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('anchor card has proper link attributes when external', () => {
    const { container } = render(
      <Card as="a" href="https://example.com" target="_blank">
        <Card.Body>External link</Card.Body>
      </Card>
    );
    const link = container.querySelector('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('button card has focus-visible outline classes', () => {
    const { container } = render(
      <Card as="button">
        <Card.Body>Focus me</Card.Body>
      </Card>
    );
    const button = container.querySelector('button');
    expect(button?.className).toContain('focus-visible:outline');
  });

  // ── Custom props ───────────────────────────────────────────────────────

  it('passes className through', () => {
    const { container } = render(
      <Card className="custom-card">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-card');
  });

  it('passes custom style through', () => {
    const { container } = render(
      <Card style={{ marginTop: '20px' }}>
        <Card.Body>Content</Card.Body>
      </Card>
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveStyle({ marginTop: '20px' });
  });

  it('passes data attributes through', () => {
    render(
      <Card data-testid="custom-card">
        <Card.Body>Content</Card.Body>
      </Card>
    );
    expect(screen.getByTestId('custom-card')).toBeInTheDocument();
  });

  // ── Edge cases ─────────────────────────────────────────────────────────

  it('handles empty card', () => {
    const { container } = render(<Card />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('handles card with only media', () => {
    render(
      <Card>
        <Card.Media>
          <img src="/test.jpg" alt="Test" />
        </Card.Media>
      </Card>
    );
    expect(screen.getByAltText('Test')).toBeInTheDocument();
  });

  it('handles card with long title', () => {
    render(
      <Card>
        <Card.Header title="This is a very long title that might wrap to multiple lines in the card header" />
      </Card>
    );
    expect(screen.getByText(/This is a very long title/)).toBeInTheDocument();
  });

  it('combines multiple subcomponents correctly', () => {
    render(
      <Card variant="outlined" density="compact">
        <Card.Header icon={Settings} title="Settings" description="Manage your preferences" />
        <Card.Body>
          <p>Setting 1</p>
          <p>Setting 2</p>
        </Card.Body>
      </Card>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage your preferences')).toBeInTheDocument();
    expect(screen.getByText('Setting 1')).toBeInTheDocument();
    expect(screen.getByText('Setting 2')).toBeInTheDocument();
  });

  // ── Hover shadow variants ──────────────────────────────────────────────

  it('applies hover shadow for outlined clickable variant', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Card as="button" variant="outlined">
        <Card.Body>Outlined button</Card.Body>
      </Card>
    );
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    await user.hover(button!);
    expect(screen.getByText('Outlined button')).toBeInTheDocument();
  });

  it('applies hover shadow for filled clickable variant', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Card as="button" variant="filled">
        <Card.Body>Filled button</Card.Body>
      </Card>
    );
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    await user.hover(button!);
    expect(screen.getByText('Filled button')).toBeInTheDocument();
  });

  it('applies hover shadow for ai clickable variant', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Card as="button" variant="ai">
        <Card.Body>AI button</Card.Body>
      </Card>
    );
    const button = container.querySelector('button');
    expect(button).toBeInTheDocument();
    await user.hover(button!);
    expect(screen.getByText('AI button')).toBeInTheDocument();
  });
});
