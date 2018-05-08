import mysql = require('promise-mysql');
import dbConfig from '../config/db.js';

const connection = mysql.createPool(dbConfig);

export default connection;
