# POS System ER Diagram (3NF)

Entities:
- users(id, username, password_hash, role, failed_attempts, locked_until, created_at)
- products(id, name, price, barcode, category, image, stock, isDeleted, created_at, updated_at)
- sales(id, date, subtotal, tax, total, amount_paid, change, payment_method, cashier_id, created_at)
- sale_items(id, sale_id, product_id, name, price, quantity)
- audit_logs(id, timestamp, action, details, user_id, table_name, action_type, old_values, new_values)
- refresh_tokens(id, user_id, token, expires_at, created_at)
- password_reset_tokens(id, user_id, token, expires_at, used, created_at)

Relationships:
- users 1—N sales (cashier_id → users.id)
- sales 1—N sale_items (sale_items.sale_id → sales.id)
- products 1—N sale_items (sale_items.product_id → products.id)
- users 1—N audit_logs (audit_logs.user_id → users.id)
- users 1—N refresh_tokens (refresh_tokens.user_id → users.id)
- users 1—N password_reset_tokens (password_reset_tokens.user_id → users.id)

Indexes:
- UNIQUE users.username
- UNIQUE products.barcode
- Foreign key lookups: sale_items.sale_id, sale_items.product_id, audit_logs.user_id, refresh_tokens.user_id, password_reset_tokens.user_id

Constraints:
- CHECK users.role in {owner, cashier}
- Non-negative inventory enforced at application level with transaction checks

