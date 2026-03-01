import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import POSSystem from '../App';

describe('POSSystem Enhanced Features', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'role') return 'owner';
      if (key === 'token') return 'mock-token';
      return null;
    });
    vi.spyOn(Storage.prototype, 'setItem');
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.alert = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    
    global.fetch = vi.fn((url, options = {}) => {
      const method = options.method || 'GET';
      if (url.includes('/api/products') && method === 'GET') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 'P001', name: 'White Bread', price: 50, barcode: 'WB001', category: 'Bakery', isDeleted: false },
            { id: 'P002', name: 'Milk', price: 80, barcode: 'MLK001', category: 'Dairy', isDeleted: false }
          ])
        });
      }
      if (url.includes('/api/products') && method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'P001', name: 'White Bread', price: 50, barcode: 'WB001', category: 'Bakery', isDeleted: false })
        });
      }
      if (url.includes('/api/products') && method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'P999', name: 'New Image Product', price: 150, barcode: 'IMG123', category: 'General', isDeleted: false })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deletes a product successfully', async () => {
    const user = userEvent.setup();
    render(<POSSystem />);
    
    // Navigate to Product Management
    await user.click(screen.getByText('Product Management'));

    // Find first product row
    const rows = screen.getAllByRole('row');
    // Row 0 is header, Row 1 is first product
    const firstRow = rows[1];
    const productName = within(firstRow).getByText('White Bread');
    expect(productName).toBeInTheDocument();

    // Click delete button
    const deleteBtn = within(firstRow).getByTitle('Delete Product');
    await user.click(deleteBtn);

    // Modal should appear
    expect(screen.getByText('Delete Product?')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();

    // Confirm delete
    const confirmBtn = screen.getByRole('button', { name: 'Delete' });
    await user.click(confirmBtn);

    // Modal should disappear
    await waitFor(() => {
        expect(screen.queryByText('Delete Product?')).not.toBeInTheDocument();
    });

    // Product should be gone from table
    expect(screen.queryByText('White Bread')).not.toBeInTheDocument();

    // Audit log should be updated
    expect(screen.getByText(/Soft deleted product: White Bread/)).toBeInTheDocument();
  });

  it('cascades delete to cart', async () => {
    const user = userEvent.setup();
    render(<POSSystem />);

    // Add item to cart first (POS View)
    // Wait for POS view to load products
    await screen.findByText('White Bread');
    await user.click(screen.getByText('White Bread'));
    
    // Verify item in cart - Cart Section is identifiable
    const cartSection = screen.getByText('Current Transaction').closest('div').parentElement;
    expect(within(cartSection).getByText('White Bread')).toBeInTheDocument();

    // Go to Product Management
    await user.click(screen.getByText('Product Management'));

    // Delete item
    const rows = screen.getAllByRole('row');
    const firstRow = rows[1];
    const deleteBtn = within(firstRow).getByTitle('Delete Product');
    await user.click(deleteBtn);
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    // Go back to POS View
    await user.click(screen.getByText('Point of Sale'));

    // Cart should be empty
    expect(screen.getByText('Cart is empty')).toBeInTheDocument();
  });

  it('updates product image via modal', async () => {
    const user = userEvent.setup();
    render(<POSSystem />);
    
    await user.click(screen.getByText('Product Management'));

    const rows = screen.getAllByRole('row');
    const firstRow = rows[1];
    
    // Click edit image button
    const editBtn = within(firstRow).getByTitle('Update Image');
    await user.click(editBtn);

    // Modal appears
    expect(screen.getByText('Update Image')).toBeInTheDocument();

    // Upload file
    const file = new File(['(⌐□_□)'], 'new-image.png', { type: 'image/png' });
    // Note: The modal renders a NEW input type file.
    // We need to target the input inside the modal.
    const modal = screen.getByText('Update Image').closest('div').parentElement;
    const fileInput = modal.querySelector('input[type="file"]');
    
    // Make visible for userEvent if hidden
    if (fileInput) fileInput.style.display = 'block';
    await user.upload(fileInput, file);

    // Check preview in modal
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    
    // Save
    const saveBtn = screen.getByText('Save Changes');
    await user.click(saveBtn);

    // Modal closes
    await waitFor(() => {
        expect(screen.queryByText('Update Image')).not.toBeInTheDocument();
    });

    // Audit log
    expect(screen.getByText(/Updated image for product: White Bread/)).toBeInTheDocument();
  });
});
