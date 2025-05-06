import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import crypto from "crypto";

const { DataTypes } = Sequelize;

// Fungsi buat generate token 8 karakter
const generateToken = () => {
  return crypto.randomBytes(4).toString('hex'); // 4 bytes = 8 karakter hex
};

const Guru = db.define('guru', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false
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
  instansi: {
    type: DataTypes.STRING,
    allowNull: true
  },
  token: {
    type: DataTypes.STRING(8),
    allowNull: false,
    unique: true,
    defaultValue: generateToken
  },
  kkm: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 70 // kamu bisa sesuaikan nilai default sesuai kebijakan
  },
  refresh_token: {
    type: DataTypes.TEXT
  }
}, {
  freezeTableName: true,
  timestamps: false
});

export default Guru;

(async () => {
  await db.sync();
})();
