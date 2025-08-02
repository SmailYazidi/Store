-- This script shows how to generate the admin password hash
-- Run this in Node.js to generate the hash for your environment variable

-- Example Node.js script to generate password hash:
/*
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'your-admin-password-here';
  const hash = await bcrypt.hash(password, 12);
  console.log('ADMIN_PASSWORD_HASH=' + hash);
}

generateHash();
*/

-- Add this to your .env file:
-- ADMIN_PASSWORD_HASH=your-generated-hash-here
-- JWT_SECRET=your-jwt-secret-here
