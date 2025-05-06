import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Users = db.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nisn: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  progres_belajar: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  progres_tantangan: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  token_kelas: {
    type: DataTypes.STRING
  },
  refresh_token: {
    type: DataTypes.TEXT
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default Users;

(async () => {
  await db.sync();
})();
