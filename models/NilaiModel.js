import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js"; // Import model user

const { DataTypes } = Sequelize;

const Nilai = db.define('nilai_siswa', {
  id_nilai: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  kuis_1: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  kuis_2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  kuis_3: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  kuis_4: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  kuis_5: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  evaluasi: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  }
}, {
  freezeTableName: true,
  timestamps: false
});

// Relasi: satu user punya satu nilai
Users.hasOne(Nilai, { foreignKey: 'id' });
Nilai.belongsTo(Users, { foreignKey: 'id' });

export default Nilai;
