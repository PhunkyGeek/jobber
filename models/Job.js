const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, default: "" },
  status: { type: String, enum: ['Draft', 'Published', 'Closed', 'Deactivated'], default: 'Draft' },
  active: { type: Boolean, default: true },
  owner: { type: String, required: false }, // could later reference User
  jobType: { type: String, enum: ['Remote', 'Hybrid', 'On-Site'], default: 'Remote' }
}, { timestamps: true });

module.exports = mongoose.models.Job || mongoose.model('Job', JobSchema);
