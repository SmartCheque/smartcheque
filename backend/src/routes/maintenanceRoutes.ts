import {
  verifyToken,
  isAdmin,
} from '../middleware/authJwt';

import { backupUser, backupUserList, backupRestoreUser, backupDeleteUser } from '../controllers/maintenanceController'

import express from 'express'

const maintenanceRoutes = function(app: express.Application) {
  app.use(function(_req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/maintenance/backup",
    [verifyToken, isAdmin],
    backupUser
  );

  app.post(
    "/api/maintenance/backuplist",
    [verifyToken, isAdmin],
    backupUserList
  );

  app.post(
    "/api/maintenance/restore",
    [verifyToken, isAdmin],
    backupRestoreUser
  );

  app.post(
    "/api/maintenance/delete",
    [verifyToken, isAdmin],
    backupDeleteUser
  );

};

export default maintenanceRoutes
