import dbConnect from '../../../lib/dbConnect';
import Job from '../../../models/Job';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { status, keyword, page = 1, limit = 6, sort = '-createdAt' } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (keyword) {
        const rx = new RegExp(keyword, 'i');
        filters.$or = [{ title: rx }, { company: rx }, { location: rx }];
      }

      const total = await Job.countDocuments(filters);
      const jobs = await Job.find(filters)
        .sort(String(sort))
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean();

      return res.status(200).json({ jobs, total, page: Number(page), limit: Number(limit) });
    } catch (e) {
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const job = await Job.create(req.body);
      return res.status(201).json(job);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid job payload' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}
