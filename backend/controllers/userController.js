const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, goal, weight, height, phone, gender, injuries, emergencyContact } = req.body;
    
    if (name) user.name = name;
    if (goal) user.goal = goal;
    if (weight) user.weight = weight;
    if (height) user.height = height;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (injuries) user.injuries = injuries;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
