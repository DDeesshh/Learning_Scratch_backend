import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: false },
  fileUrl: { type: String, required: true },
}, {
  timestamps: true,
});

export default mongoose.model('Application', applicationSchema);
