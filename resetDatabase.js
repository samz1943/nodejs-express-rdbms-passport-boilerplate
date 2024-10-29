const { sequelize } = require('./src/models');
const { exec } = require('child_process');

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(stderr);
      }
      console.log(stdout);
      resolve();
    });
  });
};

const resetDatabase = async () => {
  try {
    await runCommand('npx sequelize-cli db:drop');
    await runCommand('npx sequelize-cli db:create');
    await runCommand('npx sequelize-cli db:migrate');
    await runCommand('npx sequelize-cli db:seed:all');
    console.log('Database reset complete.');
  } catch (error) {
    console.error('Error resetting the database:', error);
  } finally {
    process.exit(0);
  }
};

resetDatabase();
