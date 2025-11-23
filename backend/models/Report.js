import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  reportType: {
    type: String,
    enum: ["Blood Test","Urine Test","X-Ray Report","MRI Scan","CT Scan","Ultrasound","Blood Pressure","Diabetes Report",
          "Thyroid Test","Liver Function Test","Kidney Function Test", "Vitamin Test","Cholesterol Report","Dental Report","Eye Checkup",
          "Allergy Test","Prescription","Discharge Summary","Surgery Report",
          "Physiotherapy","Vaccination Record","Other"],    
    default: 'Other'
  },
  date: {
    type: Date,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  cloudinaryPublicId: {
    type: String,
    required: true
  },
  aiSummary: {
    english: String,
    abnormalValues: [String],
    questionsForDoctor: [String],
    foodsToAvoid: [String],
    foodsToEat: [String],
    homeRemedies: [String],
    disclaimer: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Report', reportSchema);