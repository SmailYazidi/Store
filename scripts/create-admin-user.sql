-- Create admin user with default credentials
-- Username: admin
-- Password: admin123 (hashed)

INSERT INTO admins (username, email, passwordHash, createdAt, updatedAt) VALUES (
  'admin',
  'admin@store.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXwtGtrKxQ7u', -- admin123
  NOW(),
  NOW()
);
