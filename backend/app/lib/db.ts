import mysql from 'mysql';
import dbConfig from '../config/db.js';

const connection = mysql.createConnection(dbConfig);

connection.connect();

export default connection;
