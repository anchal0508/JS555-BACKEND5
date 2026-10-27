'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.expenses, {
          foreignKey: 'userId',
          as: 'expenses',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
      })
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "Please enter a valid email address"}
      },
      unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'USER'
    },
  }, {
    sequelize,
    modelName: 'user',
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const passwordSalt = parseInt(process.env.PASSWORD_SALT) || 10;
          user.password = await bcrypt.hash(user.password, passwordSalt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const passwordSalt = parseInt(process.env.PASSWORD_SALT) || 10;
          user.password = await bcrypt.hash(user.password, passwordSalt);
        }
      }
    }
  });
  return User;
};