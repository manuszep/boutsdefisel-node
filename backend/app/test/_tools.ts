require('./env.ts');

const mochaLog = require('mocha-report-log');
import db from '../lib/db';
import UserModel from '../api/models/UserModel';
import UserManager from '../api/models/UserManager';
import { ROLE_ADMIN } from '../lib/roles';

const adminData = {
  "username": "admin",
  "email": "admin@test.com",
  "plainPassword": "admin",
  "role": ROLE_ADMIN,
  "enabled": true
};

export const logKeys = (value) => {
  for(let k in value) {
    mochaLog(k);
  }
}

export const cleanDb = () => {
  return db.query("DELETE FROM exchanges;")
    .then(() => {
      return db.query("DELETE FROM services;")
    })
    .then(() => {
      return db.query("DELETE FROM categories;")
    })
    .then(() => {
      return db.query("DELETE FROM users;")
    })
    .then(() => {
      return UserManager.getModel(adminData).persist();
    })
    .catch(err => {
      mochaLog(err.code)
    });
}

export const getSecurityToken = () => {
  const u = new UserModel({
    "username": "admin",
    "plainPassword": "admin"
  });

  return u.authenticate("admin");
}
