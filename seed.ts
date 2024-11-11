import mongoose from 'mongoose';
import { userSeeder } from './src/seeders/userSeeder';
import { postSeeder } from './src/seeders/postSeeder';
import { commentSeeder } from './src/seeders/commentSeeder';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    // Run each seeder
    console.log('Seeding Users...');
    await userSeeder();

    console.log('Seeding Posts...');
    await postSeeder();

    console.log('Seeding Comments...');
    await commentSeeder();

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedDatabase();
