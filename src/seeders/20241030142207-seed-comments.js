'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const posts = await queryInterface.sequelize.query(
      'SELECT id FROM Posts;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const comments = Array.from({ length: Math.random() * 30 }).map(() => ({
      content: faker.lorem.sentence(),
      user_id: users[Math.floor(Math.random() * users.length)].id,
      post_id: posts[Math.floor(Math.random() * posts.length)].id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert('Comments', comments, {});
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
