import express = require('express');
import bodyParser = require('body-parser');
import morgan = require('morgan');
import UserRoute from './api/routes/UserRoute';
import security from './config/security';

const app = express();
const port = 7070;

app.set('trust proxy', 'loopback');
app.set('secret', security.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

UserRoute(app);

app.listen(port, "backend");
