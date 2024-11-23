// migrations/2023112302_add_foreign_keys.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('posts', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  // Table name in the database
          key: 'id',       // Primary key in the referenced table
        },
        onUpdate: 'CASCADE', // On update action
        onDelete: 'SET NULL', // On delete action
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('posts', 'userId');
    }
  };
  