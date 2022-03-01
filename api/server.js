const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const usersRouter = require('./users/user-router');
const potluckRouter = require('./potlucks/potluck-router');
const itemsRouter = require('./items/item-router');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use('/api/users', usersRouter);
server.use('/api/potluck', potluckRouter);
server.param('id', (req, res, next, id) => {
    req.id = id;
    next();
});
server.use('/api/potluck/:id', itemsRouter);

module.exports = server;