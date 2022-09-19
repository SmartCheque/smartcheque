import { RequestHandler } from 'express'

import {
  backupUser as backupUserFunction,
  backupUserList as backupUserListFunction,
  backupRestore,
  backupDelete,
} from '../maintenance/backupUser'

const backupUser: RequestHandler = async (_req, res) => {
  backupUserFunction().then(() => {
    res.send({ message: "Backup success!" })
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

const backupUserList: RequestHandler = async (_req, res) => {
  backupUserListFunction().then((list: Array<string>) => {
    res.send({ backupList: list })
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

const backupRestoreUser: RequestHandler = async (req, res) => {
  backupRestore(req.body.backup).then(() => {
    res.send({ message: "Backup restore success!" })
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}

const backupDeleteUser: RequestHandler = async (req, res) => {
  backupDelete(req.body.backup).then(() => {
    res.send({ message: "Backup delete success!" })
  }).catch((err) => {
    res.status(500).send({ message: err.message })
  })
}


export { backupUser, backupUserList, backupRestoreUser, backupDeleteUser }
