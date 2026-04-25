import { analyzeJobDescription } from '../services/claudeService.js';
import Analysis from '../models/Analysis.js';

export const analyze = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string') {
      return res.status(400).json({ error: 'Job description is required' });
    }
    if (jobDescription.trim().length < 50) {
      return res.status(400).json({ error: 'Please provide a more detailed job description (minimum 50 characters)' });
    }
    if (jobDescription.trim().length > 5000) {
      return res.status(400).json({ error: 'Job description is too long (maximum 5000 characters)' });
    }

    const result = await analyzeJobDescription(jobDescription.trim());

    // Persist to DB if user is authenticated
    if (req.user) {
      await Analysis.create({
        userId: req.user._id,
        jobDescription: jobDescription.trim(),
        result,
        role: result.role || 'Unknown Role',
        company: result.company || null,
        experienceLevel: result.experience_level || null
      });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Analysis error:', err.message);
    if (err.message?.includes('invalid JSON')) {
      return res.status(502).json({ error: 'AI returned an unexpected response. Please try again.' });
    }
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
};
