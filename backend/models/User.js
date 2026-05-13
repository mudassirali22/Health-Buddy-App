import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Generate unique MR Number
const generateMRNumber = () => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `HB-${num}`;
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  mrNumber: {
    type: String,
    unique: true,
    default: generateMRNumber
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say',''],
    default: ''
  },
  bloodGroup: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resetPasswordAttempts: {
    type: Number,
    default: 0
  },
  lastResetAttempt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure MR Number uniqueness on save
userSchema.pre('save', async function (next) {
  // Generate unique MR if not set or on new doc
  if (this.isNew && !this.mrNumber) {
    let unique = false;
    while (!unique) {
      const mr = generateMRNumber();
      const existing = await mongoose.model('User').findOne({ mrNumber: mr });
      if (!existing) {
        this.mrNumber = mr;
        unique = true;
      }
    }
  }
  
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate reset token with rate limiting
userSchema.methods.getResetPasswordToken = function () {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  
  if (this.lastResetAttempt && this.lastResetAttempt > oneHourAgo && this.resetPasswordAttempts >= 5) {
    throw new Error('Too many reset attempts. Please try again in an hour.');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
  // Update reset attempts
  this.resetPasswordAttempts += 1;
  this.lastResetAttempt = now;

  return resetToken;
};

// Method to clear reset token
userSchema.methods.clearResetToken = function () {
  this.resetPasswordToken = undefined;
  this.resetPasswordExpire = undefined;
  this.resetPasswordAttempts = 0;
  this.lastResetAttempt = undefined;
};

export default mongoose.model('User', userSchema);