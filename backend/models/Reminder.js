import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  familyMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FamilyMember',
    default: null // null means the primary user
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String, // format "HH:mm"
    required: true
  },
  frequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Twice a day', 'As needed'],
    default: 'Daily'
  },
  dosage: {
    type: String,
    trim: true,
    default: ''
  },
  instructions: {
    type: String,
    trim: true,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Reminder', reminderSchema);
