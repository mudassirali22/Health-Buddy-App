import Reminder from '../models/Reminder.js';

// @desc    Add a new medicine reminder
// @route   POST /reminders
// @access  Private
export const addReminder = async (req, res) => {
  try {
    const { name, time, frequency, familyMember, dosage, instructions } = req.body;

    const reminder = await Reminder.create({
      user: req.user.id,
      familyMember: familyMember === 'null' || !familyMember ? null : familyMember,
      name,
      time,
      frequency,
      dosage: dosage || '',
      instructions: instructions || ''
    });

    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reminders for a user or family member
// @route   GET /reminders
// @access  Private
export const getReminders = async (req, res) => {
  try {
    const { familyMember } = req.query;
    let query = { user: req.user.id };

    if (familyMember === 'null') {
      query.familyMember = null;
    } else if (familyMember && familyMember !== 'all') {
      query.familyMember = familyMember;
    }

    const reminders = await Reminder.find(query).sort({ time: 1 });

    res.status(200).json({
      success: true,
      data: reminders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a reminder
// @route   PUT /reminders/:id
// @access  Private
export const updateReminder = async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a reminder
// @route   DELETE /reminders/:id
// @access  Private
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ success: false, message: 'Reminder not found' });
    }

    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await reminder.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reminder deleted'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
