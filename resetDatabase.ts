import { exec } from 'child_process';
import { promisify } from 'util';

// Promisify the exec function for easier async/await usage
const execPromise = promisify(exec);

// Helper function to run shell commands
const runCommand = async (command: string) => {
  try {
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(stdout);
  } catch (error) {
    console.error(`exec error: ${error}`);
    throw error;
  }
};

// Reset database function
const resetDatabase = async () => {
  try {
    console.log('Starting to reset the database...');

    // Drop, create, migrate, and seed the database
    await runCommand('npx sequelize-cli db:drop');
    console.log('Database dropped.');

    await runCommand('npx sequelize-cli db:create');
    console.log('Database created.');

    await runCommand('npx sequelize-cli db:migrate');
    console.log('Migrations completed.');

    await runCommand('npx sequelize-cli db:seed:all');
    console.log('Seeding completed.');

    console.log('Database reset complete.');
  } catch (error) {
    console.error('Error resetting the database:', error);
  } finally {
    process.exit(0);
  }
};

resetDatabase();
