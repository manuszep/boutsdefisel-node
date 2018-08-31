const host = process.env.DB_HOST || 'localhost';
const port = parseInt(process.env.DB_PORT, 10) || 3309;
const user = process.env.DB_USER || 'boutsdefisel';
const password = process.env.DB_PASSWORD || 'boutsdefisel';
const database = process.env.DB_DATABASE || 'boutsdefisel';

export default {
  host,
  port,
  user: user,
  password: password,
  database: database,
  charset: 'utf8'
};
