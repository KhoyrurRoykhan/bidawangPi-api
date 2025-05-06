import { Sequelize } from "sequelize";

const db = new Sequelize('apl-walk-thru','root','123',{
    host: 'localhost',
    dialect: 'mysql'
});

export default db;