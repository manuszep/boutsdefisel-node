import mysql = require('promise-mysql');
import dbConfig from '../config/db.js';

const db = mysql.createPool(dbConfig);

export default db;
