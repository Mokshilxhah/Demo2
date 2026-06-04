const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('Connecting to database...');
    await mongoose.connect(uri);
    console.log('Connected successfully. Checking for existing admin...');

    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log(`Admin user already exists with email: ${existing.email}`);
      process.exit(0);
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@devqueue.studio';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SuperSecureAdminPass123!';

    console.log(`Seeding admin user: ${adminEmail}`);
    await User.create({
      name: 'DevQueue Admin',
      email: adminEmail,
      password: adminPassword, // Will hash automatically
      role: 'admin',
      isEmailVerified: true
    });

    console.log('✅ Admin seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin:', err.message);
    process.exit(1);
  }
}

seedAdmin();
