const host = process.env.DB || 'localhost';
const port = parseInt(process.env.DB_PORT, 10) || 3309;

export default {
  host,
  port,
  user: 'boutsdefisel',
  password: 'boutsdefisel',
  database: 'boutsdefisel',
  charset: 'utf8'
};
