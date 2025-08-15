import dbConnect from '../../../../lib/dbConnect';
import Job from '../../../../models/Job';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (!mongoose.isValidObjectId(String(id))) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (req.method === 'PATCH') {
    const { action } = req.body || {};
    const update = {};
    if (action === 'publish') update.status = 'Published';
    else if (action === 'draft') update.status = 'Draft';
    else if (action === 'deactivate') update.active = false;
    else if (action === 'activate') update.active = true;
    else return res.status(400).json({ error: 'Invalid action' });

    const job = await Job.findByIdAndUpdate(id, update, { new: true });
    if (!job) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(job);
  }

  res.setHeader('Allow', ['PATCH']);
  res.status(405).end();
}
