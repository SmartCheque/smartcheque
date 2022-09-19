import { Dialect } from 'sequelize'

const dbConfig = {
  HOST: "localhost",
  PORT: 5433,
  USER: "nfteverywhere",
  PASSWORD: "7ujfH0HR6ESi72Ob",
  DB: "nfteverywhere",
  dialect: "postgres" as Dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

export default dbConfig
