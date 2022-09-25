import {
  fundWallet,
  checkFaucetController,
} from '../controllers/walletController'

import {
  verifyAddress,
  verifyChainId,
} from '../middleware/verifyWallet'

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
    "/api/wallet/fund",
    [verifyAddress, verifyChainId],
    fundWallet
  );

  app.post(
    "/api/wallet/checkFaucet",
    [verifyAddress, verifyChainId],
    checkFaucetController
  );
};

export default authRoute
