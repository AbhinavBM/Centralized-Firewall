// seeders/2023112301_seed_admin_user.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('users', [{
        username: 'admin',
        password: 'hashedpassword123', // Usually the password would be hashed
        email: 'admin@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('users', {
        username: 'admin',
      });
    }
  };
  