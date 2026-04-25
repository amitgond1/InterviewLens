import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
  jobDescription: { type: String, required: true },
  result: { type: mongoose.Schema.Types.Mixed, required: true },
  role: { type: String, default: 'Unknown Role' },
  company: { type: String, default: null },
  experienceLevel: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

analysisSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Analysis', analysisSchema);
