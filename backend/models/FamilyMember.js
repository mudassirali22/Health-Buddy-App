import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Generate unique MR Number for family members
const generateFamilyMRNumber = () => {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `HB-${num}`;
};

// Generate a random 8-char password
const generateRandomPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const familyMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  relation: {
    type: String,
    required: [true, 'Relation is required'],
    enum: ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Sibling', 'Brother', 'Sister', 'Wife', 'Husband', 'Uncle', 'Aunt', 'Cousin', 'Guardian', 'Grandparent', 'Other'],
    default: 'Other'
  },
  age: {
    type: Number,
    default: null
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
    default: ''
  },
  bloodGroup: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  mrNumber: {
    type: String,
    unique: true,
    default: generateFamilyMRNumber
  },
  // Store the plain password for display to the primary user
  plainPassword: {
    type: String,
    default: generateRandomPassword
  },
  // Hashed version for login
  password: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
familyMemberSchema.pre('save', async function (next) {
  // Generate unique MR if new
  if (this.isNew && !this.mrNumber) {
    let unique = false;
    while (!unique) {
      const mr = generateFamilyMRNumber();
      const existing = await mongoose.model('FamilyMember').findOne({ mrNumber: mr });
      if (!existing) {
        this.mrNumber = mr;
        unique = true;
      }
    }
  }

  // Auto-generate and hash password for new family members
  if (this.isNew) {
    if (!this.plainPassword) {
      this.plainPassword = generateRandomPassword();
    }
    this.password = await bcrypt.hash(this.plainPassword, 12);
  }

  next();
});

familyMemberSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('FamilyMember', familyMemberSchema);
