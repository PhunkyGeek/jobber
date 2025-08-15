import dbConnect from '../../../lib/dbConnect';
import Job from '../../../models/Job';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (!mongoose.isValidObjectId(String(id))) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (req.method === 'GET') {
    const job = await Job.findById(id).lean();
    if (!job) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(job);
  }

  if (req.method === 'PUT') {
    try {
      const updated = await Job.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json(updated);
    } catch {
      return res.status(400).json({ error: 'Update failed' });
    }
  }

  if (req.method === 'DELETE') {
    await Job.findByIdAndDelete(id);
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}
