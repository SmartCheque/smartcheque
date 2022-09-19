import {
  Sequelize,
  Model,
  DataTypes,
  HasManySetAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Optional,
} from "sequelize";

import { File } from './fileModel'

import { Role } from './roleModel'

// These are all the attributes in the User model
interface UserAttributes {
  id: number,
  email: string,
  password: string,
  photoId?: number,
}

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, "id"> { }

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public password!: string;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getRoles!: HasManyGetAssociationsMixin<Role>; // Note the null assertions!
  public setRoles!: HasManySetAssociationsMixin<Role, number>;
  public addRole!: HasManyAddAssociationMixin<Role, number>;
  public hasRole!: HasManyHasAssociationMixin<Role, number>;

  public photoId!: number

  public getPhoto!: HasOneGetAssociationMixin<File>; // Note the null assertions!
  public setPhoto!: HasOneSetAssociationMixin<File, number>;
}

const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(128)
      },
      password: {
        type: DataTypes.STRING(128)
      }
    }, {
      tableName: "user",
      sequelize, // passing the `sequelize` instance is required
    }
  )

  return User
}

export type {
  UserAttributes
}

export { initUser, User }
