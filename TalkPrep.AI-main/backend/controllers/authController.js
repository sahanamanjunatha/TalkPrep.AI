const User = require('../models/User');
const Analytics = require('../models/Analytics');
const jwt = require('jsonwebtoken');

// Helper to sign JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_encryption_key_change_me_in_production_198273', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, targetRole, experienceLevel } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      targetRole: targetRole || 'Software Engineer',
      experienceLevel: experienceLevel || 'Intermediate',
      skills: []
    });

    // Create initial Analytics registry for user
    await Analytics.create({
      user: user._id,
      streakCount: 1,
      weeklyActivity: [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 0 },
        { day: 'Wed', count: 0 },
        { day: 'Thu', count: 1 }, // Default weekday start for demonstration
        { day: 'Fri', count: 0 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 0 }
      ]
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
        avatar: user.avatar,
        bio: user.bio,
        github: user.github,
        linkedin: user.linkedin
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log in user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Check user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
        avatar: user.avatar,
        bio: user.bio,
        github: user.github,
        linkedin: user.linkedin
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user profile data
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile data
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.targetRole = req.body.targetRole || user.targetRole;
    user.experienceLevel = req.body.experienceLevel || user.experienceLevel;
    if (req.body.avatar !== undefined) {
      user.avatar = req.body.avatar;
    }
    if (req.body.skills) {
      user.skills = req.body.skills;
    }
    if (req.body.bio !== undefined) {
      user.bio = req.body.bio;
    }
    if (req.body.github !== undefined) {
      user.github = req.body.github;
    }
    if (req.body.linkedin !== undefined) {
      user.linkedin = req.body.linkedin;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        targetRole: updatedUser.targetRole,
        experienceLevel: updatedUser.experienceLevel,
        skills: updatedUser.skills,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        github: updatedUser.github,
        linkedin: updatedUser.linkedin
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Simulate Forgot Password functionality
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email' });
    }

    // Create a mock reset token
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes expire

    await user.save();

    res.json({
      success: true,
      message: 'Password reset link simulated. Check instructions below.',
      resetToken: resetToken,
      resetUrl: `http://localhost:5173/auth?resetToken=${resetToken}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword
};
