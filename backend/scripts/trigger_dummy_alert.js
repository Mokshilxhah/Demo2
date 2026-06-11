require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const { triggerMilestoneAlerts } = require('../services/alertService');

async function run() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devqueue';
  console.log(`Connecting to MongoDB at: ${mongoUri}`);
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to database.');

    // 1. Create or Find a test client
    let user = await User.findOne({ email: 'john.doe.test@example.com' });
    if (!user) {
      user = await User.create({
        name: 'John Doe (Test Client)',
        email: 'john.doe.test@example.com',
        phone: '+91 98765 43210',
        password: 'Password123!',
        isEmailVerified: true
      });
      console.log(`Created test client: ${user.name}`);
    } else {
      console.log(`Found existing test client: ${user.name}`);
    }

    // 2. Create a dummy project
    const requirementsObj = {
      description: 'An intelligent investment companion for tracking stocks and mutual funds in real-time.',
      tagline: 'AI-Powered Portfolio Companion',
      deadline: '2026-07-15',
      priority: 'Normal',
      deployPlatform: 'AWS',
      needsAi: true
    };

    const project = await Project.create({
      projectName: 'Capital Nest (Mock Booking)',
      clientName: user.name,
      userId: user._id,
      stack: 'Django + React + PostgreSQL',
      budget: '₹1,499', // Flat special offer price
      requirements: JSON.stringify(requirementsObj),
      needsAi: true,
      stage: 'Review',
      userDecision: 'Booked',
      depositPaid: true,
      razorpayOrderId: 'order_test_1499',
      razorpayPaymentId: 'pay_test_1499'
    });
    console.log(`Created mock project: ${project.projectName}`);

    // 3. Trigger alerts (triggers console outputs & SMTP/Twilio integrations)
    console.log('\nTriggering Booked Milestone Alerts...');
    await triggerMilestoneAlerts({
      user,
      project,
      eventName: 'BOOKED',
      customDetails: {
        depositAmount: '375', // 25% of 1499
        queuePosition: 3
      }
    });

    // Clean up mock data so we don't pollute the dev database
    await Project.findByIdAndDelete(project._id);
    await User.findByIdAndDelete(user._id);
    console.log('Successfully cleaned up dummy test data.');

  } catch (err) {
    console.error('Error running test alert script:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
    process.exit(0);
  }
}

run();
