const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/projects/user
 * @desc    Fetch projects for the logged in client
 * @access  Private
 */
router.get('/user', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    console.error('Fetch user projects error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching user projects' });
  }
});

/**
 * @route   GET /api/projects/admin
 * @desc    Fetch all projects in the queue for the admin panel
 * @access  Private (Admin only)
 */
router.get('/admin', verifyToken, async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
    }

    const projects = await Project.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    console.error('Fetch admin projects error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching admin projects' });
  }
});

/**
 * @route   GET /api/projects/admin/stats
 * @desc    Get dashboard stats for admin
 * @access  Private (Admin only)
 */
router.get('/admin/stats', verifyToken, async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
    }

    const totalProjects = await Project.countDocuments({});
    const activeProjects = await Project.countDocuments({ stage: { $ne: 'Completed' } });
    const registeredClients = await User.countDocuments({ role: 'user' });

    res.json({
      success: true,
      stats: {
        totalProjects,
        activeProjects,
        registeredClients,
        avgDeliverySpeed: '14.2d'
      }
    });
  } catch (err) {
    console.error('Fetch admin stats error:', err);
    res.status(500).json({ success: false, message: 'Server error fetching admin stats' });
  }
});

/**
 * @route   POST /api/projects
 * @desc    Create/book a new project request
 * @access  Private
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { projectName, stack, budget } = req.body;
    if (!projectName || !stack || !budget) {
      return res.status(400).json({ success: false, message: 'Project name, stack, and budget are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Assign dynamic theme color based on stack configuration
    let color = 'var(--primary)'; // Sage Mint
    const lowerStack = stack.toLowerCase();
    if (lowerStack.includes('django')) color = 'var(--primary)';
    else if (lowerStack.includes('spring')) color = '#fbbf24'; // Warm Amber
    else if (lowerStack.includes('mern') || lowerStack.includes('express')) color = '#818cf8'; // Violet
    else if (lowerStack.includes('next.js') || lowerStack.includes('postgres')) color = '#93c5fd'; // Soft Blue

    const project = await Project.create({
      projectName,
      clientName: user.name,
      userId: user._id,
      stack,
      budget,
      stage: 'Submit',
      color,
      depositPaid: false,
      finalPaid: false
    });

    res.status(201).json({ success: true, message: 'Project booked successfully!', project });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ success: false, message: 'Server error creating project booking' });
  }
});

/**
 * @route   PUT /api/projects/admin/:id
 * @desc    Update project tracking stage and payment status
 * @access  Private (Admin only)
 */
router.put('/admin/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required' });
    }

    const { stage, depositPaid, finalPaid, budget } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (stage !== undefined) project.stage = stage;
    if (depositPaid !== undefined) project.depositPaid = depositPaid;
    if (finalPaid !== undefined) project.finalPaid = finalPaid;
    if (budget !== undefined) project.budget = budget;

    await project.save();

    res.json({ success: true, message: 'Project updated successfully!', project });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ success: false, message: 'Server error updating project details' });
  }
});

module.exports = router;
