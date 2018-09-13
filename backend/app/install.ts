import db from './lib/db';
import UserModel from './api/models/UserModel';
import UserManager from './api/models/UserManager';
import { ROLE_ADMIN } from './lib/roles';
const fs = require('fs');
const installSql = fs.readFileSync('./dbSchema.sql').toString().split('${database_name}').join('boutsdefisel');
const adminData = {
  "username": "admin",
  "email": "admin@test.com",
  "plainPassword": "admin",
  "role": ROLE_ADMIN,
  "enabled": true
};

console.log(process.argv)
const drop = process.argv[2];
let dropQuery = "";

if (drop === "drop") {
  dropQuery = "DROP DATABASE `boutsdefisel`;CREATE DATABASE `boutsdefisel`;"
}

console.log("Database creation...");
db.query(`${dropQuery}${installSql}`)
  .then(() => {
    console.log("Executed.");

    if (drop === "drop") {
      console.log("Creating admin user...");
      return UserManager.getModel(adminData).persist();
    }
  })
  .then(() => {
    console.log("Finished!");
    process.exit();
  })
  .catch(err => {
    console.log(err);

    process.exit();
  });
