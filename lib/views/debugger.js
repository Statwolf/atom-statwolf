'use babel';

import electron from 'electron';
import EventEmitter from 'events';
import path from 'path';
import dataStore from '../utils/data-store';

export default function() {

  const emitter = new EventEmitter();

  const dbgStatusStore = dataStore('dbgStatus', {
    deep: true
  });
  dbgStatus = dbgStatusStore.getData();

  const container = new electron.remote.BrowserWindow(dbgStatus.geometry);
  container.setMenu(null);
  container.setTitle('Statwolf Debugger');

  if(dbgStatus.isMaximized == null || dbgStatus.isMaximized === true) {
    container.maximize();
  }

  if(process.env.DEBUG_SW_DEBUGGER === "true") {
    container.webContents.openDevTools();
  }

  emitter.show = function() {
    container.show();
  };

  container.loadURL(path.join('file://', __dirname, '..', '..', 'debugger', 'index.html'));

  const closeRecursive = function() {
    container.close();
  };
  electron.remote.getCurrentWindow().on('close', closeRecursive);

  const sendConfig = function(data) {
    container.webContents.send('config', data);
  };
  const env = dataStore('env');
  const handle = env.on('change', sendConfig);
  container.on('close', function() {
    electron.remote.getCurrentWindow().removeListener('close', closeRecursive);
    env.removeListener('change', handle);
    emitter.emit('close');
  });
  container.webContents.on('did-finish-load', function() {
    sendConfig(env.getData());
  });

  return emitter;

};
