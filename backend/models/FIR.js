const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const firSchema = new mongoose.Schema({
  firNumber: {
    type: String,
    required: true,
    unique: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  clientEmail: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Theft', 'Assault', 'Fraud', 'Cybercrime', 'Missing Person', 'Other'],
    required: true
  },
  inspectorName: {
    type: String,
    default: 'Not Assigned'
  },
  inspectorBadge: {
    type: String,
    default: 'N/A'
  },
  status: {
    type: String,
    enum: ['Filed', 'Under Investigation', 'Documents Review', 'Action Taken', 'Closed'],
    default: 'Filed'
  },
  documentsRequired: [{
    name: String,
    signed: {
      type: Boolean,
      default: false
    }
  }],
  isClosed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  statusHistory: [statusHistorySchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on every save
firSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('FIR', firSchema);
