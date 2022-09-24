import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
} from "sequelize";

// These are all the attributes in the Contract model
interface ContractAttributes {
  id: number,
  chainId: number,
  address: string,
  hash: string,
  name: string,
}

// Some attributes are optional in `Contract.build` and `Contract.create` calls
interface ContractCreationAttributes extends Optional<ContractAttributes, "id"> { }

class Contract extends Model<ContractAttributes, ContractCreationAttributes>
  implements ContractAttributes {
  public id!: number
  public chainId!: number
  public address!: string
  public hash!: string
  public name!: string
  public readonly createdAt!: Date;
}

const initContract = (sequelize: Sequelize) => {
  Contract.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chainId: {
        type: DataTypes.INTEGER,
      },
      address: {
        type: DataTypes.STRING(),
      },
      hash: {
        type: DataTypes.STRING(),
      },
      name: {
        type: DataTypes.STRING(),
      }
    }, {
      tableName: "contract",
      sequelize, // passing the `sequelize` instance is required
    }
  )
  return Contract
}

export type {
  ContractAttributes
}

export { initContract, Contract }
