import { RequestHandler } from 'express';
import db from '../models'
const User = db.user;
const Role = db.role;

const deleteUser: RequestHandler = async (req, res) => {
  User.destroy({
    where: {
      id: req.body.id,
    }
  }).then(async rowDeleted => {
    if (rowDeleted) {
      res.send({ message: "User deleted successfully!" })
    } else {
      res.status(500).send({ message: "User id not found" })
    }
  }).catch(async err => {
    res.status(500).send({ message: err.message })
  })
}

const addUser: RequestHandler = async (req, res) => {

  const t = await db.sequelize.transaction()

  User.create({
    email: req.body.email,
    password: req.body.password,
  }, { transaction: t }).then(async (user) => {
    await user.setRoles(req.body.role, { transaction: t })
    await t.commit()
    res.send({ message: "User added successfully!" });
  }).catch(async err => {
    await t.rollback()
    res.status(500).send({ message: err.message })
  })
}

const updateUser: RequestHandler = async (req, res) => {

  const t = await db.sequelize.transaction()

  User.findByPk(req.body.id, { transaction: t }).then(async (user) => {
    if (user) {

      user.email = req.body.email

      user.save({ transaction: t }).then(async () => {
        await user.setRoles(req.body.role, { transaction: t })
        await t.commit()
        res.send({ message: "User updated successfully!" });
      }
      ).catch(async err => {
        await t.rollback()
        res.status(500).send({ message: err.message })
      })
    }
  })
}

const listUser: RequestHandler = async (_req, res) => {
  User.findAll({
    /* attributes: ['id', 'email', 'createdAt', 'updatedAt'] */
  }).then(async userList => {
    Role.findAll().then(async (roleList) => {
      const list = await Promise.all(userList.map(async (userItem) => {
        return {
          id: userItem.id,
          email: userItem.email,
          role: (await userItem.getRoles({
            attributes: ['id']
          })).map((role) => role.id)
        }
      }))
      res.send({
        list, roleList
      })
    }).catch(async err => {
      res.status(500).send({ message: err.message })
    })
  }).catch(async err => {
    res.status(500).send({ message: err.message })
  })
}

export {
  addUser,
  deleteUser,
  updateUser,
  listUser,
}
