import bcrypt from 'bcryptjs';
import { run, get, all } from '../config/db.js';

export const getUsers = async (req, res) => {
  const users = await all(`SELECT id, username, role, created_at FROM users ORDER BY id`);
  res.json(users);
};

export const createUser = async (req, res) => {
  const { username, password, role = 'cashier' } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  if (role !== 'cashier') return res.status(400).json({ error: 'Only cashier role allowed' });
  try {
    const hash = bcrypt.hashSync(password, 10);
    await run(`INSERT INTO users (username, password_hash, role) VALUES (?,?,?)`, [username, hash, 'cashier']);
    await run(`INSERT INTO audit_logs (action, details, user_id) VALUES (?,?,?)`, ['CREATE_CASHIER', `Added cashier ${username}`, req.user.id]);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await get(`SELECT * FROM users WHERE id=?`, [id]);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.role === 'owner') return res.status(400).json({ error: 'Cannot delete owner' });
  await run(`DELETE FROM users WHERE id=?`, [id]);
  await run(`INSERT INTO audit_logs (action, details, user_id) VALUES (?,?,?)`, ['DELETE_CASHIER', `Removed cashier ${user.username}`, req.user.id]);
  res.json({ success: true });
};
