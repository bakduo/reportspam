#!/usr/bin/env node

'use string';

const app = require('../src/app');
const config = require('../src/config/index');
const { port } = config.server;
const http = require('http').Server(app);
// pongo a escuchar el servidor en el puerto indicado
const server = http.listen(port, () => {
    console.log(`servidor socket escuchando en http://localhost:${port}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error socket en el servidor:', error);
});

process.on('SIGTERM', () => {

    server.close(() => {
      console.log('Process terminated')
    });
    const MQService = require('../service/mqservice');
    const mqs = new MQService('user-messages');
    mqs.close();

  })

process.on('exit', (code) => {
    
    console.log('process exited with code: ' + code);

    server.close(() => {
        console.log('Process terminated')
      });

    const MQService = require('../service/mqservice');
    const mqs = new MQService('user-messages');
    mqs.close();
});
  