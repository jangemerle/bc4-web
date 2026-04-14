import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  // ── Test helpers ──────────────────────────────────────────────────────

  const renderPagination = (props = {}) => {
    const defaultProps = {
      page: 1,
      totalPages: 10,
      onPageChange: vi.fn(),
      ...props,
    };
    return render(<Pagination {...defaultProps} />);
  };

  // ── Rendering ─────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders nav with aria-label="Pagination"', () => {
      renderPagination();
      const nav = screen.getByRole('navigation', { name: /pagination/i });
      expect(nav).toBeInTheDocument();
    });

    it('shows page number buttons', () => {
      renderPagination({ totalPages: 5 });
      const allButtons = screen.getAllByRole('button', { name: /page/i });
      expect(allButtons.length).toBeGreaterThanOrEqual(5); // At least 5 page buttons
      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
    });

    it('shows prev button', () => {
      renderPagination();
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    });

    it('shows next button', () => {
      renderPagination();
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
    });

    it('shows first button when totalPages > 5', () => {
      renderPagination({ totalPages: 6 });
      expect(screen.getByRole('button', { name: /first page/i })).toBeInTheDocument();
    });

    it('shows last button when totalPages > 5', () => {
      renderPagination({ totalPages: 6 });
      expect(screen.getByRole('button', { name: /last page/i })).toBeInTheDocument();
    });

    it('hides first button when totalPages <= 5', () => {
      renderPagination({ totalPages: 5 });
      expect(screen.queryByRole('button', { name: /first page/i })).not.toBeInTheDocument();
    });

    it('hides last button when totalPages <= 5', () => {
      renderPagination({ totalPages: 5 });
      expect(screen.queryByRole('button', { name: /last page/i })).not.toBeInTheDocument();
    });

    it('shows row range text when totalRows and rowsPerPage provided', () => {
      renderPagination({
        page: 1,
        totalPages: 10,
        totalRows: 487,
        rowsPerPage: 25,
      });
      expect(screen.getByText('1–25 of 487')).toBeInTheDocument();
    });

    it('shows rows-per-page selector when options and callback provided', () => {
      renderPagination({
        rowsPerPageOptions: [10, 25, 50, 100],
        onRowsPerPageChange: vi.fn(),
        rowsPerPage: 25,
      });
      expect(screen.getByText('Rows')).toBeInTheDocument();
      // Select component shows the current value as text in the button
      expect(screen.getByRole('combobox')).toHaveTextContent('25');
    });

    it('returns null when single page and no row range text', () => {
      const { container } = renderPagination({ totalPages: 1 });
      expect(container.firstChild).toBeNull();
    });

    it('renders nav when single page but rowRangeText is shown', () => {
      renderPagination({
        totalPages: 1,
        totalRows: 50,
        rowsPerPage: 25,
      });
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('does not show page controls when totalPages <= 1', () => {
      renderPagination({
        totalPages: 1,
        totalRows: 50,
        rowsPerPage: 25,
      });
      expect(screen.queryByRole('button', { name: /previous page/i })).not.toBeInTheDocument();
    });
  });

  // ── Page range algorithm ──────────────────────────────────────────────

  describe('Page range algorithm', () => {
    it('shows all pages when totalPages <= maxButtons', () => {
      renderPagination({ totalPages: 5, maxButtons: 7 });
      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 4' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
    });

    it('shows ellipsis for many pages', () => {
      renderPagination({
        page: 1,
        totalPages: 20,
        maxButtons: 7,
      });
      const ellipses = screen.getAllByText('...');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('first and last page always visible with ellipsis', () => {
      renderPagination({
        page: 10,
        totalPages: 20,
        maxButtons: 7,
      });
      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 20' })).toBeInTheDocument();
    });

    it('highlights current page with aria-current="page"', () => {
      renderPagination({ page: 3, totalPages: 10 });
      const currentPageButton = screen.getByRole('button', { name: 'Page 3' });
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('other pages do not have aria-current', () => {
      renderPagination({ page: 3, totalPages: 10 });
      const page1Button = screen.getByRole('button', { name: 'Page 1' });
      expect(page1Button).not.toHaveAttribute('aria-current');
    });

    it('shows pages around current when in the middle', () => {
      renderPagination({
        page: 10,
        totalPages: 20,
        maxButtons: 7,
      });
      // Default maxButtons is 7, so with sideCount = 2, should show pages around 10
      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 20' })).toBeInTheDocument();
    });
  });

  // ── Interactions ──────────────────────────────────────────────────────

  describe('Interactions', () => {
    it('calls onPageChange when clicking a page number', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      renderPagination({
        page: 1,
        totalPages: 10,
        onPageChange: handlePageChange,
      });
      await user.click(screen.getByRole('button', { name: 'Page 3' }));
      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with next page on prev button click from page > 1', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      renderPagination({
        page: 5,
        totalPages: 10,
        onPageChange: handlePageChange,
      });
      await user.click(screen.getByRole('button', { name: /previous page/i }));
      expect(handlePageChange).toHaveBeenCalledWith(4);
    });

    it('calls onPageChange with next page on next button click', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      renderPagination({
        page: 5,
        totalPages: 10,
        onPageChange: handlePageChange,
      });
      await user.click(screen.getByRole('button', { name: /next page/i }));
      expect(handlePageChange).toHaveBeenCalledWith(6);
    });

    it('calls onPageChange(1) on first button click', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      renderPagination({
        page: 8,
        totalPages: 20,
        onPageChange: handlePageChange,
      });
      await user.click(screen.getByRole('button', { name: /first page/i }));
      expect(handlePageChange).toHaveBeenCalledWith(1);
    });

    it('calls onPageChange(totalPages) on last button click', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      renderPagination({
        page: 5,
        totalPages: 20,
        onPageChange: handlePageChange,
      });
      await user.click(screen.getByRole('button', { name: /last page/i }));
      expect(handlePageChange).toHaveBeenCalledWith(20);
    });

    it('disables prev button on page 1', () => {
      renderPagination({ page: 1, totalPages: 10 });
      expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    });

    it('disables next button on last page', () => {
      renderPagination({ page: 10, totalPages: 10 });
      expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
    });

    it('disables first button on page 1', () => {
      renderPagination({ page: 1, totalPages: 20 });
      expect(screen.getByRole('button', { name: /first page/i })).toBeDisabled();
    });

    it('disables last button on last page', () => {
      renderPagination({ page: 20, totalPages: 20 });
      expect(screen.getByRole('button', { name: /last page/i })).toBeDisabled();
    });

    it('prev button is enabled on page 2', () => {
      renderPagination({ page: 2, totalPages: 10 });
      expect(screen.getByRole('button', { name: /previous page/i })).not.toBeDisabled();
    });

    it('next button is enabled on page 9 of 10', () => {
      renderPagination({ page: 9, totalPages: 10 });
      expect(screen.getByRole('button', { name: /next page/i })).not.toBeDisabled();
    });
  });

  // ── Rows per page ─────────────────────────────────────────────────────

  describe('Rows per page', () => {
    it('calls onRowsPerPageChange with selected value', async () => {
      const user = userEvent.setup();
      const handleRowsChange = vi.fn();
      renderPagination({
        page: 3,
        totalPages: 20,
        rowsPerPage: 25,
        rowsPerPageOptions: [10, 25, 50, 100],
        onRowsPerPageChange: handleRowsChange,
      });
      const selector = screen.getByRole('combobox');
      await user.click(selector);
      await user.click(screen.getByRole('menuitem', { name: '50' }));
      expect(handleRowsChange).toHaveBeenCalledWith(50);
    });

    it('calls onPageChange(1) when rows per page changes', async () => {
      const user = userEvent.setup();
      const handlePageChange = vi.fn();
      const handleRowsChange = vi.fn();
      renderPagination({
        page: 3,
        totalPages: 20,
        rowsPerPage: 25,
        rowsPerPageOptions: [10, 25, 50, 100],
        onRowsPerPageChange: handleRowsChange,
        onPageChange: handlePageChange,
      });
      const selector = screen.getByRole('combobox');
      await user.click(selector);
      await user.click(screen.getByRole('menuitem', { name: '50' }));
      expect(handlePageChange).toHaveBeenCalledWith(1);
    });
  });

  // ── Row range text calculation ────────────────────────────────────────

  describe('Row range text', () => {
    it('shows correct range on first page', () => {
      renderPagination({
        page: 1,
        totalPages: 20,
        totalRows: 487,
        rowsPerPage: 25,
      });
      expect(screen.getByText('1–25 of 487')).toBeInTheDocument();
    });

    it('shows correct range on middle page', () => {
      renderPagination({
        page: 3,
        totalPages: 20,
        totalRows: 487,
        rowsPerPage: 25,
      });
      expect(screen.getByText('51–75 of 487')).toBeInTheDocument();
    });

    it('shows correct range on last page with partial rows', () => {
      renderPagination({
        page: 20,
        totalPages: 20,
        totalRows: 487,
        rowsPerPage: 25,
      });
      expect(screen.getByText('476–487 of 487')).toBeInTheDocument();
    });

    it('does not show row range when totalRows is undefined', () => {
      renderPagination({
        page: 1,
        totalPages: 10,
        rowsPerPage: 25,
      });
      expect(screen.queryByText(/of/)).not.toBeInTheDocument();
    });

    it('does not show row range when rowsPerPage is undefined', () => {
      renderPagination({
        page: 1,
        totalPages: 10,
        totalRows: 487,
      });
      expect(screen.queryByText(/of/)).not.toBeInTheDocument();
    });
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  describe('Edge cases', () => {
    it('returns null for single page with no rowRangeText', () => {
      const { container } = renderPagination({ totalPages: 1 });
      expect(container.firstChild).toBeNull();
    });

    it('handles very large page counts', () => {
      renderPagination({
        page: 500,
        totalPages: 1000,
        maxButtons: 7,
      });
      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 500' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 1000' })).toBeInTheDocument();
    });

    it('handles maxButtons=3', () => {
      renderPagination({
        page: 5,
        totalPages: 10,
        maxButtons: 3,
      });
      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
      // Should include current page
      expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
    });

    it('respects showFirstLast=false even when totalPages > 5', () => {
      renderPagination({
        page: 5,
        totalPages: 20,
        showFirstLast: false,
      });
      expect(screen.queryByRole('button', { name: /first page/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /last page/i })).not.toBeInTheDocument();
    });

    it('respects showFirstLast=true even when totalPages <= 5', () => {
      renderPagination({
        page: 2,
        totalPages: 5,
        showFirstLast: true,
      });
      expect(screen.getByRole('button', { name: /first page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /last page/i })).toBeInTheDocument();
    });
  });

  // ── Accessibility ─────────────────────────────────────────────────────

  describe('Accessibility', () => {
    it('nav element has aria-label="Pagination"', () => {
      renderPagination();
      const nav = screen.getByRole('navigation', { name: /pagination/i });
      expect(nav).toHaveAttribute('aria-label', 'Pagination');
    });

    it('current page has aria-current="page"', () => {
      renderPagination({ page: 5, totalPages: 10 });
      const currentPageButton = screen.getByRole('button', { name: /page 5/i });
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('all page buttons have aria-label', () => {
      renderPagination({ totalPages: 5 });
      const pageButtons = screen.getAllByRole('button', { name: /page \d+/i });
      pageButtons.forEach((btn) => {
        expect(btn).toHaveAttribute('aria-label');
      });
    });

    it('all navigation buttons have aria-label', () => {
      renderPagination({ page: 5, totalPages: 10 });
      const prevBtn = screen.getByRole('button', { name: /previous page/i });
      const nextBtn = screen.getByRole('button', { name: /next page/i });
      expect(prevBtn).toHaveAttribute('aria-label');
      expect(nextBtn).toHaveAttribute('aria-label');
    });

    it('ellipsis is aria-hidden', () => {
      renderPagination({
        page: 1,
        totalPages: 20,
        maxButtons: 7,
      });
      const ellipses = screen.getAllByText('...');
      ellipses.forEach((ellipsis) => {
        expect(ellipsis).toHaveAttribute('aria-hidden', 'true');
      });
    });

    it('first and last buttons have aria-labels', () => {
      renderPagination({ page: 5, totalPages: 20 });
      expect(screen.getByRole('button', { name: /first page/i })).toHaveAttribute(
        'aria-label',
        'First page',
      );
      expect(screen.getByRole('button', { name: /last page/i })).toHaveAttribute(
        'aria-label',
        'Last page',
      );
    });
  });

  // ── Size prop ─────────────────────────────────────────────────────────

  describe('Size prop', () => {
    it('renders with default size "sm"', () => {
      renderPagination({ totalPages: 5 });
      // Default size should be applied
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });

    it('renders with size="xs"', () => {
      renderPagination({ totalPages: 5, size: 'xs' });
      expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
    });
  });
});
