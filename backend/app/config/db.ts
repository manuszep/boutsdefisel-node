const host = process.env.DB || 'localhost';
const port = parseInt(process.env.DB_PORT, 10) || 3309;

export default {
  host,
  user: 'boutsdefisel',
  password: 'boutsdefisel',
  database: 'boutsdefisel',
  port,
  charset: 'utf8'
};
