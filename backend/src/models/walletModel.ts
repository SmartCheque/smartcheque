import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
} from "sequelize";

// These are all the attributes in the Wallet model
interface WalletAttributes {
  id: number,
  address: string,
  lastFunding: Date,
}

// Some attributes are optional in `Wallet.build` and `Wallet.create` calls
interface WalletCreationAttributes extends Optional<WalletAttributes, "id" | "lastFunding"> { }

class Wallet extends Model<WalletAttributes, WalletCreationAttributes>
  implements WalletAttributes {
  public id!: number
  public address!: string
  public lastFunding!: Date
}

const initWallet = (sequelize: Sequelize) => {
  Wallet.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      address: {
        type: DataTypes.STRING(),
      },
      lastFunding: {
        type: DataTypes.DATE(),
      }
    }, {
      tableName: "wallet",
      sequelize, // passing the `sequelize` instance is required
    }
  )
  return Wallet
}

export type {
  WalletAttributes
}

export { initWallet, Wallet }
