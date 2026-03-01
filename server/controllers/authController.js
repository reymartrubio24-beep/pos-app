import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { run, get } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-env';

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role, username: user.username }, JWT_SECRET, {
    expiresIn: '8h',
  });
}

function createRefreshToken() {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      await run(`INSERT INTO audit_logs (action, details, action_type, table_name) VALUES (?,?,?,?)`, ['AUTH_FAIL', 'Missing credentials', 'AUTH', 'users']);
      return res.status(400).json({ error: 'Missing credentials' });
    }
    const user = await get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (!user) {
      await run(`INSERT INTO audit_logs (action, details, action_type, table_name) VALUES (?,?,?,?)`, ['AUTH_FAIL', `User not found: ${username}`, 'AUTH', 'users']);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      await run(`INSERT INTO audit_logs (action, details, user_id, action_type, table_name) VALUES (?,?,?,?,?)`, ['AUTH_FAIL', 'Account locked', user.id, 'AUTH', 'users']);
      return res.status(403).json({ error: 'Account locked. Try later.' });
    }
    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) {
      const attempts = (user.failed_attempts || 0) + 1;
      let locked_until = null;
      if (attempts >= 5) {
        locked_until = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      }
      await run(`UPDATE users SET failed_attempts=?, locked_until=? WHERE id=?`, [attempts, locked_until, user.id]);
      await run(`INSERT INTO audit_logs (action, details, user_id, action_type, table_name, old_values, new_values) VALUES (?,?,?,?,?,?,?)`, [
        'AUTH_FAIL', `Password mismatch (attempts=${attempts})`, user.id, 'AUTH', 'users',
        JSON.stringify({ failed_attempts: user.failed_attempts, locked_until: user.locked_until }),
        JSON.stringify({ failed_attempts: attempts, locked_until })
      ]);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    await run(`UPDATE users SET failed_attempts=0, locked_until=NULL WHERE id=?`, [user.id]);
    const token = signToken(user);
    const refresh = createRefreshToken();
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    await run(`INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?,?,?)`, [user.id, refresh, expires]);
    await run(`INSERT INTO audit_logs (action, details, user_id) VALUES (?,?,?)`, ['LOGIN', `User ${user.username} logged in`, user.id]);
    res.json({ token, role: user.role, username: user.username, refreshToken: refresh });
  } catch (e) {
    console.error('Login flow error:', e);
    await run(`INSERT INTO audit_logs (action, details, action_type, table_name) VALUES (?,?,?,?)`, ['AUTH_FAIL', `Exception: ${e.message}`, 'AUTH', 'users']);
    res.status(500).json({ error: 'Server error during authentication' });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'Missing refreshToken' });
  const row = await get(`SELECT rt.*, u.username, u.role FROM refresh_tokens rt JOIN users u ON rt.user_id=u.id WHERE rt.token=?`, [refreshToken]);
  if (!row) return res.status(401).json({ error: 'Invalid refreshToken' });
  if (new Date(row.expires_at) < new Date()) return res.status(401).json({ error: 'Refresh token expired' });
  const user = { id: row.user_id, username: row.username, role: row.role };
  const token = signToken(user);
  res.json({ token });
};

export const logout = async (req, res) => {
  await run(`DELETE FROM refresh_tokens WHERE user_id=?`, [req.user.id]);
  res.json({ success: true });
};

export const requestReset = async (req, res) => {
  const { username } = req.body || {};
  const user = await get(`SELECT * FROM users WHERE username=?`, [username]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const token = createRefreshToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await run(`INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?,?,?)`, [user.id, token, expires]);
  console.log(`[RESET] Token for ${username}: ${token}`);
  res.json({ success: true });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body || {};
  const row = await get(`SELECT * FROM password_reset_tokens WHERE token=? AND used=0`, [token]);
  if (!row) return res.status(400).json({ error: 'Invalid token' });
  if (new Date(row.expires_at) < new Date()) return res.status(400).json({ error: 'Token expired' });
  const hash = bcrypt.hashSync(newPassword, 12);
  await run(`UPDATE users SET password_hash=? WHERE id=?`, [hash, row.user_id]);
  await run(`UPDATE password_reset_tokens SET used=1 WHERE id=?`, [row.id]);
  res.json({ success: true });
};
