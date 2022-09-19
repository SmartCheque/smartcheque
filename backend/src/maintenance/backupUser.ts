import db from '../models'
const User = db.user
const Role = db.role
const File = db.file
import fs from 'fs'
//import fse from 'fs-extra'
import path from 'path'
import { UserAttributes } from '../models/userModel'
import { RoleAttributes } from '../models/roleModel'
import { FileAttributes } from '../models/fileModel'
import { Op } from 'sequelize'

//const dirUpload = path.join(__dirname, '..', '..', '..', 'upload')
const dirBackup = path.join(__dirname, '..', '..', '..', 'backup')

const getDirExport = (dir: string) => {
  return path.join(dirBackup, dir)
}

const checkDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, 0o700);
  }
}

const list = async () => {
  const userList = await User.findAll()
  const roleList = await Role.findAll()
  const fileList = await File.findAll()
  return { userList, roleList, fileList }
}

const backupUser = async () => {
  const listExport = await list()
  const exportTxt = JSON.stringify(listExport)

  checkDir(dirBackup)
  const dirExport = getDirExport(Date.now().toString())
  checkDir(dirExport)

  fs.writeFileSync(dirExport + '/user.json', exportTxt)


  /*
  const dirExportUpload = path.join(dirExport, "upload")
  checkDir(dirExportUpload)
  fse.copySync(dirUpload, dirExportUpload);
  */
}

const getDirectories = (source: string) => fs.readdirSync(source, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

const backupUserList = async () => {
  const dir = path.join(__dirname, '..', '..', '..', 'backup')
  return getDirectories(dir)
}

const getNewId = (id: number | undefined, newId: Array<{ id: number, newId: number }>) => {
  if (id) {
    const newIdArray = newId.filter((item) => item.id === id)
    if (newIdArray.length === 1) {
      return newIdArray[0].newId
    }
    throw "Error new id not found for user id " + id
  }
  return undefined
}

const backupDelete = async (backup: string) => {
  const dirExport = getDirExport(backup)
  const exportTxt = fs.readFileSync(dirExport + '/user.json')
  const listExport = JSON.parse(exportTxt.toString())
  if (listExport) {
    fs.rmdirSync(dirExport, { recursive: true })
  }
}

const backupRestore = async (backup: string) => {
  const dirExport = getDirExport(backup)
  const exportTxt = fs.readFileSync(dirExport + '/user.json')
  const listExport = JSON.parse(exportTxt.toString())
  const t = await db.sequelize.transaction()
  try {
    await User.destroy({
      where: { id: { [Op.ne]: 0 } },
      transaction: t
    })
    await Role.destroy({
      where: { id: { [Op.ne]: 0 } },
      transaction: t
    })
    await File.destroy({
      where: { id: { [Op.ne]: 0 } },
      transaction: t
    })

    const newRoleId: Array<{ id: number, newId: number }> = await Promise.all(listExport.roleList.map(async (role: RoleAttributes) => {
      const { id, ...roleToCreate } = role
      const newRole = await Role.create(roleToCreate, { transaction: t })
      return { id, newId: newRole.id }
    }))

    const newFileId: Array<{ id: number, newId: number }> = await Promise.all(listExport.fileList.map(async (file: FileAttributes) => {
      const { id, ...fileToCreate } = file
      fileToCreate.content = Buffer.from(fileToCreate.content)
      const newFile = await File.create(fileToCreate, { transaction: t })
      return { id, newId: newFile.id }
    }))

    await Promise.all(listExport.userList.map(async (user: UserAttributes) => {
      const { id, ...userToCreate } = user
      userToCreate.photoId = getNewId(user.photoId, newFileId)
      await User.create(userToCreate, { transaction: t })
    }))

    /*
    const dirExportUpload = path.join(dirExport, "upload")
    checkDir(dirUpload)

    fs.readdirSync(dirUpload, { withFileTypes: true })
      .filter(dirent => dirent.isFile() &&
        dirent.name.endsWith(".jpg") &&
        dirent.name.startsWith("member_"))
      .map(dirent => {
        fs.unlinkSync(path.join(dirUpload, dirent.name))
      })
    fs.readdirSync(dirExportUpload, { withFileTypes: true })
      .filter(dirent => dirent.isFile() &&
        dirent.name.endsWith(".jpg") &&
        dirent.name.startsWith("member_"))
      .map(dirent => {
        console.info("file upload " + dirent.name)
        const fileIdStr = dirent.name.substring(7, dirent.name.length - 4)
        console.info(fileIdStr)
        const fileId = parseInt(fileIdStr)
        let newFileId
        try {
          newFileId = getNewId(fileId, newId)
        } catch {
          console.error("file " + fileId + " is not link to newId")
        }
        if (newFileId) {
          const oldFilePath = path.join(dirExportUpload, dirent.name)
          const newFilePath = path.join(dirUpload, "member_" + newFileId + ".jpg")
          fs.copyFileSync(oldFilePath, newFilePath)
          console.info("file copy " + oldFilePath + " to " + newFilePath)
        } else {
          console.error("Error : file " + fileId + " is not link to newId")
        }
      })
      */
    await t.commit()
  } catch (err) {
    await t.rollback()
    throw err
  }

}

export { backupUser, backupUserList, backupRestore, backupDelete }
