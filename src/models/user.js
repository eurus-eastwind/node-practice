'use strict';
const {
  Model
} = require('sequelize');
//another way to hide value
const PROTECTED_ATTRIBUTES = ["password", "birth_date"];
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // define association here
      this.belongsTo(User, {
        as: "created",
        foreignKey: "created_by",
      });

      this.belongsTo(User, {
        as: "updated",
        foreignKey: "updated_by",
      });
      this.hasMany(models.Task, {
        as: "user_task",
        foreignKey: "created_by",
      });
    }
    //para di masama yung password sa pag fetch ng data
    // covert to json
    // pwede gamitin sa ibang column na ayaw mong malabas like id
    toJSON(){
      const attributes = {...this.get()};

      for(const a of PROTECTED_ATTRIBUTES){
        delete attributes[a];
      }
      return attributes;
    }
  }
  User.init({
    id: {
      type : DataTypes.UUID,
      primaryKey : true,
      defaultValue : DataTypes.UUIDV4, // Or DataTypes.UUIDV1
    },
    first_name :{
      type : DataTypes.STRING,
      allowNull : false,
      validate :{
        notNull :{ msg: "first name should not be null"},
        notEmpty :{ msg: "first name should not be empty"}
      },
      // to convert into upper case
      get(){
        const rawValue = this.getDataValue("first_name");
        return rawValue ? rawValue.toUpperCase() : null;
      },
    },
    middle_name :{
      type : DataTypes.STRING,
    },
    last_name :{
      type : DataTypes.STRING,
      allowNull : false,
      validate :{
        notNull :{ msg: "last name should not be null"},
        notEmpty :{ msg: "last name should not be empty"}
      },
    },
    full_name :{
      type : DataTypes.STRING,
      set(value){
        this.setDataValue("full_name", 
        this.first_name+ " "+ this.middle_name+ " "+ this.last_name);
      },
    },
    gender :{
      type : DataTypes.STRING,
      allowNull : false,
      validate :{
        isIn :{
          args :[["Male", "Female"]],
          msg : "Gender should be Male or Female",
        },
      },
    },
    civil_status :{
      type : DataTypes.STRING,
      allowNull : false,
    },
    birth_date :{
      type : DataTypes.DATE,
      allowNull : false,
    },
    email :{
      type : DataTypes.STRING,
      allowNull : false,
      validate :{
        isEmail : true,
      },
      unique : "email",
    },
    password :{
      type : DataTypes.STRING,
      allowNull : false,
    },
    status :{
      type : DataTypes.STRING,
      defaultValue : 'Active',
    },
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
    updated_by: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: "id",
      },
    },
  }, {
    sequelize,
    timestamp: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    modelName: 'User',
    // tableName: 'Employees' wede ibahin table name
  });
  return User;
};
