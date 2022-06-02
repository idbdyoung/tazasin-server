import 'dotenv/config';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import Cors from './lib/cors';
import WebSocket from './lib/websocket';

import enter from './routes/enter';
import signup from './routes/signup';
import user from './routes/user';
import game from './routes/game';
import handleError from './handleError';
import bearerToken from 'express-bearer-token';

const app = express();
const server = http.createServer(app);

app.use(bearerToken());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(Cors);

app.use('/user', user);
app.use('/enter', enter);
app.use('/signup', signup);
app.use('/game', game);

app.use(handleError);

server.listen(process.env.PORT, () => console.log(`🚀running on port: ${process.env.PORT}`));
WebSocket(server);
