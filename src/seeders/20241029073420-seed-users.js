'use strict';

const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const fakeUsers = [];
    for (let i = 0; i < 10; i++) {
      fakeUsers.push({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: await bcrypt.hash(faker.internet.password(), 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('Users', [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('1234', 10),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      ...fakeUsers
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
