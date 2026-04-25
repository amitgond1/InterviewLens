import Analysis from '../models/Analysis.js';

export const getHistory = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [analyses, total] = await Promise.all([
      Analysis.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('role company experienceLevel createdAt result.skills result.dsaQuestions'),
      Analysis.countDocuments({ userId: req.user._id })
    ]);

    res.json({
      success: true,
      data: analyses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    console.error('History error:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

    res.json({ success: true, data: analysis });
  } catch (err) {
    console.error('Get analysis error:', err);
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) return res.status(404).json({ error: 'Analysis not found' });

    res.json({ success: true, message: 'Analysis deleted' });
  } catch (err) {
    console.error('Delete analysis error:', err);
    res.status(500).json({ error: 'Failed to delete analysis' });
  }
};
