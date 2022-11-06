import express from 'express'

import {
  deployContract,
  getContract,
  createBank,
  getAllowance,
} from '../controllers/contractController'

import {
  verifyToken,
  isAdmin,
} from '../middleware/authJwt';

const contractRoute = function(app: express.Application) {
  app.use(function(_req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/contract/deploy",
    [verifyToken, isAdmin],
    deployContract
  );

  app.post(
    "/api/contract/get",
    [verifyToken, isAdmin],
    getContract
  );

  app.post(
    "/api/bank/create",
    [verifyToken, isAdmin],
    createBank
  );

  app.post(
    "/api/bank/allowance",
    [],
    getAllowance
  );
};

export default contractRoute
