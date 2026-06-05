const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');

// ==========================================
// ⚙️ EDIT ADMIN EMAILS & PASSWORDS HERE (Exactly 4 Admins)
// ==========================================
const seedAdmins = [
  {
    name: 'Primary Admin',
    email: 'admin@devqueue.studio',
    password: 'SuperSecureAdminPass123!',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'Secondary Admin',
    email: 'admin2@devqueue.studio',
    password: 'SuperSecureAdminPass123!',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'Technical Admin',
    email: 'admin3@devqueue.studio',
    password: 'SuperSecureAdminPass123!',
    role: 'admin',
    isEmailVerified: true
  },
  {
    name: 'Lead Auditor Admin',
    email: 'admin4@devqueue.studio',
    password: 'SuperSecureAdminPass123!',
    role: 'admin',
    isEmailVerified: true
  }
];

// ==========================================
// 👤 EDIT CLIENTS HERE
// ==========================================
const seedClients = [
  {
    name: 'Aryan Mehta',
    email: 'user@devqueue.studio',
    password: 'SuperSecureUserPass123!',
    role: 'user',
    isEmailVerified: true,
    phone: '+91 98765 43210'
  },
  {
    name: 'Moksh Shah',
    email: 'pending@devqueue.studio',
    password: 'SuperSecurePendingPass123!',
    role: 'user',
    isEmailVerified: false,
    phone: '+91 99999 88888',
    emailVerificationOTP: '123456',
    emailVerificationOTPExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
];

// ==========================================
// 📋 EDIT SEED PROJECTS HERE
// ==========================================
const seedProjects = [
  {
    projectName: 'EcomX Analytics',
    clientName: 'Aryan Mehta',
    stack: 'React + Node.js + PostgreSQL',
    budget: '$4,200',
    stage: 'Building',
    color: '#818cf8',
    depositPaid: true,
    finalPaid: false
  },
  {
    projectName: 'Finlytics Pro',
    clientName: 'Aryan Mehta',
    stack: 'Next.js + FastAPI + Postgres',
    budget: '$3,800',
    stage: 'Submit',
    color: '#93c5fd',
    depositPaid: false,
    finalPaid: false
  },
  {
    projectName: 'MedTrack System',
    clientName: 'Aryan Mehta',
    stack: 'Django + Postgres',
    budget: '$2,500',
    stage: 'Completed',
    color: '#6ee7b7',
    depositPaid: true,
    finalPaid: true
  }
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MONGODB...');
    await mongoose.connect(uri);
    console.log('Connected to database. Cleaning old auth and project seeds...');

    // Clear old data
    const allEmails = [...seedAdmins, ...seedClients].map(u => u.email.toLowerCase());
    await User.deleteMany({ email: { $in: allEmails } });
    await Project.deleteMany({});

    // Create Admins
    for (const admin of seedAdmins) {
      await User.create(admin);
      console.log(`✅ Seeded Admin: ${admin.name} (${admin.email})`);
    }

    // Create Clients
    let mainClientUser = null;
    for (const client of seedClients) {
      const created = await User.create(client);
      console.log(`✅ Seeded Client: ${client.name} (${client.email})`);
      if (client.email === 'user@devqueue.studio') {
        mainClientUser = created;
      }
    }

    // Create Projects associated with Aryan Mehta
    if (mainClientUser) {
      for (const proj of seedProjects) {
        await Project.create({
          ...proj,
          userId: mainClientUser._id
        });
        console.log(`✅ Seeded Project: "${proj.projectName}" for ${proj.clientName}`);
      }
    }

    console.log('\n🎉 Auth credentials and dynamic dashboard project seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database seeding failed:', err.stack);
    process.exit(1);
  }
}

seedDatabase();
