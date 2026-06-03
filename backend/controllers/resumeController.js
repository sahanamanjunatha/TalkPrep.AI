const ResumeAnalysis = require('../models/ResumeAnalysis');
const Analytics = require('../models/Analytics');

/**
 * @desc    Upload resume (simulated) and analyze ATS score
 * @route   POST /api/resumes/analyze
 * @access  Private
 */
const uploadResumeAndAnalyze = async (req, res, next) => {
  try {
    const { fileName, fileSize } = req.body;

    if (!fileName) {
      return res.status(400).json({ success: false, message: 'Please provide a file name' });
    }

    // Set a realistic ATS Score (e.g. 65 - 95 based on keyword matching)
    // We mock the ATS evaluation: if the file name contains buzzwords, increase the score
    const nameLower = fileName.toLowerCase();
    let score = 72;
    let matched = ['React', 'JavaScript', 'Node.js', 'Git', 'HTML5', 'CSS3'];
    let missing = ['Docker', 'AWS Cloud', 'TypeScript', 'CI/CD Pipelines', 'Redis'];
    let formatting = [
      'Font hierarchy is neat and legible.',
      'ATS score can be improved: Keep resume to a single column to ensure parsers do not scramble sections.'
    ];
    let bulletPoints = [
      'Your work bullets start with good action verbs (e.g., Developed, Designed).',
      'Missing numbers: Quantify achievements. Instead of "Responsible for deployment", use "Optimized CI/CD reducing build errors by 22%".'
    ];

    if (nameLower.includes('senior') || nameLower.includes('developer') || nameLower.includes('lead')) {
      score = 86;
      matched.push('AWS Cloud', 'TypeScript', 'Docker');
      missing = ['Redis', 'Microservices', 'GraphQL'];
    }

    if (nameLower.includes('brief') || nameLower.includes('draft')) {
      score = 55;
      formatting.push('Resume length is too short. Try to elaborate on technical projects.');
    }

    const suggestions = [
      `Add more missing keywords: ${missing.slice(0, 3).join(', ')}.`,
      'Convert all resume experience bullets to the STAR format.',
      'Avoid placing text in header or footer zones, as some ATS scanners ignore them.'
    ];

    // Create Resume record
    const resumeAnalysis = await ResumeAnalysis.create({
      user: req.user.id,
      fileName,
      fileSize: fileSize || 1024 * 128, // Default 128KB
      score,
      matchedKeywords: matched,
      missingKeywords: missing,
      atsSuggestions: suggestions,
      formattingFeedback: formatting,
      bulletPointsFeedback: bulletPoints,
      roleCompatibility: [
        { role: 'Frontend Engineer', compatibilityPercentage: score },
        { role: 'Fullstack Engineer', compatibilityPercentage: Math.max(50, score - 8) },
        { role: 'Backend Engineer', compatibilityPercentage: Math.max(40, score - 15) }
      ]
    });

    // Update Analytics: unlocked badge for resume analyzer
    const analytics = await Analytics.findOne({ user: req.user.id });
    if (analytics) {
      const alreadyHasBadge = analytics.badges.some(b => b.title === 'ATS Ready');
      if (!alreadyHasBadge) {
        analytics.badges.push({
          title: 'ATS Ready',
          description: 'Uploaded and analyzed your first resume for ATS compatibility.',
          icon: 'FileText'
        });
        await analytics.save();
      }
    }

    res.status(201).json({
      success: true,
      analysis: resumeAnalysis
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's past resume analysis records
 * @route   GET /api/resumes
 * @access  Private
 */
const getResumes = async (req, res, next) => {
  try {
    const resumes = await ResumeAnalysis.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadResumeAndAnalyze,
  getResumes
};
