require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Repository = require('./models/Repository');
const Issue = require('./models/Issue');
const PullRequest = require('./models/PullRequest');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Repository.deleteMany({});
    await Issue.deleteMany({});
    await PullRequest.deleteMany({});

    // Create a mock user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const mockUser = await User.create({
      username: 'johndoe',
      email: 'john@example.com',
      password: hashedPassword,
      githubUsername: 'john_doe123',
      stats: { issuesCreated: 1, issuesSolved: 1, prsSubmitted: 1 }
    });

    // Create a mock repo
    const mockRepo = await Repository.create({
      name: 'react-cool-components',
      description: 'A collection of awesome React components.',
      owner: mockUser._id,
      stars: 120
    });

    // Create mock issues
    const issue1 = await Issue.create({
      title: 'Fix button hover state',
      description: 'The primary button does not change color on hover in dark mode.',
      status: 'open',
      labels: ['bug', 'ui'],
      author: mockUser._id,
      repository: mockRepo._id
    });

    const issue2 = await Issue.create({
      title: 'Add DatePicker component',
      description: 'We need a DatePicker component for forms.',
      status: 'closed',
      labels: ['feature'],
      author: mockUser._id,
      assignee: mockUser._id,
      repository: mockRepo._id
    });

    // Create mock PR
    await PullRequest.create({
      title: 'Feat: Add DatePicker',
      description: 'Added the new DatePicker component using react-datepicker.',
      status: 'approved',
      issueId: issue2._id,
      author: mockUser._id,
      repository: mockRepo._id
    });

    console.log('Dummy data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
