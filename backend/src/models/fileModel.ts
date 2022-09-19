import {
  Sequelize,
  Model,
  DataTypes,
  Optional,
} from "sequelize";

// These are all the attributes in the File model
interface FileAttributes {
  id: number,
  fileName: string,
  content: Buffer
}

// Some attributes are optional in `File.build` and `File.create` calls
interface FileCreationAttributes extends Optional<FileAttributes, "id"> { }

class File extends Model<FileAttributes, FileCreationAttributes>
  implements FileAttributes {
  public id!: number
  public fileName!: string
  public content!: Buffer

  public readonly createdAt!: Date
  public readonly updatedAt!: Date

}

const initFile = (sequelize: Sequelize) => {
  File.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fileName: {
        type: DataTypes.STRING(),
      },
      content: {
        type: DataTypes.BLOB(),
      }
    }, {
      tableName: "file",
      sequelize, // passing the `sequelize` instance is required
    }
  )
  return File
}

export type {
  FileAttributes
}

export { initFile, File }
