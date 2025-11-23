import Vital from '../models/Vital.js';

export const addVital = async (req, res) => {
  try {
    const { date, bloodPressure, bloodSugar, weight, temperature, heartRate, notes } = req.body;
    // Create vitals in database
    const vital = await Vital.create({
      user: req.user._id,
      date,
      bloodPressure,
      bloodSugar,
      weight,
      temperature,
      heartRate,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Vital signs added successfully',
      data: vital
    });
  } catch (error) {
    console.error('Add vital error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add vital signs',
      error: error.message
    });
  }
};

// Get all vitals for logged-in user
export const getVitals = async (req, res) => {
  try {
    const vitals = await Vital.find({ user: req.user._id })
      .sort({ date: -1 });

    res.json({
      success: true,
      count: vitals.length,
      data: vitals
    });
  } catch (error) {
    console.error('Get vitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vitals',
      error: error.message
    });
  }
};

// Get single vital
export const getVital = async (req, res) => {
  try {
    const vital = await Vital.findById(req.params.id);

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found'
      });
    }

    // Check if vital belongs to user
    if (vital.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this vital record'
      });
    }

    res.json({
      success: true,
      data: vital
    });
  } catch (error) {
    console.error('Get vital error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vital',
      error: error.message
    });
  }
};

// Update vital signs
export const updateVital = async (req, res) => {
  try {
    let vital = await Vital.findById(req.params.id);

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found'
      });
    }

    // Check if vital belongs to user
    if (vital.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this vital record'
      });
    }

    vital = await Vital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Vital signs updated successfully',
      data: vital
    });
  } catch (error) {
    console.error('Update vital error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vital signs',
      error: error.message
    });
  }
};

//Delete vital signs
export const deleteVital = async (req, res) => {
  try {
    const vital = await Vital.findById(req.params.id);

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found'
      });
    }

    // Check if vital belongs to user
    if (vital.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this vital record'
      });
    }

    await Vital.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Vital record deleted successfully'
    });
  } catch (error) {
    console.error('Delete vital error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vital record',
      error: error.message
    });
  }
};