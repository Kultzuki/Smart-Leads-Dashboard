import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import Lead from '../models/lead.model';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, status, source } = req.body;

  try {
    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
      createdBy: req.user?._id,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};

    // Role check
    if (req.user?.role === 'sales') {
      query.createdBy = req.user._id;
    }

    // Query filters
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.source) {
      query.source = req.query.source;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Sorting
    let sortObj: any = { createdAt: -1 }; // latest by default
    if (req.query.sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.status(200).json({
      leads,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    if (req.user?.role === 'sales' && lead.createdBy._id.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to view this lead' });
      return;
    }

    res.status(200).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized to update this lead' });
      return;
    }

    lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(lead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    await lead.deleteOne();

    res.status(200).json({ message: 'Lead removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const exportCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};

    if (req.query.status) query.status = req.query.status;
    if (req.query.source) query.source = req.query.source;
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }
    
    let sortObj: any = { createdAt: -1 };
    if (req.query.sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    const leads = await Lead.find(query).sort(sortObj).populate('createdBy', 'name email').lean();

    const fields = [
      '_id',
      'name',
      'email',
      'status',
      'source',
      'createdBy.name',
      'createdBy.email',
      'createdAt',
      'updatedAt'
    ];
    const opts = { fields };
    
    const parser = new Parser(opts);
    const csv = parser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
