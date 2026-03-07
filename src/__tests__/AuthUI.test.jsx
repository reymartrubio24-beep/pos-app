import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import POSSystem from '../App.jsx';

describe('Auth UI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('shows specific error when owner login is locked (403)', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (url) => {
      if (url.includes('/api/auth/login')) {
        return {
          ok: false,
          status: 403,
          json: async () => ({ error: 'Account locked. Try later.' })
        };
      }
      return { ok: true, json: async () => [] };
    });
    render(<POSSystem />);
    fireEvent.click(screen.getByTitle('Login'));
    const userInput = screen.getByPlaceholderText('owner');
    fireEvent.change(userInput, { target: { value: 'owner' } });
    const passInput = screen.getByPlaceholderText('owner123');
    fireEvent.change(passInput, { target: { value: 'wrong' } });
    const loginButtons = screen.getAllByRole('button', { name: /login/i });
    // Click the submit login in the form (last one)
    fireEvent.click(loginButtons[loginButtons.length - 1]);
    
    // Expect alert called with specific message
    const alertSpy = vi.spyOn(window, 'alert');
    
    // Use waitFor to wait for the async alert call
    await vi.waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      expect(alertSpy.mock.calls[0][0]).toMatch(/locked/i);
    }, { timeout: 2000 });
  });

  it('stores token and role on successful owner login', async () => {
    vi.spyOn(window, 'fetch').mockImplementation(async (url) => {
      if (url.includes('/api/auth/login')) {
        return {
          ok: true,
          json: async () => ({ token: 't', role: 'owner', username: 'owner' })
        };
      }
      return { ok: true, json: async () => [] };
    });
    render(<POSSystem />);
    fireEvent.click(screen.getByTitle('Login'));
    fireEvent.change(screen.getByPlaceholderText('owner'), { target: { value: 'owner' } });
    fireEvent.change(screen.getByPlaceholderText('owner123'), { target: { value: 'owner123' } });
    const loginButtons2 = screen.getAllByRole('button', { name: /login/i });
    fireEvent.click(loginButtons2[loginButtons2.length - 1]);
    
    await vi.waitFor(() => {
      expect(localStorage.getItem('role')).toBe('owner');
      expect(localStorage.getItem('token')).toBe('t');
    }, { timeout: 2000 });
  });
});
