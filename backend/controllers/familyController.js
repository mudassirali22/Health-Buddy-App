import FamilyMember from '../models/FamilyMember.js';
import Vital from '../models/Vital.js';
import Report from '../models/Report.js';
import User from '../models/User.js';
import emailService from '../utils/emailService.js';
import cloudinary from '../config/cloudinary.js';

// Add a family member
export const addFamilyMember = async (req, res) => {
  try {
    const { name, relation, age, gender, bloodGroup, profilePicture } = req.body;

    const familyMember = await FamilyMember.create({
      user: req.user.id,
      name,
      relation,
      age,
      gender,
      bloodGroup,
      profilePicture
    });

    res.status(201).json({
      success: true,
      message: 'Family member added successfully',
      data: familyMember
    });
  } catch (error) {
    console.error('Add family member error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to add family member'
    });
  }
};

// Get all family members for a user
export const getFamilyMembers = async (req, res) => {
  try {
    const familyMembers = await FamilyMember.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: familyMembers
    });
  } catch (error) {
    console.error('Get family members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch family members'
    });
  }
};

// Update family member
export const updateFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;
    // Explicitly exclude sensitive fields
    const { password, plainPassword, mrNumber, _id, user, ...safeBody } = req.body;
    
    const updates = {};
    Object.keys(safeBody).forEach(key => {
      const val = safeBody[key];
      // Skip undefined/null/string "undefined" but allow empty strings if they are not the excluded fields
      if (val !== undefined && val !== null && val !== 'undefined' && val !== 'null') {
        updates[key] = val;
      }
    });

    // Convert age to number if present
    if (updates.age !== undefined && updates.age !== '') {
      updates.age = Number(updates.age);
    }

    const familyMember = await FamilyMember.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    res.json({
      success: true,
      message: 'Family member updated successfully',
      data: familyMember
    });
  } catch (error) {
    console.error('Update family member error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update family member'
    });
  }
};

// Delete family member
export const deleteFamilyMember = async (req, res) => {
  try {
    const { id } = req.params;

    const familyMember = await FamilyMember.findOneAndDelete({ _id: id, user: req.user.id });

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    // Optional: Delete associated vitals and reports
    await Vital.deleteMany({ familyMember: id });
    await Report.deleteMany({ familyMember: id });

    res.json({
      success: true,
      message: 'Family member and associated data deleted successfully'
    });
  } catch (error) {
    console.error('Delete family member error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete family member'
    });
  }
};

// Send credentials to family member email
export const sendCredentials = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const familyMember = await FamilyMember.findOne({ _id: id, user: req.user.id });

    if (!familyMember) {
      return res.status(404).json({
        success: false,
        message: 'Family member not found'
      });
    }

    const parentUser = await User.findById(req.user.id);

    const success = await emailService.sendFamilyCredentialsEmail(
      email,
      familyMember,
      parentUser.name
    );

    if (success) {
      res.json({
        success: true,
        message: `Credentials sent successfully to ${email}`
      });
    } else {
      throw new Error('Email service failed');
    }
  } catch (error) {
    console.error('Send credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send credentials email'
    });
  }
};
