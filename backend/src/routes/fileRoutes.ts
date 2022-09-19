import path from 'path'
import fs from 'fs'

import {
  verifyToken,
} from '../middleware/authJwt';

import express from 'express'

const dir = path.join(__dirname, '..', '..', '..', 'upload')
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, 0o700);
}

const fileRoutes = function(app: express.Application) {
  app.use('/api/user/image', [verifyToken], express.static(dir));
}

export default fileRoutes
