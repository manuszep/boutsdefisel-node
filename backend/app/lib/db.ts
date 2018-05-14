import dbConfig from '../config/db';

import mysql = require('promise-mysql');

const db = mysql.createPool(dbConfig);

export default db;
