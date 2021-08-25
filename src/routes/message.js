const express = require('express');

const MQService = require('../service/mqservice');

const MessageController = require('../api/message');

const routerMessage = express.Router();

const config = require('../config/index');

const MessageDAO = require('../dao/message-dao');

const repo = new MessageDAO(config.db);

const mqs = new MQService();

const controller = new MessageController(repo,mqs);

/******Control router*************/
routerMessage.get('/list', controller.getAll);
routerMessage.get('/list/:id',controller.get);
routerMessage.post('/save',controller.save);
routerMessage.put('/update/:id',  controller.update);
routerMessage.delete('/delete/:id',controller.delete);
routerMessage.delete('/deleteAll',controller.deleteAll);
/** ******************************* */

module.exports = routerMessage;