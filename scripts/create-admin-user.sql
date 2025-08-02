-- Create admin user with hashed password
-- Default password: "admin123" (change this in production!)

-- First, create the adminPasswords collection with a default admin user
db.adminPasswords.insertOne({
  username: "admin",
  passwordHash: "$2a$12$LQv3c1yqBwEHxv6HVVfvNOjSHzIVHk4kGN2N8D4.vyHGTBDCaO8u2", // bcrypt hash for "admin123"
  createdAt: new Date(),
  updatedAt: new Date()
});

-- Create indexes for better performance
db.adminPasswords.createIndex({ "username": 1 }, { unique: true });
db.orders.createIndex({ "orderCode": 1 }, { unique: true });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });
db.products.createIndex({ "categoryId": 1 });
db.products.createIndex({ "isVisible": 1 });
db.categories.createIndex({ "name.ar": 1, "name.fr": 1 }, { unique: true });
