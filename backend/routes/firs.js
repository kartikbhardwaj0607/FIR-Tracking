const express = require('express');
const router = express.Router();
const FIR = require('../models/FIR');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/firs
// @desc    Create new FIR (Client)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Generate unique FIR number
    const count = await FIR.countDocuments();
    const firNumber = `FIR${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;

    const fir = await FIR.create({
      firNumber,
      clientId: req.user._id,
      clientName: req.user.name,
      clientEmail: req.user.email,
      title,
      description,
      category,
      documentsRequired: [
        { name: 'Identity Proof', signed: false },
        { name: 'Address Proof', signed: false },
        { name: 'Incident Report', signed: false }
      ],
      statusHistory: [{
        status: 'Filed',
        description: 'FIR has been filed successfully',
        updatedBy: req.user.name
      }]
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('fir-created', fir);

    res.status(201).json(fir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/firs
// @desc    Get all FIRs (Admin) or user's FIRs (Client)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let firs;
    if (req.user.role === 'admin') {
      firs = await FIR.find().sort({ createdAt: -1 });
    } else {
      firs = await FIR.find({ clientId: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(firs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/firs/:id
// @desc    Get single FIR
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id);

    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }

    // Check if user is authorized
    if (req.user.role !== 'admin' && fir.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(fir);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/firs/:id
// @desc    Update FIR (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id);

    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }

    const { status, inspectorName, inspectorBadge, documentsRequired, isClosed, priority } = req.body;

    // Update fields
    if (status) {
      fir.status = status;
      fir.statusHistory.push({
        status,
        description: `Status updated to ${status}`,
        updatedBy: req.user.name
      });
    }
    if (inspectorName) fir.inspectorName = inspectorName;
    if (inspectorBadge) fir.inspectorBadge = inspectorBadge;
    if (documentsRequired) fir.documentsRequired = documentsRequired;
    if (typeof isClosed !== 'undefined') fir.isClosed = isClosed;
    if (priority) fir.priority = priority;

    const updatedFIR = await fir.save();

    // Emit socket event for real-time update
    const io = req.app.get('io');
    io.to(`fir-${updatedFIR._id}`).emit('fir-updated', updatedFIR);
    io.emit('fir-list-updated', updatedFIR);

    res.json(updatedFIR);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/firs/:id
// @desc    Delete FIR (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const fir = await FIR.findById(req.params.id);

    if (!fir) {
      return res.status(404).json({ message: 'FIR not found' });
    }

    await fir.deleteOne();
    res.json({ message: 'FIR removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/firs/stats/dashboard
// @desc    Get dashboard statistics (Admin only)
// @access  Private/Admin
router.get('/stats/dashboard', protect, admin, async (req, res) => {
  try {
    const totalFIRs = await FIR.countDocuments();
    const openFIRs = await FIR.countDocuments({ isClosed: false });
    const closedFIRs = await FIR.countDocuments({ isClosed: true });
    const underInvestigation = await FIR.countDocuments({ status: 'Under Investigation' });

    res.json({
      totalFIRs,
      openFIRs,
      closedFIRs,
      underInvestigation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
