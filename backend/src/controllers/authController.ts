import db from '../models'
import config from '../config/authConfig'
const User = db.user;
const Role = db.role;
import { RequestHandler } from 'express';

import { Op } from 'sequelize'

import jwt from "jsonwebtoken";
var bcrypt = require("bcryptjs");

const signup: RequestHandler = async (req, res) => {
  console.log("using transaction")
  //const t = await db.sequelize.transaction();
  // Save User to Database
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  }/*, { transaction: t }*/)
    .then(async user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }/*, transaction: t*/
        }).then(async roles => {
          user.setRoles(roles, /*{ transaction: t }*/).then(async () => {
            //await t.commit()
            res.send({ message: "User registered successfully!" });
          }).catch(async err => {
            //await t.rollback()
            res.status(500).send({ message: err.message })
          })
        }).catch(async err => {
          //await t.rollback()
          res.status(500).send({ message: err.message })
        })
      } else {
        // user role = 1
        user.setRoles([1]).then(async () => {
          //await t.commit()
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(async err => {
      //await t.rollback()
      res.status(500).send({ message: err.message })
    })
};

const signin: RequestHandler = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      const authorities: Array<string> = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

export { signup, signin }
