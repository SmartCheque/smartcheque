import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
} from "sequelize";

interface RoleAttributes {
  id: number;
  name: string;
}

// Some attributes are optional in `File.build` and `File.create` calls
interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> { }

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

const initRole = (sequelize: Sequelize) => {
  Role.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128)
    }
  }, {
      tableName: "role",
      sequelize, // passing the `sequelize` instance is required
    })

  return Role;
}
export type { Role, RoleAttributes }

export { initRole }
