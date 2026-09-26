const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trainer = require('./models/Trainer');

dotenv.config();

const seedTrainers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Trainer.deleteMany({});

    const trainers = [
      {
        name: 'Alex Rivers',
        specialty: 'Bodybuilding & Strength',
        bio: '10+ years of experience in professional bodybuilding. Specializes in hypertrophy and powerlifting.',
        experience: 12,
        profileImage: 'https://images.unsplash.com/photo-1567013350978-8ed9edc973a6?w=400',
        availability: [
          { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          { day: 'Friday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
        ]
      },
      {
        name: 'Sarah Jenkins',
        specialty: 'Yoga & Flexibility',
        bio: 'Certified Yoga instructor focusing on mindfulness, flexibility, and core strength.',
        experience: 8,
        profileImage: 'https://images.unsplash.com/photo-1518611015978-24c60adbb77b?w=400',
        availability: [
          { day: 'Tuesday', slots: ['08:00', '09:00', '10:00', '16:00', '17:00'] },
          { day: 'Thursday', slots: ['08:00', '09:00', '10:00', '16:00', '17:00'] },
          { day: 'Saturday', slots: ['08:00', '09:00', '10:00', '16:00', '17:00'] },
        ]
      },
      {
        name: 'Mike Thorne',
        specialty: 'Weight Loss & HIIT',
        bio: 'Expert in high-intensity interval training and sustainable weight loss strategies.',
        experience: 6,
        profileImage: 'https://images.unsplash.com/photo-1534438327276-14e5c6ed86df?w=400',
        availability: [
          { day: 'Monday', slots: ['12:00', '13:00', '16:00', '17:00', '18:00'] },
          { day: 'Tuesday', slots: ['12:00', '13:00', '16:00', '17:00', '18:00'] },
          { day: 'Thursday', slots: ['12:00', '13:00', '16:00', '17:00', '18:00'] },
        ]
      },
    ];

    await Trainer.insertMany(trainers);
    console.log('Trainers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedTrainers();
