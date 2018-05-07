import express from 'express';
import bodyParser from 'body-parser';
import UserRoute from './api/routes/UserRoute.js';

const app = express();
const port = 7070;

app.set('trust proxy', 'loopback');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

UserRoute(app);

app.listen(port, "backend");
