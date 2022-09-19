import {
  verifyToken,
  isAdmin,
} from '../middleware/authJwt';
import {
  addUser,
  updateUser,
  deleteUser,
  listUser,
} from '../controllers/userController'

import express from 'express'

const userRoutes = function(app: express.Application) {
  app.use(function(_req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });


  app.post(
    "/api/user/add",
    [verifyToken, isAdmin],
    addUser
  );

  app.post(
    "/api/user/update",
    [verifyToken, isAdmin],
    updateUser
  );

  app.post(
    "/api/user/delete",
    [verifyToken, isAdmin],
    deleteUser
  );

  app.post(
    "/api/user/list",
    [verifyToken, isAdmin],
    listUser
  );

};

export default userRoutes
