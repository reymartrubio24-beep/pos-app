import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import POSSystem from '../App';

describe('POSSystem', () => {
  beforeEach(() => {
    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    
    // Mock window.alert
    global.alert = vi.fn();
    
    // Mock fetch for backend API
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
      if (url.includes('/api/products') && method === 'POST') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'P999', name: 'New Image Product', price: 150, barcode: 'IMG123', category: 'General', isDeleted: false, image: 'blob:mock-url' })
        });
      }
      if (url.includes('/api/products') && method === 'PUT') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'P001', name: 'White Bread', price: 50, barcode: 'WB001', category: 'Bakery', isDeleted: false })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
    
    // Clear document classes
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('toggles dark theme correctly', async () => {
    const user = userEvent.setup();
    render(<POSSystem />);
    
    const toggleBtn = screen.getByTitle('Toggle Dark Mode');
    
    // Initial state: Light (assuming localStorage returns null/false)
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Click toggle -> Dark
    await user.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', true);

    // Click toggle -> Light
    await user.click(toggleBtn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith('darkMode', false);
  });

  it('persists dark theme from localStorage', () => {
    // Mock localStorage to return 'true'
    Storage.prototype.getItem.mockReturnValue('true');
    
    render(<POSSystem />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('handles image upload and product creation correctly', async () => {
    // Mock owner role
    Storage.prototype.getItem.mockImplementation((key) => {
      if (key === 'role') return 'owner';
      if (key === 'token') return 'mock-token';
      return null;
    });

    const user = userEvent.setup();
    render(<POSSystem />);
    
    // Navigate to Product Management
    const productTab = screen.getByText('Product Management');
    await user.click(productTab);

    // Find inputs
    const nameInput = screen.getByPlaceholderText('Enter product name');
    const priceInput = screen.getByPlaceholderText('0.00');
    const barcodeInput = screen.getByPlaceholderText('Enter barcode');
    // File input is hidden, select by type
    // Note: In React Testing Library, usually we use labels. 
    // Since input is hidden, we can use container querySelector or getByLabelText if associated.
    // In my code, label "Product Image" is for the section, not the input directly via htmlFor.
    // We'll use container.querySelector for the hidden input.
    const fileInput = document.querySelector('input[type="file"]');
    
    // Create file
    const file = new File(['(⌐□_□)'], 'test-image.png', { type: 'image/png' });
    
    // Fill product details
    await user.type(nameInput, 'New Image Product');
    await user.type(priceInput, '150');
    await user.type(barcodeInput, 'IMG123');

    // Upload file
    // Make input visible for userEvent
    fileInput.style.display = 'block';
    await user.upload(fileInput, file);

    // Check preview
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    const preview = await screen.findByAltText('Preview');
    expect(preview).toBeInTheDocument();
    expect(preview.src).toContain('blob:mock-url');
    
    // Add Product
    await user.click(screen.getByText('Add Product'));

    // Check alert
    expect(global.alert).toHaveBeenCalledWith('Product added successfully!');

    // Verify in table
    const rows = screen.getAllByRole('row');
    const lastRow = rows[rows.length - 1];
    expect(lastRow).toHaveTextContent('New Image Product');
    // Check if image is rendered in the row
    const rowImg = lastRow.querySelector('img');
    expect(rowImg).toBeInTheDocument();
    expect(rowImg.src).toContain('blob:mock-url');
  });

  it('positions transaction list on the right on desktop while maintaining DOM order', () => {
    render(<POSSystem />);
    
    // Check DOM order: Cart should be first in DOM (for mobile/accessibility)
    const cartHeader = screen.getByText('Current Transaction');
    // Navigate up to the container div of the Cart Section
    // The Cart Section is the one with "md:col-start-2" class
    const cartSection = cartHeader.closest('.md\\:col-start-2');
    
    const searchInput = screen.getByPlaceholderText(/Search by product name/i);
    // The Products Section is the one with "md:col-start-1" class
    const productsSection = searchInput.closest('.md\\:col-start-1');
    
    expect(cartSection).toBeInTheDocument();
    expect(productsSection).toBeInTheDocument();
    
    // Check DOM order: Cart should precede Products
    expect(cartSection.compareDocumentPosition(productsSection)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

    // Check Grid Classes for Layout
    // Container should be a grid
    const container = cartSection.parentElement;
    expect(container).toHaveClass('grid');
    expect(container).toHaveClass('md:grid-cols-[1fr_24rem]');

    // Cart should be in the second column (Right)
    expect(cartSection).toHaveClass('md:col-start-2');
    expect(cartSection).toHaveClass('md:row-start-1');

    // Check for scrolling behavior (vertical only, no horizontal)
    // The list container inside cartSection should have overflow-y-auto
    const listContainer = cartSection.querySelector('.overflow-y-auto');
    expect(listContainer).toBeInTheDocument();
    expect(listContainer).toHaveClass('overflow-y-auto');
    // Ensure padding is present (minimum 16px/p-4)
    expect(listContainer).toHaveClass('p-4');

    // Products should be in the first column (Left)
    expect(productsSection).toHaveClass('md:col-start-1');
    expect(productsSection).toHaveClass('md:row-start-1');
  });
});
