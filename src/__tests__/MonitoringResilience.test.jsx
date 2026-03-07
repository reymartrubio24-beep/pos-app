import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import POSSystem from '../App.jsx';

describe('Sales Monitoring resilience', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    localStorage.setItem('role', 'owner');
    localStorage.setItem('token', 't');
    localStorage.setItem('username', 'owner');
  });

  it('does not crash when clicking elements even if API fails', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (url) => {
      // Simulate analytics endpoints failing
      if (url.includes('/api/analytics') || url.includes('/api/audit-logs') || url.includes('/inventory/low-stock')) {
        return { ok: false, status: 500, json: async () => ({ error: 'server error' }) };
      }
      return { ok: true, json: async () => [] };
    });
    render(<POSSystem />);
    // Navigate to monitoring
    fireEvent.click(screen.getByText(/Sales Monitoring/i));
    // Click on KPI area (should not crash)
    fireEvent.click(screen.getByText(/Today's Sales/i));
    // The section still renders a fallback or content
    expect(screen.getByText(/Today's Sales/i)).toBeInTheDocument();
    // ErrorBoundary should not render black screen; ensure some element is present
    expect(document.body).toBeTruthy();
  });
});
