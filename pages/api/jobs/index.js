import dbConnect from '../../../lib/dbConnect';
import Job from '../../../models/Job';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const {
        status,
        keyword,
        department,
        location,
        owner,
        datePosted,
        page = 1,
        limit = 6,
        sort = 'createdAt_desc'
      } = req.query;

      const query = {};

      // Status filter
      if (status) query.status = status;

      // Keyword search in title, company, location
      if (keyword) {
        const rx = new RegExp(keyword, 'i');
        query.$or = [{ title: rx }, { company: rx }, { location: rx }];
      }

      // Department filter
      if (department) query.department = department;

      // Location filter
      if (location) query.location = location;

      // Owner filter
      if (owner) query.owner = owner;

      // Date Posted filter
      if (datePosted) {
        const now = new Date();
        let startDate;
        if (datePosted === '24h') {
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        } else if (datePosted === '7d') {
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (datePosted === '30d') {
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        if (startDate) query.createdAt = { $gte: startDate };
      }

      // Sorting
      const sortOptions = {};
      if (sort === 'createdAt_desc') {
        sortOptions.createdAt = -1;
      } else if (sort === 'createdAt_asc') {
        sortOptions.createdAt = 1;
      } else {
        sortOptions[sort] = 1;
      }

      // Pagination
      const skip = (Number(page) - 1) * Number(limit);

      const jobs = await Job.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      const total = await Job.countDocuments(query);

      return res.status(200).json({
        jobs,
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }

  if (req.method === 'POST') {
    try {
      const job = await Job.create(req.body);
      return res.status(201).json(job);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
