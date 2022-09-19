import dbConfig from '../config/dbConfig'

import { Sequelize } from 'sequelize'

import { initRole } from './roleModel'
import { initUser } from './userModel'
import { initFile } from './fileModel'
import { initWallet } from './walletModel'

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    //operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
)

const db = {
  sequelize: sequelize,
  role: initRole(sequelize),
  user: initUser(sequelize),
  file: initFile(sequelize),
  wallet: initWallet(sequelize),
  ROLES: ["user", "admin", "moderator"],
}


db.role.belongsTo(db.role, {
  as: 'role',
  foreignKey: { name: "roleId", allowNull: true },
  onDelete: 'CASCADE',
})
db.user.belongsTo(db.file, {
  as: 'photo',
  foreignKey: { name: "photoId" },
})

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
})
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
})

export default db
