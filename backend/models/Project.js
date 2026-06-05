const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stack: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    required: true,
    enum: ['Submit', 'Review', 'Planning', 'Building', 'Final Review', 'Completed'],
    default: 'Submit'
  },
  depositPaid: {
    type: Boolean,
    default: false
  },
  finalPaid: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'var(--primary)'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
