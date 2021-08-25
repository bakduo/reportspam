'use strict'

const configLoad = require('config');
const app = configLoad.get('app');
const DBCustom = require('../datasource/dbcustom');

const config = {
  server: {
    port: app.port || 3000,
    dbtype: app.db.dbtype || 'mongo',
  },
  db: {},
  mqservice: app.mservice
};

//Remember use Secret for this.

config.db = new DBCustom({
  dbtype: config.server.dbtype,
  url:`${app.db.connector}://${app.db.user}:${app.db.passwd}@${app.db.host}:${app.db.port}/${app.db.dbname}`,
  dbname:`${app.db.dbname}`,
  secure:`${app.db.secure}`,
  schema:app.db.schema || '' //Se pasa normal porque al pasarlo como backytick lo convierte
});

module.exports = config;