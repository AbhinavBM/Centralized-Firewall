

// seeders/2023112302_seed_test_data.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('users', [
        { username: 'john', password: 'hashedpassword1', email: 'john@example.com', createdAt: new Date(), updatedAt: new Date() },
        { username: 'jane', password: 'hashedpassword2', email: 'jane@example.com', createdAt: new Date(), updatedAt: new Date() },
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('users', null, {});
    }
  };
  