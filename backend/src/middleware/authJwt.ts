import jwt from 'jsonwebtoken'
import config from '../config/authConfig'
import db from '../models'
const User = db.user;
import { RequestHandler } from 'express'

const verifyToken: RequestHandler = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  if (Array.isArray(token)) {
    return res.status(401).send({
      message: "Unauthorized because of multiple x-access-token!"
    });
  } else {
    jwt.verify(token, config.secret, (err, decoded: any) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      if (decoded) {
        res.locals.userId = decoded.id;
        next();
      }
    });
  }


};

const isAdmin: RequestHandler = (_req, res, next) => {
  User.findByPk(res.locals.userId).then(user => {
    if (!user) {
      res.status(403).send({
        message: "Require Admin Role! But user is not set"
      });
      return;
    }
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

const isModerator: RequestHandler = (_req, res, next) => {
  User.findByPk(res.locals.userId).then(user => {
    if (!user) {
      res.status(403).send({
        message: "Require Moderator Role! But user is not set"
      });
      return;
    }
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};

const isModeratorOrAdmin: RequestHandler = (_req, res, next) => {
  User.findByPk(res.locals.userId).then(user => {
    if (!user) {
      res.status(403).send({
        message: "Require Moderator or Admin Role! But user is not set"
      });
      return;
    }
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

export {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin
};
