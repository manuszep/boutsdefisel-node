import dbConfig from '../config/db.js';

import mysql = require('promise-mysql');

const db = mysql.createPool(dbConfig);

export default db;
