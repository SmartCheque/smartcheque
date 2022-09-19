import {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} from '../middleware/verifySignUp'
import {
  signup,
  signin
} from '../controllers/authController'
import express from 'express'

const authRoute = function(app: express.Application) {
  app.use(function(_req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      checkDuplicateUsernameOrEmail,
      checkRolesExisted
    ],
    signup
  );

  app.post("/api/auth/signin", signin);
};

export default authRoute
