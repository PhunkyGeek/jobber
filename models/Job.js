const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    department: { type: String, default: '' }, // for filtering
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Published', 'Closed', 'Deactivated'],
      default: 'Draft',
    },
    active: { type: Boolean, default: true },
    owner: { type: String, required: false },
    jobType: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-Site'],
      default: 'Remote',
    },
    applicants: { type: Number, default: 0 },
    evalScore: { type: Number, default: null },
    aiScore: { type: Number, default: null },
    hiredCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Job || mongoose.model('Job', JobSchema);
