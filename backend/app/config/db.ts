const host = process.env.DB || 'localhost';
const port = parseInt(process.env.DB_PORT) || 3309;

export default {
  host: host,
  user: 'boutsdefisel',
  password: 'boutsdefisel',
  database: 'boutsdefisel',
  port: port,
  charset: 'utf8'
};
