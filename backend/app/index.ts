import Routes from './api/routes';
import security from './config/security';

import express = require('express');
import bodyParser = require('body-parser');
import morgan = require('morgan');

const app = express();
const port = 7070;
const domain = process.env.DOMAIN || 'localhost';

app.set('trust proxy', 'loopback');
app.set('secret', security.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

Routes(app);

app.listen(port, domain);

export default app;
